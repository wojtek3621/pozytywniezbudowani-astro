# ADR-005: Partytown dla GTM i analytics

**Status:** Accepted
**Date:** 2026-04-01
**Deciders:** Wojtek, Claude Code

## Context

Strona PZ uzywa GTM (GTM-PKRLVW2G) do GA4 i VisitorTracking. Third-party scripts blokuja main thread i pogarszaja Core Web Vitals (CWV) — szczegolnie LCP i FID.

## Decision

Wybralismy **Partytown** (@astrojs/partytown) do uruchamiania GTM i tracking scripts w Web Worker.

## Alternatives

| Podejscie | Dlaczego odrzucone |
|-----------|-------------------|
| Inline scripts (jak MiroCMS) | Blokuja main thread. GTM + GA4 = 50-100ms na mobile. Gorsze CWV. |
| Async/defer scripts | Lepsze niz inline, ale nadal main thread. Partytown = worker thread = zero CWV impact. |
| Usunac tracking | Wojtek potrzebuje analytics do decyzji biznesowych. Nie wchodzi w gre. |

## Consequences

- Zero wplywu na CWV — skrypty w Web Worker, nie na main thread
- GTM, GA4, VisitorTracking dzialaja normalnie
- Konfiguracja: `forward: ['dataLayer.push']` w astro.config.ts
- Flaga `hasExternalScripts = true` — bez niej Partytown nie laduje sie do buildu (bug znaleziony w audycie enterprise)
- Minus: Partytown ma ograniczenia (nie wszystkie DOM API dostepne w Worker)
- Minus: debugging trudniejszy (DevTools nie widza Worker thread bezposrednio)
