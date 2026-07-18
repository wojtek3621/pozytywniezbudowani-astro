/**
 * Unit tests for consent-beacon payload validator (incl. de-anon fields 2026-07-18).
 * Run: node --test functions/api/__tests__/consent-beacon-validator.test.mjs
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateConsentPayload,
  CONSENT_MAX_PAYLOAD_BYTES,
  VALID_CONSENT_EVENTS,
  VALID_DEVICES,
} from '../_consent-beacon-validator.mjs';

const TS = '2026-07-18T10:00:00Z';

function base(over = {}) {
  return { event: 'consent_shown', ts: TS, page_path: '/', device: 'desktop', ...over };
}

describe('constants', () => {
  test('size cap bumped to 1024 for de-anon fields', () => {
    assert.equal(CONSENT_MAX_PAYLOAD_BYTES, 1024);
  });
  test('event/device sets intact', () => {
    assert.ok(VALID_CONSENT_EVENTS.has('consent_save'));
    assert.ok(VALID_DEVICES.has('mobile'));
  });
});

describe('core validation (unchanged)', () => {
  test('minimal valid payload passes', () => {
    const r = validateConsentPayload(base());
    assert.ok(r);
    assert.equal(r.event, 'consent_shown');
    assert.equal(r.device_id, null);
    assert.equal(r.banner_version, null);
    assert.equal(r.purposes, null);
  });
  test('rejects unknown event', () => {
    assert.equal(validateConsentPayload(base({ event: 'evil' })), null);
  });
  test('rejects page_path with query string', () => {
    assert.equal(validateConsentPayload(base({ page_path: '/x?y=1' })), null);
  });
  test('rejects bad timestamp', () => {
    assert.equal(validateConsentPayload(base({ ts: 'not-a-date' })), null);
  });
  test('save booleans only on consent_save', () => {
    const shown = validateConsentPayload(base({ event: 'consent_shown', analytics: true }));
    assert.equal(shown.analytics, null);
    const save = validateConsentPayload(base({ event: 'consent_save', analytics: true, marketing: false }));
    assert.equal(save.analytics, 1);
    assert.equal(save.marketing, 0);
  });
});

describe('de-anon fields (2026-07-18)', () => {
  test('device_id accepted when uid-shaped', () => {
    const r = validateConsentPayload(base({ device_id: '550e8400-e29b-41d4-a716-446655440000' }));
    assert.equal(r.device_id, '550e8400-e29b-41d4-a716-446655440000');
  });
  test('device_id fallback fb- shape accepted', () => {
    const r = validateConsentPayload(base({ device_id: 'fb-lr8k2m3a-abc12345' }));
    assert.equal(r.device_id, 'fb-lr8k2m3a-abc12345');
  });
  test('device_id with illegal chars rejected (whole payload)', () => {
    assert.equal(validateConsentPayload(base({ device_id: 'has spaces!' })), null);
    assert.equal(validateConsentPayload(base({ device_id: 'a'.repeat(65) })), null);
  });
  test('banner_version accepted / rejected', () => {
    assert.equal(validateConsentPayload(base({ banner_version: 'pz-2026-07-18' })).banner_version, 'pz-2026-07-18');
    assert.equal(validateConsentPayload(base({ banner_version: 'bad version!' })), null);
  });
  test('purposes accepted / rejected', () => {
    const r = validateConsentPayload(base({ event: 'consent_save', purposes: 'necessary,analytics,marketing' }));
    assert.equal(r.purposes, 'necessary,analytics,marketing');
    assert.equal(validateConsentPayload(base({ purposes: 'Analytics;Marketing' })), null);
    assert.equal(validateConsentPayload(base({ purposes: 'a'.repeat(130) })), null);
  });
  test('de-anon fields are all optional (absent → null)', () => {
    const r = validateConsentPayload(base());
    assert.equal(r.device_id, null);
    assert.equal(r.banner_version, null);
    assert.equal(r.purposes, null);
  });
  test('validator never accepts ip / user_agent from client (server-side only)', () => {
    const r = validateConsentPayload(base({ ip: '1.2.3.4', user_agent: 'Mozilla/5.0' }));
    assert.ok(r);
    assert.equal(r.ip, undefined);
    assert.equal(r.user_agent, undefined);
  });
  test('GPC/DNT fields are ignored (never read, never surfaced)', () => {
    const r = validateConsentPayload(base({ gpc: true, dnt: '1', Sec_GPC: 1 }));
    assert.ok(r);
    assert.equal(r.gpc, undefined);
    assert.equal(r.dnt, undefined);
  });
});
