/**
 * Perf beacon payload validator — pure JS, no CF Workers globals.
 *
 * Extracted from perf-beacon.ts for isolated testability with Node's built-in
 * test runner (node --test) without requiring TypeScript tooling.
 *
 * Underscored filename prefix tells CF Pages Functions router to NOT treat
 * this as a route — it is a helper module.
 * https://developers.cloudflare.com/pages/functions/routing/#dynamic-routes
 *
 * Codex triple review fixes applied (2026-04-15):
 * - H7: timings field now rejects arrays (typeof [] === 'object' is true)
 * - H8: session_id must be UUID v4 OR fallback prefix (fb-*), page_path must
 *       whitelist /ksiazka* paths, timestamp_utc must be ISO8601 format.
 * - H6: MAX_PAYLOAD_BYTES is a constant shared with perf-beacon.ts (the wire
 *       size check is authoritative in perf-beacon.ts on raw body bytes;
 *       validator does not re-check to avoid duplicated logic).
 */

export const MAX_PAYLOAD_BYTES = 2048;

export const VALID_CONSENT_STATES = new Set(['denied', 'granted_analytics', 'granted_all']);
export const VALID_INTERACTION_TYPES = new Set(['scroll', 'pointerdown', 'keydown', 'unknown']);
export const VALID_TRIGGERS = new Set(['interaction', 'idle', 'setTimeout', 'unknown']);
export const VALID_TRACKING_TYPES = new Set(['gtm', 'ga4', 'meta']);

// H8: strict format regexes for identity and path fields.
// UUID v4 per RFC 4122 section 4.4. Accept lowercase/uppercase hex.
const UUID_V4_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Fallback session_id format from PerfTelemetry.astro when crypto API missing:
// "fb-" + base36(Date.now()) + "-" + base36(Math.random()) + "-" + base36(Math.random())
// Bounded length: "fb-" (3) + up to 11 chars timestamp + "-" + up to 8 + "-" + up to 8
// = ~34 chars max. Allow up to 60 for safety margin.
const FALLBACK_SESSION_RE = /^fb-[0-9a-z]{1,15}-[0-9a-z]{1,15}-[0-9a-z]{1,15}$/;
// Page path: /ksiazka (exact), /ksiazka/ (trailing slash), or /ksiazka/<subpath>.
// Subpath allows alphanumerics, dashes, underscores, slashes. No query/fragment/bad chars.
const PAGE_PATH_RE = /^\/ksiazka(\/[a-zA-Z0-9_\-/]*)?\/?$/;
// ISO8601 UTC timestamp: YYYY-MM-DDTHH:MM:SS(.sss)?Z
const ISO8601_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

/**
 * H7 helper: strict plain-object check. Rejects arrays, null, and non-objects.
 * @param {unknown} v
 * @returns {boolean}
 */
export function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** @param {unknown} v */
export function toIntOrNull(v) {
  if (v === null || v === undefined) return null;
  if (typeof v !== 'number') return null;
  if (!Number.isFinite(v)) return null;
  if (v < 0 || v > 2147483647) return null;
  return Math.round(v);
}

/**
 * @param {unknown} v
 * @param {number} maxLen
 * @param {Set<string>} [allowed]
 */
export function toStringOrNull(v, maxLen, allowed) {
  if (v === null || v === undefined) return null;
  if (typeof v !== 'string') return null;
  const trimmed = v.substring(0, maxLen);
  if (allowed && !allowed.has(trimmed)) return null;
  return trimmed;
}

/** @param {unknown} raw */
export function validatePayload(raw) {
  if (!isPlainObject(raw)) return null;
  const obj = raw;

  // H8: session_id must be UUID v4 or documented fallback format.
  if (typeof obj.session_id !== 'string' || obj.session_id.length === 0) return null;
  if (obj.session_id.length > 100) return null;
  if (!UUID_V4_RE.test(obj.session_id) && !FALLBACK_SESSION_RE.test(obj.session_id)) {
    return null;
  }

  // H8: page_path must be whitelisted to /ksiazka and subpaths.
  if (typeof obj.page_path !== 'string' || obj.page_path.length === 0) return null;
  if (obj.page_path.length > 500) return null;
  if (!PAGE_PATH_RE.test(obj.page_path)) return null;

  // H8: timestamp_utc must be ISO8601 UTC format.
  if (typeof obj.timestamp_utc !== 'string' || obj.timestamp_utc.length === 0) return null;
  if (obj.timestamp_utc.length > 50) return null;
  if (!ISO8601_UTC_RE.test(obj.timestamp_utc)) return null;

  // H7: timings must be a plain object, NOT an array (typeof [] === 'object' is true).
  if (!isPlainObject(obj.timings)) return null;

  const t = obj.timings;

  return {
    session_id: obj.session_id,
    page_path: obj.page_path,
    user_agent: typeof obj.user_agent === 'string' ? obj.user_agent.substring(0, 500) : undefined,
    timestamp_utc: obj.timestamp_utc,
    consent_state: toStringOrNull(obj.consent_state, 30, VALID_CONSENT_STATES) ?? undefined,
    viewport_width: toIntOrNull(obj.viewport_width) ?? undefined,
    connection_type: toStringOrNull(obj.connection_type, 20) ?? undefined,
    timings: {
      dom_content_loaded_ms: toIntOrNull(t.dom_content_loaded_ms),
      consent_default_set_ms: toIntOrNull(t.consent_default_set_ms),
      analytics_init_ms: toIntOrNull(t.analytics_init_ms),
      first_interaction_ms: toIntOrNull(t.first_interaction_ms),
      first_interaction_type: toStringOrNull(t.first_interaction_type, 20, VALID_INTERACTION_TYPES),
      idle_fire_ms: toIntOrNull(t.idle_fire_ms),
      load_analytics_start_ms: toIntOrNull(t.load_analytics_start_ms),
      load_analytics_trigger: toStringOrNull(t.load_analytics_trigger, 20, VALID_TRIGGERS),
      gtm_script_injected_ms: toIntOrNull(t.gtm_script_injected_ms),
      first_tracking_hit_ms: toIntOrNull(t.first_tracking_hit_ms),
      first_tracking_hit_type: toStringOrNull(t.first_tracking_hit_type, 20, VALID_TRACKING_TYPES),
    },
    bounced_before_tracking: typeof obj.bounced_before_tracking === 'boolean' ? obj.bounced_before_tracking : false,
  };
}
