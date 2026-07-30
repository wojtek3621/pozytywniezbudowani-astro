-- D1 pz-perf-telemetry: ALTER track_events — sygnały bramki pomiarowej
-- (misja bramka-pomiarowa 2026-07-30; lustrzana migracja tracking.db: 003_relay_signals.sql).
--
-- fbp/fbc — ciasteczka Meta piksela (advanced matching przekaźnika CAPI),
-- mkt_consent — stan zgody marketingowej w chwili zdarzenia (sygnał pomocniczy),
-- section — nazwa sekcji strony dla event_type='section_view' (np. 'cena').
--
-- Uruchomienie jednorazowe (powtórka = "duplicate column" → bezpieczny no-op):
--   cd ~/pozytywniezbudowani-astro && npx wrangler d1 execute pz-perf-telemetry \
--     --remote --file functions/api/_track-events-d1-relay.sql

ALTER TABLE track_events ADD COLUMN fbp TEXT;
ALTER TABLE track_events ADD COLUMN fbc TEXT;
ALTER TABLE track_events ADD COLUMN mkt_consent INTEGER;
ALTER TABLE track_events ADD COLUMN section TEXT;
