-- Cloudflare D1 schema for pz-perf-telemetry database
--
-- Purpose: Store real-user timing beacons from /ksiazka* pages (Phase 2 decision data)
-- Mirrored in aios.db:pz_perf_telemetry via cron sync (automation/pz_perf_d1_sync.py)
--
-- Setup (Artur, one-time):
--   npx wrangler d1 create pz-perf-telemetry
--   # copy database_id into wrangler.toml
--   npx wrangler d1 execute pz-perf-telemetry --remote --file=functions/schema.sql
--
-- Plan: plans/active/2026-04-15-pz-real-user-timing-telemetry.md

CREATE TABLE IF NOT EXISTS perf_telemetry (
  id                        INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id                TEXT NOT NULL,
  timestamp_utc             TEXT NOT NULL,
  page_path                 TEXT NOT NULL,
  user_agent                TEXT,
  consent_state             TEXT,
  viewport_width            INTEGER,
  connection_type           TEXT,
  dom_content_loaded_ms     INTEGER,
  consent_default_set_ms    INTEGER,
  analytics_init_ms         INTEGER,
  first_interaction_ms      INTEGER,
  first_interaction_type    TEXT,
  idle_fire_ms              INTEGER,
  load_analytics_start_ms   INTEGER,
  load_analytics_trigger    TEXT,
  gtm_script_injected_ms    INTEGER,
  first_tracking_hit_ms     INTEGER,
  first_tracking_hit_type   TEXT,
  bounced_before_tracking   INTEGER DEFAULT 0,
  ingested_at               TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_perf_timestamp ON perf_telemetry(timestamp_utc);
CREATE INDEX IF NOT EXISTS idx_perf_bounced ON perf_telemetry(bounced_before_tracking);
CREATE INDEX IF NOT EXISTS idx_perf_session ON perf_telemetry(session_id);
