-- D1 (pz-perf-telemetry) — de-anonimizacja tabeli consent_events.
-- Misja „analityka-jakosc-ruchu" 2026-07-18 (owner directive). Dokłada pola consent
-- receipt: device_id (pz_did, wspólny z kolektorem z.js) + IP/UA (server-side) +
-- purposes + banner_version. Worker (src/worker.ts::handleConsentBeaconPost) wstawia
-- je od teraz; cron aios-workspace/automation/pz_consent_d1_sync.py przenosi do aios.db.
--
-- Zastosowanie (JEDNORAZOWO, PO merge; ALTER nie jest idempotentny — jeśli kolumna już
-- istnieje, wrangler zwróci błąd „duplicate column", co jest bezpiecznym no-opem):
--   cd ~/pozytywniezbudowani-astro && npx wrangler d1 execute pz-perf-telemetry --remote \
--     --file functions/api/_consent-events-deanon-d1.sql

ALTER TABLE consent_events ADD COLUMN device_id TEXT;
ALTER TABLE consent_events ADD COLUMN ip TEXT;
ALTER TABLE consent_events ADD COLUMN user_agent TEXT;
ALTER TABLE consent_events ADD COLUMN purposes TEXT;
ALTER TABLE consent_events ADD COLUMN banner_version TEXT;
