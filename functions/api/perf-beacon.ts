/**
 * Cloudflare Pages Function — /api/perf-beacon
 *
 * Purpose: Ingest real-user timing telemetry beacons from PerfTelemetry.astro
 * and persist to Cloudflare D1 database.
 *
 * Context: TOR 2 (Real-User Timing Telemetry) for /ksiazka Phase 2 decision.
 * Plan: plans/active/2026-04-15-pz-real-user-timing-telemetry.md (in AIOS workspace)
 *
 * Architecture:
 * - Same-origin POST from https://pozytywniezbudowani.pl/api/perf-beacon
 * - JSON body, max 2 KB
 * - Validates schema strictly (reject malformed → 400, oversized → 413)
 * - Insert into D1 database bound as env.PERF_TELEMETRY
 * - Responds 204 No Content on success (minimal response = faster beacon)
 * - CORS: only allow production origin (same-origin is default, but OPTIONS preflight handled)
 *
 * Guardrails:
 * - No PII logging (we store user_agent for mobile/desktop split only)
 * - No request body logging in errors (avoid leaking user payloads)
 * - Bounded D1 write latency: single prepared statement, no transactions
 * - Safe string coercion for all optional fields
 *
 * Runbook (Artur manual setup, one-time):
 *   1. npx wrangler login  (browser auth)
 *   2. npx wrangler d1 create pz-perf-telemetry
 *   3. Copy database_id into wrangler.toml [[d1_databases]] binding
 *   4. npx wrangler d1 execute pz-perf-telemetry --remote --file=functions/schema.sql
 *   5. Merge PR → CF Pages deploys automatically → Pages Function is live
 *   6. Verify: curl -X POST https://pozytywniezbudowani.pl/api/perf-beacon \
 *              -H 'Content-Type: application/json' \
 *              -d '{"session_id":"test","page_path":"/ksiazka","timestamp_utc":"2026-04-15T12:00:00Z","timings":{}}'
 *              → expect 204
 */

// Import pure-JS validator (sibling module) — extracted for testability with
// Node's built-in test runner. CF Pages Functions router ignores filenames
// starting with `_`, so this is NOT served as a route.
// TypeScript + allowJs lets us import the .mjs module with type inference
// via JSDoc types.
// @ts-expect-error — no .d.ts for validator; JSDoc types are sufficient for runtime
import { validatePayload, MAX_PAYLOAD_BYTES } from './_perf-beacon-validator.mjs';

interface Env {
  PERF_TELEMETRY: D1Database;
}

// CORS preflight response (same-origin is default, but future cross-origin proxies may need this)
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': 'https://pozytywniezbudowani.pl',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Max-Age': '86400',
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Content-Length guard (optional but cheap — rejects oversized before parsing)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return new Response('Payload too large', {
      status: 413,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
  }

  // Parse body (may fail on malformed JSON)
  let body: string;
  try {
    body = await request.text();
  } catch {
    return new Response('Invalid body', {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
  }

  // H4 fix: authoritative size check in UTF-8 bytes (not UTF-16 code units).
  // `body.length` counts UTF-16 units — Unicode-heavy payloads (multi-byte
  // chars in user_agent strings etc.) could exceed MAX_PAYLOAD_BYTES on the
  // wire while passing a naive `.length` check. TextEncoder gives real bytes.
  // This is the single source of truth for size enforcement; the validator
  // does NOT re-check, avoiding duplicated logic and potential drift.
  const byteLength = new TextEncoder().encode(body).length;
  if (byteLength > MAX_PAYLOAD_BYTES) {
    return new Response('Payload too large', {
      status: 413,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return new Response('Invalid JSON', {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
  }

  const payload = validatePayload(parsed);
  if (!payload) {
    return new Response('Invalid payload schema', {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
  }

  // Guard against unbound environments (local wrangler dev without --d1)
  if (!env.PERF_TELEMETRY) {
    return new Response('Database binding missing', {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
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
    // H5 fix: log sanitized error metadata so we can diagnose D1 issues
    // (schema mismatch, binding outage, quota exhaustion). We deliberately
    // do NOT log:
    //   - payload contents (PII surface)
    //   - full stack trace (may contain PII from rendered error messages)
    //   - request headers (may contain cookies, auth)
    // Only the error class and message, truncated to avoid log flooding.
    const err = error as Error;
    const name = typeof err?.name === 'string' ? err.name : 'UnknownError';
    const message = typeof err?.message === 'string' ? err.message.substring(0, 500) : '';
    console.error('perf-beacon: D1 insert failed', { name, message });
    return new Response('Database error', {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' },
    });
  }

  return new Response(null, { status: 204, headers: CORS_HEADERS });
};
