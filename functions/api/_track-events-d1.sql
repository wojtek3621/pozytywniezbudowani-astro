-- D1 (pz-perf-telemetry) — tabela track_events dla kolektora behawioralnego /api/z.
-- Misja „analityka-atrybucja" 2026-07-18. Worker wstawia tu zdarzenia (klient + wzbogacenie
-- request.cf), cron aios-workspace/automation/pz_tracking_d1_sync.py przenosi do tracking.db
-- (MOVE: SELECT → INSERT do tracking.db → DELETE z D1). Kształt 1:1 z tracking.db.track_events
-- (bez server-side kolumn wypełnianych dopiero po synchro; tu wszystko wypełnia Worker).
--
-- Zastosowanie (deploy, PO merge):
--   cd ~/pozytywniezbudowani-astro && npx wrangler d1 execute pz-perf-telemetry --remote \
--     --file functions/api/_track-events-d1.sql

CREATE TABLE IF NOT EXISTS track_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_uid TEXT NOT NULL UNIQUE,
    site TEXT NOT NULL,
    ts TEXT NOT NULL,
    received_at TEXT,
    event_type TEXT NOT NULL,
    device_id TEXT,
    session_id TEXT,
    fingerprint TEXT,
    path TEXT,
    query TEXT,
    referrer TEXT,
    referrer_host TEXT,
    title TEXT,
    utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT,
    nlt TEXT,
    pxid TEXT,
    screen_w INTEGER, screen_h INTEGER, viewport_w INTEGER, viewport_h INTEGER,
    device_pixel_ratio REAL,
    language TEXT, timezone TEXT,
    hardware_concurrency INTEGER, device_memory REAL,
    connection_type TEXT,
    device_class TEXT,
    time_on_page_ms INTEGER,
    active_time_ms INTEGER,
    max_scroll_pct INTEGER,
    outbound_url TEXT, outbound_host TEXT, link_text TEXT, is_checkout INTEGER,
    ip TEXT,
    user_agent TEXT,
    accept_language TEXT,
    country TEXT, region TEXT, city TEXT, postal_code TEXT,
    asn INTEGER, as_org TEXT, colo TEXT,
    http_protocol TEXT, tls_version TEXT, tls_cipher TEXT,
    client_tcp_rtt INTEGER,
    ja3_hash TEXT,
    bot_score INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_d1_te_id ON track_events(id);
