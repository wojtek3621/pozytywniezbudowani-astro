-- D1 (pz-perf-telemetry) — dokłada pola detekcji botów do ISTNIEJĄCEJ tabeli track_events.
-- Misja „analityka-jakosc-ruchu" 2026-07-18. Worker (handleZBeaconPost) od teraz wstawia
-- env z z.js (webdriver/webgl_renderer/languages_count) + ua_is_bot (isbot na edge);
-- cron aios-workspace/automation/pz_tracking_d1_sync.py przenosi je do tracking.db, gdzie
-- botscore.py liczy klasyfikację. Kształt 1:1 z _track-events-d1.sql (świeże instalacje
-- mają te kolumny od razu).
--
-- Zastosowanie (JEDNORAZOWO, PO merge; ALTER nie jest idempotentny — „duplicate column"
-- przy powtórce jest bezpiecznym no-opem):
--   cd ~/pozytywniezbudowani-astro && npx wrangler d1 execute pz-perf-telemetry --remote \
--     --file functions/api/_track-events-d1-botfields.sql

ALTER TABLE track_events ADD COLUMN webdriver INTEGER;
ALTER TABLE track_events ADD COLUMN webgl_renderer TEXT;
ALTER TABLE track_events ADD COLUMN languages_count INTEGER;
ALTER TABLE track_events ADD COLUMN ua_is_bot INTEGER;
