/**
 * Consent beacon payload validator — pure JS, no CF Workers globals.
 *
 * Measures the cookie-consent modal itself (shown / accept / settings / save /
 * abandon) — the ONE metric GA4 can never see: people who bounce BEFORE
 * consenting.
 *
 *   - page_path is stripped of query string client-side and rejected here
 *     if it still contains '?' or '#'
 *   - device is a coarse bucket (mobile | desktop) derived from viewport width
 *   - ms_to_decision is time from banner render to the event (int, capped)
 *   - analytics / marketing booleans appear ONLY on 'save' events (what the
 *     user picked in settings — a fact about the decision, not the person)
 *
 * DE-ANONYMIZATION (2026-07-18, misja analityka-jakosc-ruchu — owner directive):
 * the consent beacon is NO LONGER anonymous. It now carries a consent RECEIPT
 * tied to identity (RODO art. 7 proof of consent):
 *   - device_id (pz_did, shared with the z.js first-party collector) — links the
 *     decision to a person in tracking.db
 *   - banner_version — which banner text/layout the consent was given for
 *   - purposes — explicit list of granted purposes (comma-separated tokens)
 * IP and user_agent are added SERVER-SIDE by the Worker (never trusted from the
 * client), so they are intentionally NOT accepted here. GPC/DNT are intentionally
 * NOT read (owner decision: not honored ⇒ not logged).
 *
 * Underscored filename prefix keeps CF Pages Functions router from treating
 * this as a route (same convention as _perf-beacon-validator.mjs).
 *
 * Mission: aios-workspace/builds/2026-07-18-analityka-jakosc-ruchu/
 */

// Bumped 512 → 1024 for the de-anon fields (device_id + banner_version + purposes).
export const CONSENT_MAX_PAYLOAD_BYTES = 1024;

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
// device_id (pz_did): uuid or fb-... fallback (same shape as z-beacon UID_RE).
const DEVICE_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
// banner_version: short alnum/dot/dash token (e.g. 'pz-2026-07-18').
const BANNER_VERSION_RE = /^[A-Za-z0-9._-]{1,40}$/;
// purposes: comma-separated purpose tokens (e.g. 'necessary,analytics,marketing').
const PURPOSES_RE = /^[a-z_]+(,[a-z_]+)*$/;

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

  // De-anon fields (2026-07-18): all OPTIONAL, rejected if malformed.
  let deviceId = null;
  if (obj.device_id !== undefined && obj.device_id !== null) {
    if (typeof obj.device_id !== 'string' || !DEVICE_ID_RE.test(obj.device_id)) return null;
    deviceId = obj.device_id;
  }

  let bannerVersion = null;
  if (obj.banner_version !== undefined && obj.banner_version !== null) {
    if (typeof obj.banner_version !== 'string' || !BANNER_VERSION_RE.test(obj.banner_version)) {
      return null;
    }
    bannerVersion = obj.banner_version;
  }

  // purposes: only meaningful on a decision (accept/save); accept as given otherwise ignore.
  let purposes = null;
  if (obj.purposes !== undefined && obj.purposes !== null) {
    if (typeof obj.purposes !== 'string' || obj.purposes.length > 120 || !PURPOSES_RE.test(obj.purposes)) {
      return null;
    }
    purposes = obj.purposes;
  }

  return {
    ts: obj.ts,
    event: obj.event,
    page_path: obj.page_path,
    device,
    ms_to_decision: msToDecision,
    analytics,
    marketing,
    device_id: deviceId,
    banner_version: bannerVersion,
    purposes,
  };
}
