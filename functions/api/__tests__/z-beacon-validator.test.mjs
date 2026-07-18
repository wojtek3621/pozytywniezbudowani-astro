/**
 * Unit tests for z-beacon (behavioral collector) validator, incl. bot-env fields (2026-07-18).
 * Run: node --test functions/api/__tests__/z-beacon-validator.test.mjs
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { validateZPayload, Z_MAX_PAYLOAD_BYTES, VALID_Z_EVENTS } from '../_z-beacon-validator.mjs';

const TS = '2026-07-18T10:00:00Z';

function base(over = {}) {
  return {
    event_uid: 'evt-abc-1',
    site: 'pz',
    ts: TS,
    event_type: 'page_view',
    device_id: 'dev-1',
    session_id: 'sess-1',
    ...over,
  };
}

describe('core (unchanged)', () => {
  test('minimal valid payload passes', () => {
    const r = validateZPayload(base());
    assert.ok(r);
    assert.equal(r.event_type, 'page_view');
  });
  test('requires device_id and session_id', () => {
    assert.equal(validateZPayload(base({ device_id: undefined })), null);
    assert.equal(validateZPayload(base({ session_id: undefined })), null);
  });
  test('rejects unknown event_type', () => {
    assert.equal(validateZPayload(base({ event_type: 'evil' })), null);
  });
  test('server-side fields never accepted from client', () => {
    const r = validateZPayload(base({ ip: '1.2.3.4', asn: 123, ua_is_bot: 1 }));
    assert.equal(r.ip, undefined);
    assert.equal(r.asn, undefined);
    assert.equal(r.ua_is_bot, undefined);
  });
  test('size cap present', () => {
    assert.equal(Z_MAX_PAYLOAD_BYTES, 4096);
    assert.ok(VALID_Z_EVENTS.has('page_leave'));
  });
});

describe('bot-env fields (2026-07-18)', () => {
  test('webdriver accepts 1/0/true/false → 1/0, else null', () => {
    assert.equal(validateZPayload(base({ webdriver: 1 })).webdriver, 1);
    assert.equal(validateZPayload(base({ webdriver: true })).webdriver, 1);
    assert.equal(validateZPayload(base({ webdriver: 0 })).webdriver, 0);
    assert.equal(validateZPayload(base({ webdriver: false })).webdriver, 0);
    assert.equal(validateZPayload(base({ webdriver: 'yes' })).webdriver, null);
    assert.equal(validateZPayload(base()).webdriver, null);
  });
  test('webgl_renderer string clamped', () => {
    assert.equal(validateZPayload(base({ webgl_renderer: 'software' })).webgl_renderer, 'software');
    assert.equal(validateZPayload(base({ webgl_renderer: 'masked' })).webgl_renderer, 'masked');
    const long = 'x'.repeat(200);
    assert.equal(validateZPayload(base({ webgl_renderer: long })).webgl_renderer.length, 120);
    assert.equal(validateZPayload(base()).webgl_renderer, null);
  });
  test('languages_count int in [0,50]', () => {
    assert.equal(validateZPayload(base({ languages_count: 0 })).languages_count, 0);
    assert.equal(validateZPayload(base({ languages_count: 3 })).languages_count, 3);
    assert.equal(validateZPayload(base({ languages_count: 999 })).languages_count, null);
    assert.equal(validateZPayload(base({ languages_count: -1 })).languages_count, null);
  });
  test('fingerprint accepted but never a bot signal (validator just clamps)', () => {
    const r = validateZPayload(base({ fingerprint: 'abc123' }));
    assert.equal(r.fingerprint, 'abc123');
  });
});
