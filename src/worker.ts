/**
 * Cloudflare Worker entry – pozytywniezbudowani.pl
 *
 * Adaptacja Pages Function → Workers (2026-06-10, F3 planu
 * aios-workspace/plans/active/2026-06-10-pz-analytics-faza1-2-wdrozenie.md).
 *
 * Routing:
 *   - POST/OPTIONS /api/perf-beacon  → telemetry ingest (logika 1:1 z
 *     functions/api/perf-beacon.ts – tamten plik pozostaje jako referencja
 *     Pages + źródło testów validatora)
 *   - wszystko inne → static assets (binding ASSETS, directory=dist)
 *
 * Uwaga: Workers static assets serwuje pliki PRZED workerem tylko gdy
 * plik istnieje; /api/* nie istnieje w dist → trafia tutaj. _redirects
 * z dist działa na poziomie assets (zweryfikowane po deploy – F2 302).
 */

// isbot (npm, MIT) – lista known-bot user-agents na EDGE (Warstwa 0 detekcji botów,
// misja jakosc-ruchu 2026-07-18). Wynik ua_is_bot dopisywany do zdarzenia /api/z,
// scoring pełny liczy botscore.py w tracking.db. NIE blokuje zapisu (nic nie kasujemy).
import { isbot } from 'isbot';
// Typy walidatora pochodzą z JSDoc w .mjs (allowJs) – brak potrzeby .d.ts
import { validatePayload, MAX_PAYLOAD_BYTES } from '../functions/api/_perf-beacon-validator.mjs';
import {
  validateConsentPayload,
  CONSENT_MAX_PAYLOAD_BYTES,
} from '../functions/api/_consent-beacon-validator.mjs';
import { validateZPayload, Z_MAX_PAYLOAD_BYTES } from '../functions/api/_z-beacon-validator.mjs';

interface Env {
  PERF_TELEMETRY: D1Database;
  ASSETS: Fetcher;
  /**
   * Worker secret (wrangler secret put NEWSLETTER_INGEST_TOKEN) – zapis na listę.
   * Ten sam sekret siedzi w data/.env na VPS. Endpoint newslettera jest fail-closed:
   * bez nagłówka X-Newsletter-Token odpowiada 403, więc nikt z zewnątrz nie zapisze
   * obcego adresu (mail-bombing z domeny PZ).
   */
  NEWSLETTER_INGEST_TOKEN?: string;
}

// Zapis na listę mailingową – system in-house AIOS (misja 2026-07-14, następca
// MailerLite). Worker jest PROXY: waliduje, odsiewa boty i przekazuje zapis na VPS.
// Dzięki temu przeglądarka robi zwykły same-origin POST (zero CORS), a my mamy
// po stronie serwera prawdziwe IP klienta do consent logu (RODO: dowód zgody).
//
// ROLLBACK do MailerLite: git revert tego commita (secret MAILERLITE_API_TOKEN
// w Workerze NIE został skasowany – stara ścieżka wróci od ręki).
const NEWSLETTER_API_URL = 'https://platforma.pozytywniezbudowani.pl/api/newsletter/subscribe';
const SUBSCRIBE_MAX_BODY_BYTES = 2048;
// Prosty format-check: coś@coś.coś, bez spacji, sensowna długość
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,24}$/;
// Źródła zapisu (trafiają do consent logu – widać, z którego formularza przyszedł człowiek)
const ALLOWED_SOURCES = ['form_newsletter', 'form_ksiazka_lm'];
const DEFAULT_SOURCE = 'form_newsletter';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': 'https://pozytywniezbudowani.pl',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Max-Age': '86400',
};

function textResponse(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
  });
}

async function handleBeaconPost(request: Request, env: Env): Promise<Response> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return textResponse('Payload too large', 413);
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return textResponse('Invalid body', 400);
  }

  // H4: authoritative size check in UTF-8 bytes (TextEncoder), not UTF-16 units.
  const byteLength = new TextEncoder().encode(body).length;
  if (byteLength > MAX_PAYLOAD_BYTES) {
    return textResponse('Payload too large', 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return textResponse('Invalid JSON', 400);
  }

  const payload = validatePayload(parsed);
  if (!payload) {
    return textResponse('Invalid payload schema', 400);
  }

  if (!env.PERF_TELEMETRY) {
    return textResponse('Database binding missing', 500);
  }

  try {
    await env.PERF_TELEMETRY.prepare(
      `INSERT INTO perf_telemetry (
        session_id, timestamp_utc, page_path, user_agent, consent_state,
        viewport_width, connection_type,
        dom_content_loaded_ms, consent_default_set_ms, analytics_init_ms,
        first_interaction_ms, first_interaction_type,
        idle_fire_ms, load_analytics_start_ms, load_analytics_trigger,
        gtm_script_injected_ms, first_tracking_hit_ms, first_tracking_hit_type,
        bounced_before_tracking
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        payload.session_id,
        payload.timestamp_utc,
        payload.page_path,
        payload.user_agent ?? null,
        payload.consent_state ?? null,
        payload.viewport_width ?? null,
        payload.connection_type ?? null,
        payload.timings.dom_content_loaded_ms,
        payload.timings.consent_default_set_ms,
        payload.timings.analytics_init_ms,
        payload.timings.first_interaction_ms,
        payload.timings.first_interaction_type,
        payload.timings.idle_fire_ms,
        payload.timings.load_analytics_start_ms,
        payload.timings.load_analytics_trigger,
        payload.timings.gtm_script_injected_ms,
        payload.timings.first_tracking_hit_ms,
        payload.timings.first_tracking_hit_type,
        payload.bounced_before_tracking ? 1 : 0
      )
      .run();
  } catch (error) {
    // H5: sanitized error logging – name + truncated message only.
    const err = error as Error;
    const name = typeof err?.name === 'string' ? err.name : 'UnknownError';
    const message = typeof err?.message === 'string' ? err.message.substring(0, 500) : '';
    console.error('perf-beacon: D1 insert failed', { name, message });
    return textResponse('Database error', 500);
  }

  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/consent-beacon – pomiar banera cookie (misja „Analityka" 2026-07-14) +
 * consent RECEIPT (de-anonimizacja, misja „jakosc-ruchu" 2026-07-18).
 *
 * Widzi ludzi UCIEKAJĄCYCH przed zgodą (GA4 startuje dopiero po „Akceptuję").
 * Od 2026-07-18 beacon NIE jest już anonimowy: payload niesie device_id (pz_did,
 * wspólny z kolektorem z.js), banner_version i purposes, a Worker DOKŁADA IP + UA
 * server-side (nigdy z klienta) — to dowód zgody RODO art. 7 wiązany z tożsamością
 * w tracking.db. GPC/DNT świadomie NIE czytane. Sync na VPS:
 * automation/pz_consent_d1_sync.py (D1 → aios.db:web_consent_events).
 */
async function handleConsentBeaconPost(request: Request, env: Env): Promise<Response> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > CONSENT_MAX_PAYLOAD_BYTES) {
    return textResponse('Payload too large', 413);
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return textResponse('Invalid body', 400);
  }

  if (new TextEncoder().encode(body).length > CONSENT_MAX_PAYLOAD_BYTES) {
    return textResponse('Payload too large', 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return textResponse('Invalid JSON', 400);
  }

  const payload = validateConsentPayload(parsed);
  if (!payload) {
    return textResponse('Invalid payload schema', 400);
  }

  if (!env.PERF_TELEMETRY) {
    return textResponse('Database binding missing', 500);
  }

  // De-anon: IP + UA dokładane SERVER-SIDE (nigdy z klienta). GPC/DNT nie czytane.
  const consentIp = request.headers.get('cf-connecting-ip');
  const consentUa = (request.headers.get('user-agent') ?? '').slice(0, 400) || null;

  try {
    await env.PERF_TELEMETRY.prepare(
      `INSERT INTO consent_events (
        ts, event, page_path, device, ms_to_decision, analytics, marketing,
        device_id, ip, user_agent, purposes, banner_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?)`
    )
      .bind(
        payload.ts,
        payload.event,
        payload.page_path,
        payload.device,
        payload.ms_to_decision,
        payload.analytics,
        payload.marketing,
        payload.device_id,
        consentIp,
        consentUa,
        payload.purposes,
        payload.banner_version
      )
      .run();
  } catch (error) {
    const err = error as Error;
    const name = typeof err?.name === 'string' ? err.name : 'UnknownError';
    const message = typeof err?.message === 'string' ? err.message.substring(0, 500) : '';
    console.error('consent-beacon: D1 insert failed', { name, message });
    return textResponse('Database error', 500);
  }

  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/z – first-party behavioral collector (misja „analityka-atrybucja"
 * 2026-07-18, aios-workspace/builds/2026-07-18-analityka-atrybucja/).
 *
 * Osobny, RÓWNOLEGŁY system do beaconu zgód (reguła A: consent-beacon nietknięty).
 * Zbiera zachowanie first-party: page_view / page_leave / click_out z device_id,
 * session_id, fingerprintem, utm/referrer, sygnałami urządzenia. Worker DOKŁADA
 * sygnały server-side z request.cf (IP, kraj/ASN, TLS, RTT, JA3/bot jeśli plan daje)
 * — czytane defensywnie (null gdy brak). Reguła B: to nasza infra (D1→tracking.db),
 * NIC nie leci do zewnętrznych narzędzi. Sync: aios-workspace/automation/pz_tracking_d1_sync.py.
 */
async function handleZBeaconPost(request: Request, env: Env): Promise<Response> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > Z_MAX_PAYLOAD_BYTES) {
    return textResponse('Payload too large', 413);
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return textResponse('Invalid body', 400);
  }

  if (new TextEncoder().encode(body).length > Z_MAX_PAYLOAD_BYTES) {
    return textResponse('Payload too large', 413);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return textResponse('Invalid JSON', 400);
  }

  const p = validateZPayload(parsed);
  if (!p) {
    return textResponse('Invalid payload schema', 400);
  }

  if (!env.PERF_TELEMETRY) {
    return textResponse('Database binding missing', 500);
  }

  // Server-side enrichment z request.cf + nagłówków. Wszystko defensywnie:
  // pola nieobecne na naszym planie CF (ja3Hash, botManagement) → null.
  const cf = (request.cf ?? {}) as Record<string, unknown>;
  const asNum = (v: unknown): number | null =>
    typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : null;
  const asStr = (v: unknown, max: number): string | null =>
    typeof v === 'string' && v.length ? v.slice(0, max) : null;
  const botMgmt = (cf.botManagement ?? {}) as Record<string, unknown>;

  // Warstwa 0 detekcji na edge: known-bot UA po liście isbot. Sygnał, nie blokada.
  const rawUa = (request.headers.get('user-agent') ?? '').slice(0, 400) || null;
  const uaIsBot = rawUa ? (isbot(rawUa) ? 1 : 0) : null;

  try {
    await env.PERF_TELEMETRY.prepare(
      `INSERT OR IGNORE INTO track_events (
        event_uid, site, ts, received_at, event_type,
        device_id, session_id, fingerprint,
        path, query, referrer, referrer_host, title,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        nlt, pxid,
        screen_w, screen_h, viewport_w, viewport_h, device_pixel_ratio,
        language, timezone, hardware_concurrency, device_memory,
        connection_type, device_class,
        time_on_page_ms, active_time_ms, max_scroll_pct,
        outbound_url, outbound_host, link_text, is_checkout,
        ip, user_agent, accept_language,
        country, region, city, postal_code,
        asn, as_org, colo,
        http_protocol, tls_version, tls_cipher, client_tcp_rtt,
        ja3_hash, bot_score,
        webdriver, webgl_renderer, languages_count, ua_is_bot
      ) VALUES (
        ?, ?, ?, ?, ?,  ?, ?, ?,  ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,  ?, ?,
        ?, ?, ?, ?, ?,  ?, ?, ?, ?,  ?, ?,  ?, ?, ?,  ?, ?, ?, ?,
        ?, ?, ?,  ?, ?, ?, ?,  ?, ?, ?,  ?, ?, ?, ?,  ?, ?,
        ?, ?, ?, ?
      )`
    )
      .bind(
        p.event_uid, p.site, p.ts, new Date().toISOString(), p.event_type,
        p.device_id, p.session_id, p.fingerprint,
        p.path, p.query, p.referrer, p.referrer_host, p.title,
        p.utm_source, p.utm_medium, p.utm_campaign, p.utm_term, p.utm_content,
        p.nlt, p.pxid,
        p.screen_w, p.screen_h, p.viewport_w, p.viewport_h, p.device_pixel_ratio,
        p.language, p.timezone, p.hardware_concurrency, p.device_memory,
        p.connection_type, p.device_class,
        p.time_on_page_ms, p.active_time_ms, p.max_scroll_pct,
        p.outbound_url, p.outbound_host, p.link_text, p.is_checkout,
        request.headers.get('cf-connecting-ip'),
        rawUa,
        (request.headers.get('accept-language') ?? '').slice(0, 100) || null,
        asStr(cf.country, 3), asStr(cf.region, 80), asStr(cf.city, 120), asStr(cf.postalCode, 20),
        asNum(cf.asn), asStr(cf.asOrganization, 120), asStr(cf.colo, 10),
        asStr(cf.httpProtocol, 20), asStr(cf.tlsVersion, 20), asStr(cf.tlsCipher, 60),
        asNum(cf.clientTcpRtt),
        asStr(botMgmt.ja3Hash, 64), asNum(botMgmt.score),
        p.webdriver, p.webgl_renderer, p.languages_count, uaIsBot
      )
      .run();
  } catch (error) {
    const err = error as Error;
    const name = typeof err?.name === 'string' ? err.name : 'UnknownError';
    const message = typeof err?.message === 'string' ? err.message.substring(0, 500) : '';
    console.error('z-beacon: D1 insert failed', { name, message });
    return textResponse('Database error', 500);
  }

  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * POST /api/subscribe – zapis na listę mailingową (newsletter + lead magnet książki).
 * Body: { email: string, consent: true, source?: string, website?: string (honeypot),
 *         consent_text?: string }.
 *
 * Same-origin fetch ze stron /newsletter i /darmowy-rozdzial – bez nagłówków CORS
 * (celowo: cross-origin POST-y z obcych domen nie odczytają odpowiedzi).
 *
 * Zapis NIE aktywuje adresu od razu: backend wysyła mail z linkiem potwierdzającym
 * (double opt-in). Dopiero kliknięcie w tym mailu dopisuje człowieka do listy.
 */
async function handleSubscribePost(request: Request, env: Env): Promise<Response> {
  if (!env.NEWSLETTER_INGEST_TOKEN) {
    console.error('subscribe: NEWSLETTER_INGEST_TOKEN secret missing');
    return jsonResponse({ ok: false, error: 'Service not configured' }, 503);
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > SUBSCRIBE_MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: 'Payload too large' }, 413);
  }

  let parsed: {
    email?: unknown;
    consent?: unknown;
    website?: unknown;
    source?: unknown;
    consent_text?: unknown;
  };
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > SUBSCRIBE_MAX_BODY_BYTES) {
      return jsonResponse({ ok: false, error: 'Payload too large' }, 413);
    }
    parsed = JSON.parse(raw);
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  }

  // Honeypot: boty wypełniają ukryte pole → udajemy sukces, nic nie zapisujemy
  if (typeof parsed.website === 'string' && parsed.website.length > 0) {
    return jsonResponse({ ok: true }, 200);
  }

  const email = typeof parsed.email === 'string' ? parsed.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, error: 'Invalid email' }, 400);
  }
  if (parsed.consent !== true) {
    return jsonResponse({ ok: false, error: 'Consent required' }, 400);
  }

  const source =
    typeof parsed.source === 'string' && ALLOWED_SOURCES.includes(parsed.source) ? parsed.source : DEFAULT_SOURCE;

  try {
    const resp = await fetch(NEWSLETTER_API_URL, {
      method: 'POST',
      headers: {
        'X-Newsletter-Token': env.NEWSLETTER_INGEST_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        consent: true,
        source,
        // Prawdziwe IP i UA klienta – backend widzi tylko Workera, a consent log
        // ma trzymać dowód, KTO i SKĄD wyraził zgodę.
        client_ip: request.headers.get('cf-connecting-ip') ?? null,
        user_agent: (request.headers.get('user-agent') ?? '').substring(0, 300),
        consent_text: typeof parsed.consent_text === 'string' ? parsed.consent_text.substring(0, 2000) : null,
      }),
    });

    if (resp.ok) {
      return jsonResponse({ ok: true }, 200);
    }
    // 429 = rate-limit po stronie backendu – przekazujemy uczciwie, nie udajemy sukcesu
    if (resp.status === 429) {
      return jsonResponse({ ok: false, error: 'Too many requests' }, 429);
    }
    const detail = (await resp.text()).substring(0, 300);
    console.error('subscribe: newsletter backend error', { status: resp.status, detail });
    return jsonResponse({ ok: false, error: 'Subscription failed' }, 502);
  } catch (error) {
    const err = error as Error;
    console.error('subscribe: fetch failed', {
      name: typeof err?.name === 'string' ? err.name : 'UnknownError',
      message: typeof err?.message === 'string' ? err.message.substring(0, 300) : '',
    });
    return jsonResponse({ ok: false, error: 'Upstream error' }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/subscribe') {
      if (request.method === 'POST') {
        return handleSubscribePost(request, env);
      }
      return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
    }

    if (url.pathname === '/api/perf-beacon') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      if (request.method === 'POST') {
        return handleBeaconPost(request, env);
      }
      return textResponse('Method not allowed', 405);
    }

    if (url.pathname === '/api/consent-beacon') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      if (request.method === 'POST') {
        return handleConsentBeaconPost(request, env);
      }
      return textResponse('Method not allowed', 405);
    }

    if (url.pathname === '/api/z') {
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }
      if (request.method === 'POST') {
        return handleZBeaconPost(request, env);
      }
      return textResponse('Method not allowed', 405);
    }

    // Everything else → static assets (Astro dist)
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
