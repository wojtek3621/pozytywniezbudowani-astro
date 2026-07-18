/**
 * Behavioral collector payload validator — pure JS, no CF Workers globals.
 *
 * Endpoint /api/z (misja „analityka-atrybucja" 2026-07-18): first-party behavioral
 * collector for pozytywniezbudowani.pl. UNLIKE the consent beacon (anonymous by
 * design), this collector is first-party device/behavior tracking on OUR infra —
 * it MAY carry deanonymizing signals (device_id, fingerprint). Per mission rule B,
 * nothing here is ever forwarded to external tools; it lands only in our D1 →
 * tracking.db. Consent-gating and kill-switches for external tools stay untouched.
 *
 * Underscored filename keeps the CF Pages Functions router from treating this as a
 * route (same convention as _perf-beacon-validator.mjs / _consent-beacon-validator.mjs).
 *
 * The validator caps every string, bounds every number, and rejects unknown event
 * types. Server-side fields (ip, country, asn, tls…) are NOT accepted from the client
 * — the Worker fills them from request.cf. Anything a client sends in those keys is ignored.
 */

export const Z_MAX_PAYLOAD_BYTES = 4096;

export const VALID_Z_EVENTS = new Set(['page_view', 'page_leave', 'click_out']);
export const VALID_SITES = new Set(['pz', 'platforma', '4izby']);
export const VALID_DEVICE_CLASS = new Set(['mobile', 'tablet', 'desktop']);

const ISO8601_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
const UID_RE = /^[A-Za-z0-9_-]{1,64}$/; // uuid or fb-... fallback
const MS_MAX = 24 * 3600 * 1000; // 24h cap on any duration

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** clamp string or null */
function str(v, max) {
  if (typeof v !== 'string') return null;
  const s = v.slice(0, max);
  return s.length ? s : null;
}

/** non-negative int within [0,max] or null */
function intIn(v, max) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  const n = Math.round(v);
  if (n < 0 || n > max) return null;
  return n;
}

function num(v, max) {
  if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  if (v < 0 || v > max) return null;
  return v;
}

/**
 * @param {unknown} raw
 * @returns {object|null} sanitized client payload (server enriches separately) or null
 */
export function validateZPayload(raw) {
  if (!isPlainObject(raw)) return null;
  const o = raw;

  if (typeof o.event_type !== 'string' || !VALID_Z_EVENTS.has(o.event_type)) return null;
  if (typeof o.event_uid !== 'string' || !UID_RE.test(o.event_uid)) return null;
  if (typeof o.ts !== 'string' || o.ts.length > 30 || !ISO8601_UTC_RE.test(o.ts)) return null;

  const site = typeof o.site === 'string' && VALID_SITES.has(o.site) ? o.site : 'pz';

  // device_id / session_id: required identifiers, uid-shaped
  const device_id =
    typeof o.device_id === 'string' && UID_RE.test(o.device_id) ? o.device_id : null;
  const session_id =
    typeof o.session_id === 'string' && UID_RE.test(o.session_id) ? o.session_id : null;
  if (!device_id || !session_id) return null;

  const device_class =
    typeof o.device_class === 'string' && VALID_DEVICE_CLASS.has(o.device_class)
      ? o.device_class
      : null;

  return {
    event_uid: o.event_uid,
    site,
    ts: o.ts,
    event_type: o.event_type,
    device_id,
    session_id,
    fingerprint: str(o.fingerprint, 32),
    path: str(o.path, 300),
    query: str(o.query, 500),
    referrer: str(o.referrer, 500),
    referrer_host: str(o.referrer_host, 255),
    title: str(o.title, 200),
    utm_source: str(o.utm_source, 200),
    utm_medium: str(o.utm_medium, 200),
    utm_campaign: str(o.utm_campaign, 200),
    utm_term: str(o.utm_term, 200),
    utm_content: str(o.utm_content, 200),
    nlt: str(o.nlt, 128),
    pxid: str(o.pxid, 128),
    screen_w: intIn(o.screen_w, 20000),
    screen_h: intIn(o.screen_h, 20000),
    viewport_w: intIn(o.viewport_w, 20000),
    viewport_h: intIn(o.viewport_h, 20000),
    device_pixel_ratio: num(o.device_pixel_ratio, 10),
    language: str(o.language, 35),
    timezone: str(o.timezone, 60),
    hardware_concurrency: intIn(o.hardware_concurrency, 1024),
    device_memory: num(o.device_memory, 1024),
    connection_type: str(o.connection_type, 20),
    device_class,
    time_on_page_ms: intIn(o.time_on_page_ms, MS_MAX),
    active_time_ms: intIn(o.active_time_ms, MS_MAX),
    max_scroll_pct: intIn(o.max_scroll_pct, 100),
    outbound_url: str(o.outbound_url, 500),
    outbound_host: str(o.outbound_host, 255),
    link_text: str(o.link_text, 120),
    is_checkout: o.is_checkout === 1 || o.is_checkout === true ? 1 : 0,
    // Env-sygnały detekcji botów (Warstwa 2, misja jakosc-ruchu 2026-07-18) — MIĘKKIE.
    // webdriver: 1/0/null; webgl_renderer: string (np. 'software'/'none'/GPU); languages_count: int.
    // ua_is_bot NIE jest przyjmowane od klienta — Worker liczy je na edge (isbot).
    webdriver: o.webdriver === 1 || o.webdriver === true ? 1 : o.webdriver === 0 || o.webdriver === false ? 0 : null,
    webgl_renderer: str(o.webgl_renderer, 120),
    languages_count: intIn(o.languages_count, 50),
  };
}
