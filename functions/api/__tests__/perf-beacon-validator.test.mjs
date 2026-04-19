/**
 * Unit tests for perf-beacon payload validator.
 * Run: node --test functions/api/__tests__/perf-beacon-validator.test.mjs
 * (Node 18+ has built-in test runner, no framework install needed.)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  validatePayload,
  toIntOrNull,
  toStringOrNull,
  isPlainObject,
  VALID_CONSENT_STATES,
  VALID_INTERACTION_TYPES,
  MAX_PAYLOAD_BYTES,
} from '../_perf-beacon-validator.mjs';

// ─────────────────────────────────────────────────────────────────────
// Shared fixtures — valid UUID v4 samples for tests post H8 tightening.
// ─────────────────────────────────────────────────────────────────────
const UUID_1 = '550e8400-e29b-41d4-a716-446655440000';
const UUID_2 = '6ba7b810-9dad-41d1-80b4-00c04fd430c8';
const UUID_3 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const FALLBACK_SID = 'fb-lr8k2m3a-abc12345-xyz98765';
const ISO_TS = '2026-04-17T10:00:00Z';
const ISO_TS_MS = '2026-04-17T10:00:00.123Z';

// ─────────────────────────────────────────────────────────────────────
// toIntOrNull
// ─────────────────────────────────────────────────────────────────────
describe('toIntOrNull', () => {
  test('returns null for null/undefined', () => {
    assert.equal(toIntOrNull(null), null);
    assert.equal(toIntOrNull(undefined), null);
  });

  test('returns null for non-number types', () => {
    assert.equal(toIntOrNull('123'), null);
    assert.equal(toIntOrNull({}), null);
    assert.equal(toIntOrNull([]), null);
    assert.equal(toIntOrNull(true), null);
  });

  test('returns null for NaN and Infinity', () => {
    assert.equal(toIntOrNull(NaN), null);
    assert.equal(toIntOrNull(Infinity), null);
    assert.equal(toIntOrNull(-Infinity), null);
  });

  test('returns null for negative numbers', () => {
    assert.equal(toIntOrNull(-1), null);
    assert.equal(toIntOrNull(-0.5), null);
  });

  test('returns null for values > 2^31', () => {
    assert.equal(toIntOrNull(2147483648), null);
    assert.equal(toIntOrNull(1e20), null);
  });

  test('rounds valid numbers', () => {
    assert.equal(toIntOrNull(100), 100);
    assert.equal(toIntOrNull(100.4), 100);
    assert.equal(toIntOrNull(100.5), 101); // Math.round tie-breaks up
    assert.equal(toIntOrNull(0), 0);
  });
});

// ─────────────────────────────────────────────────────────────────────
// toStringOrNull
// ─────────────────────────────────────────────────────────────────────
describe('toStringOrNull', () => {
  test('returns null for null/undefined', () => {
    assert.equal(toStringOrNull(null, 50), null);
    assert.equal(toStringOrNull(undefined, 50), null);
  });

  test('returns null for non-string types', () => {
    assert.equal(toStringOrNull(123, 50), null);
    assert.equal(toStringOrNull({}, 50), null);
  });

  test('truncates to maxLen', () => {
    assert.equal(toStringOrNull('abcdefghij', 5), 'abcde');
  });

  test('rejects values not in allowed set', () => {
    assert.equal(toStringOrNull('invalid', 50, VALID_CONSENT_STATES), null);
  });

  test('accepts values in allowed set', () => {
    assert.equal(toStringOrNull('denied', 50, VALID_CONSENT_STATES), 'denied');
    assert.equal(toStringOrNull('granted_all', 50, VALID_CONSENT_STATES), 'granted_all');
  });

  test('interaction types', () => {
    assert.equal(toStringOrNull('scroll', 20, VALID_INTERACTION_TYPES), 'scroll');
    assert.equal(toStringOrNull('click', 20, VALID_INTERACTION_TYPES), null);
  });
});

// ─────────────────────────────────────────────────────────────────────
// validatePayload — happy path
// ─────────────────────────────────────────────────────────────────────
describe('validatePayload — happy path', () => {
  test('accepts minimal valid payload (UUID v4)', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result, 'should return non-null');
    assert.equal(result.session_id, UUID_1);
    assert.equal(result.page_path, '/ksiazka/');
    assert.equal(result.timestamp_utc, ISO_TS);
    assert.equal(result.bounced_before_tracking, false);
  });

  test('accepts full payload with all fields', () => {
    const raw = {
      session_id: UUID_2,
      page_path: '/ksiazka/',
      user_agent: 'Mozilla/5.0',
      timestamp_utc: ISO_TS,
      consent_state: 'granted_all',
      viewport_width: 412,
      connection_type: '4g',
      timings: {
        dom_content_loaded_ms: 800,
        consent_default_set_ms: 120,
        analytics_init_ms: 125,
        first_interaction_ms: 900,
        first_interaction_type: 'scroll',
        idle_fire_ms: null,
        load_analytics_start_ms: 905,
        load_analytics_trigger: 'interaction',
        gtm_script_injected_ms: 950,
        first_tracking_hit_ms: 1200,
        first_tracking_hit_type: 'gtm',
      },
      bounced_before_tracking: false,
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.timings.first_tracking_hit_ms, 1200);
    assert.equal(result.timings.first_tracking_hit_type, 'gtm');
    assert.equal(result.consent_state, 'granted_all');
  });

  test('accepts fallback session_id format (crypto API missing)', () => {
    const raw = {
      session_id: FALLBACK_SID,
      page_path: '/ksiazka',
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.session_id, FALLBACK_SID);
  });

  test('accepts ISO8601 with milliseconds', () => {
    const raw = {
      session_id: UUID_3,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS_MS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.timestamp_utc, ISO_TS_MS);
  });

  test('accepts exact /ksiazka path (no trailing slash)', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka',
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.page_path, '/ksiazka');
  });

  test('accepts /ksiazka subpath', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/dziekuje',
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.page_path, '/ksiazka/dziekuje');
  });
});

// ─────────────────────────────────────────────────────────────────────
// validatePayload — rejection cases
// ─────────────────────────────────────────────────────────────────────
describe('validatePayload — rejections', () => {
  test('rejects null', () => {
    assert.equal(validatePayload(null), null);
  });

  test('rejects non-object', () => {
    assert.equal(validatePayload('string'), null);
    assert.equal(validatePayload(123), null);
    assert.equal(validatePayload([]), null);
  });

  test('rejects missing session_id', () => {
    assert.equal(
      validatePayload({
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('rejects empty session_id', () => {
    assert.equal(
      validatePayload({
        session_id: '',
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('rejects session_id > 100 chars', () => {
    assert.equal(
      validatePayload({
        session_id: 'x'.repeat(101),
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('rejects missing page_path', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('rejects missing timings', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
      }),
      null
    );
  });

  test('rejects non-object timings (string)', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: 'not an object',
      }),
      null
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // H7 fix: timings must not accept arrays (typeof [] === 'object')
  // ─────────────────────────────────────────────────────────────────
  test('H7: rejects timings as array', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: [],
      }),
      null
    );
  });

  test('H7: rejects timings as populated array', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: [1, 2, 3],
      }),
      null
    );
  });

  test('H7: rejects timings as null', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: null,
      }),
      null
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // H8 fix: session_id regex whitelist (UUID v4 or fallback)
  // ─────────────────────────────────────────────────────────────────
  test('H8: rejects arbitrary string session_id (not UUID, not fallback)', () => {
    assert.equal(
      validatePayload({
        session_id: 'abc-123',
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('H8: rejects UUID v1 (wrong version)', () => {
    assert.equal(
      validatePayload({
        session_id: '550e8400-e29b-11d4-a716-446655440000', // version=1 in position 14
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('H8: rejects UUID with wrong variant bits', () => {
    assert.equal(
      validatePayload({
        session_id: '550e8400-e29b-41d4-0716-446655440000', // variant=0
        page_path: '/ksiazka/',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // H8 fix: page_path whitelist regex (/ksiazka*)
  // ─────────────────────────────────────────────────────────────────
  test('H8 + H1: rejects off-by-one scope (/ksiazkaevil)', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazkaevil',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('H8 + H1: rejects /ksiazka-premium', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka-premium',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('H8: rejects unrelated path /blog', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/blog',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  test('H8: rejects path with query string', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/?utm=evil',
        timestamp_utc: ISO_TS,
        timings: {},
      }),
      null
    );
  });

  // ─────────────────────────────────────────────────────────────────
  // H8 fix: timestamp_utc ISO8601 format
  // ─────────────────────────────────────────────────────────────────
  test('H8: rejects non-ISO timestamp', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: 'yesterday',
        timings: {},
      }),
      null
    );
  });

  test('H8: rejects ISO without Z suffix', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: '2026-04-17T10:00:00+02:00',
        timings: {},
      }),
      null
    );
  });

  test('H8: rejects ISO with only date part', () => {
    assert.equal(
      validatePayload({
        session_id: UUID_1,
        page_path: '/ksiazka/',
        timestamp_utc: '2026-04-17',
        timings: {},
      }),
      null
    );
  });
});

// ─────────────────────────────────────────────────────────────────────
// validatePayload — sanitization
// ─────────────────────────────────────────────────────────────────────
describe('validatePayload — sanitization', () => {
  test('truncates user_agent to 500 chars', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      user_agent: 'x'.repeat(1000),
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.user_agent.length, 500);
  });

  test('C2: accepts sanitized UA with pre-stripped control chars', () => {
    // Server-side validator trusts client pre-sanitization; it only truncates.
    // The actual quote/backslash/newline stripping happens in PerfTelemetry.astro
    // BEFORE the payload hits the wire. This test confirms a clean UA passes.
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      user_agent: 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36',
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.user_agent, 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36');
  });

  test('drops invalid consent_state', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      consent_state: 'malicious',
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.consent_state, undefined);
  });

  test('drops invalid first_interaction_type', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {
        first_interaction_type: 'click',
      },
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.timings.first_interaction_type, null);
  });

  test('drops invalid first_tracking_hit_type', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {
        first_tracking_hit_type: 'hotjar',
      },
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.timings.first_tracking_hit_type, null);
  });

  test('drops negative timings', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {
        dom_content_loaded_ms: -100,
        first_tracking_hit_ms: 1200,
      },
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.timings.dom_content_loaded_ms, null);
    assert.equal(result.timings.first_tracking_hit_ms, 1200);
  });

  test('rounds fractional timings', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {
        dom_content_loaded_ms: 123.7,
      },
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.timings.dom_content_loaded_ms, 124);
  });

  test('defaults bounced_before_tracking to false if missing', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {},
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.bounced_before_tracking, false);
  });

  test('accepts bounced_before_tracking = true', () => {
    const raw = {
      session_id: UUID_1,
      page_path: '/ksiazka/',
      timestamp_utc: ISO_TS,
      timings: {},
      bounced_before_tracking: true,
    };
    const result = validatePayload(raw);
    assert.ok(result);
    assert.equal(result.bounced_before_tracking, true);
  });
});

// ─────────────────────────────────────────────────────────────────────
// H7 isPlainObject helper
// ─────────────────────────────────────────────────────────────────────
describe('isPlainObject', () => {
  test('accepts plain objects', () => {
    assert.equal(isPlainObject({}), true);
    assert.equal(isPlainObject({ a: 1 }), true);
  });

  test('rejects arrays', () => {
    assert.equal(isPlainObject([]), false);
    assert.equal(isPlainObject([1, 2, 3]), false);
  });

  test('rejects null', () => {
    assert.equal(isPlainObject(null), false);
  });

  test('rejects primitives', () => {
    assert.equal(isPlainObject('string'), false);
    assert.equal(isPlainObject(123), false);
    assert.equal(isPlainObject(true), false);
    assert.equal(isPlainObject(undefined), false);
  });
});

// ─────────────────────────────────────────────────────────────────────
// MAX_PAYLOAD_BYTES constant
// ─────────────────────────────────────────────────────────────────────
describe('constants', () => {
  test('MAX_PAYLOAD_BYTES is 2048', () => {
    assert.equal(MAX_PAYLOAD_BYTES, 2048);
  });
});
