/**
 * Consent beacon payload validator — pure JS, no CF Workers globals.
 *
 * Measures the cookie-consent modal itself (shown / accept / settings / save /
 * abandon) — the ONE metric GA4 can never see: people who bounce BEFORE
 * consenting. Because we measure people who have NOT consented, the payload is
 * strictly anonymous by design:
 *
 *   - NO cookies, NO session id, NO user agent, NO IP, NO fingerprint
 *   - page_path is stripped of query string client-side and rejected here
 *     if it still contains '?' or '#'
 *   - device is a coarse bucket (mobile | desktop) derived from viewport width
 *   - ms_to_decision is time from banner render to the event (int, capped)
 *   - analytics / marketing booleans appear ONLY on 'save' events (what the
 *     user picked in settings — a fact about the decision, not the person)
 *
 * Underscored filename prefix keeps CF Pages Functions router from treating
 * this as a route (same convention as _perf-beacon-validator.mjs).
 *
 * Mission: aios-workspace/builds/2026-07-14-hq-modul-analityka/plan.md
 */

export const CONSENT_MAX_PAYLOAD_BYTES = 512;

export const VALID_CONSENT_EVENTS = new Set([
  'consent_shown',
  'consent_accept',
  'consent_settings',
  'consent_save',
  'consent_abandon',
]);

export const VALID_DEVICES = new Set(['mobile', 'desktop']);

// ISO8601 UTC timestamp: YYYY-MM-DDTHH:MM:SS(.sss)?Z (same as perf validator)
const ISO8601_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
// Any site path: leading slash, safe chars only, NO query string / fragment.
// Allows Polish blog slugs (already URL-encoded → %XX), dots, dashes, slashes.
const PAGE_PATH_RE = /^\/[a-zA-Z0-9_\-./%]*$/;
// 1 hour cap — nobody stares at a consent modal longer; larger values are noise.
const MS_TO_DECISION_MAX = 3600000;

/** @param {unknown} v */
function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * @param {unknown} raw
 * @returns {{ ts: string, event: string, page_path: string, device: string | null,
 *             ms_to_decision: number | null, analytics: number | null,
 *             marketing: number | null } | null}
 */
export function validateConsentPayload(raw) {
  if (!isPlainObject(raw)) return null;
  const obj = raw;

  if (typeof obj.event !== 'string' || !VALID_CONSENT_EVENTS.has(obj.event)) return null;

  if (typeof obj.ts !== 'string' || obj.ts.length > 50 || !ISO8601_UTC_RE.test(obj.ts)) {
    return null;
  }

  if (typeof obj.page_path !== 'string' || obj.page_path.length === 0) return null;
  if (obj.page_path.length > 300) return null;
  if (!PAGE_PATH_RE.test(obj.page_path)) return null;

  let device = null;
  if (obj.device !== undefined && obj.device !== null) {
    if (typeof obj.device !== 'string' || !VALID_DEVICES.has(obj.device)) return null;
    device = obj.device;
  }

  let msToDecision = null;
  if (obj.ms_to_decision !== undefined && obj.ms_to_decision !== null) {
    if (typeof obj.ms_to_decision !== 'number' || !Number.isFinite(obj.ms_to_decision)) return null;
    if (obj.ms_to_decision < 0 || obj.ms_to_decision > MS_TO_DECISION_MAX) return null;
    msToDecision = Math.round(obj.ms_to_decision);
  }

  // analytics / marketing: booleans, meaningful only for consent_save.
  let analytics = null;
  let marketing = null;
  if (obj.event === 'consent_save') {
    if (typeof obj.analytics === 'boolean') analytics = obj.analytics ? 1 : 0;
    if (typeof obj.marketing === 'boolean') marketing = obj.marketing ? 1 : 0;
  }

  return {
    ts: obj.ts,
    event: obj.event,
    page_path: obj.page_path,
    device,
    ms_to_decision: msToDecision,
    analytics,
    marketing,
  };
}
