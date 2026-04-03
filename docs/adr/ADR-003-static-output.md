# ADR-003: Static output (nie SSR/hybrid)

**Status:** Accepted
**Date:** 2026-04-01
**Deciders:** Wojtek, Claude Code

## Context

Astro wspiera 3 tryby output: static (pre-render), hybrid (mix), server (SSR). Blog budowlany z 119 artykulami nie wymaga dynamicznego contentu — wszystko jest znane w momencie buildu.

## Decision

Wybralismy **static output** (`output: 'static'` w astro.config.ts).

## Alternatives

| Tryb | Dlaczego odrzucone |
|------|-------------------|
| SSR (server) | Wymaga runtime (Node.js/Cloudflare Workers). Wiecej kosztow, wiecej punktow awarii. Blog nie ma dynamicznego contentu. |
| Hybrid | Kompromis — czesc stron static, czesc SSR. Niepotrzebne: formularz obsluguje Formspree, search jest client-side. |

## Consequences

- TTFB < 50ms (static HTML z edge CDN, zero server-side processing)
- Hosting $0/mies (Cloudflare Pages free tier)
- Zero runtime dependencies — strona dziala nawet jesli backend AIOS padnie
- Build time: 22s na 480 stron — akceptowalne
- Minus: kazda zmiana treści wymaga rebuild + deploy (30-60s)
- Minus: brak dynamicznych funkcji (komentarze, personalizacja) — niezlecone, nie potrzebne
- Escape hatch: zmiana na hybrid = zmiana 1 linii w config (gdyby SSR kiedys byl potrzebny)
