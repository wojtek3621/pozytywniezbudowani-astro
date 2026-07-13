/**
 * Cloudflare Worker entry — pozytywniezbudowani.pl
 *
 * Adaptacja Pages Function → Workers (2026-06-10, F3 planu
 * aios-workspace/plans/active/2026-06-10-pz-analytics-faza1-2-wdrozenie.md).
 *
 * Routing:
 *   - POST/OPTIONS /api/perf-beacon  → telemetry ingest (logika 1:1 z
 *     functions/api/perf-beacon.ts — tamten plik pozostaje jako referencja
 *     Pages + źródło testów validatora)
 *   - wszystko inne → static assets (binding ASSETS, directory=dist)
 *
 * Uwaga: Workers static assets serwuje pliki PRZED workerem tylko gdy
 * plik istnieje; /api/* nie istnieje w dist → trafia tutaj. _redirects
 * z dist działa na poziomie assets (zweryfikowane po deploy — F2 302).
 */

// Typy walidatora pochodzą z JSDoc w .mjs (allowJs) — brak potrzeby .d.ts
import { validatePayload, MAX_PAYLOAD_BYTES } from '../functions/api/_perf-beacon-validator.mjs';

interface Env {
  PERF_TELEMETRY: D1Database;
  ASSETS: Fetcher;
  /** Worker secret (wrangler secret put MAILERLITE_API_TOKEN) — lead magnet /api/subscribe */
  MAILERLITE_API_TOKEN?: string;
}

// Lead magnet książki — dedykowana grupa MailerLite `ksiazka-darmowy-rozdzial-2026`
// (utworzona przez API 2026-07-06; build: aios-workspace/builds/2026-07-05-ksiazka-sprint1/)
const MAILERLITE_GROUP_KSIAZKA_LM = '192225203776914742';
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api/subscribers';
const SUBSCRIBE_MAX_BODY_BYTES = 2048;
// Prosty format-check: coś@coś.coś, bez spacji, sensowna długość
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,24}$/;

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
    // H5: sanitized error logging — name + truncated message only.
    const err = error as Error;
    const name = typeof err?.name === 'string' ? err.name : 'UnknownError';
    const message = typeof err?.message === 'string' ? err.message.substring(0, 500) : '';
    console.error('perf-beacon: D1 insert failed', { name, message });
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
 * POST /api/subscribe — zapis na lead magnet (darmowy rozdział książki).
 * Body: { email: string, consent: true, website?: string (honeypot) }.
 * Same-origin fetch ze strony /darmowy-rozdzial — bez nagłówków CORS
 * (celowo: cross-origin POST-y z obcych domen nie odczytają odpowiedzi).
 */
async function handleSubscribePost(request: Request, env: Env): Promise<Response> {
  if (!env.MAILERLITE_API_TOKEN) {
    console.error('subscribe: MAILERLITE_API_TOKEN secret missing');
    return jsonResponse({ ok: false, error: 'Service not configured' }, 503);
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > SUBSCRIBE_MAX_BODY_BYTES) {
    return jsonResponse({ ok: false, error: 'Payload too large' }, 413);
  }

  let parsed: { email?: unknown; consent?: unknown; website?: unknown };
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

  try {
    const mlResp = await fetch(MAILERLITE_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.MAILERLITE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        groups: [MAILERLITE_GROUP_KSIAZKA_LM],
        status: 'active',
      }),
    });
    // MailerLite: 200 = istniejący subskrybent zaktualizowany, 201 = nowy
    if (mlResp.ok) {
      return jsonResponse({ ok: true }, 200);
    }
    const detail = (await mlResp.text()).substring(0, 300);
    console.error('subscribe: MailerLite error', { status: mlResp.status, detail });
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

    // Everything else → static assets (Astro dist)
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
