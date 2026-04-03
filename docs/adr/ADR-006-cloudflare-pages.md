# ADR-006: Cloudflare Pages jako hosting

**Status:** Accepted
**Date:** 2026-04-01
**Deciders:** Wojtek, Claude Code

## Context

MiroCMS na dhosting.pl (shared hosting): TTFB cold 1.8-9.3s, brak CDN, brak DDoS protection, platny hosting. Potrzebowalismy hostingu dla static site z edge CDN.

## Decision

Wybralismy **Cloudflare Pages** (free tier).

## Alternatives

| Hosting | Dlaczego odrzucone |
|---------|-------------------|
| Vercel | Porownywalna jakosc, ale Cloudflare ma wieksza siec edge (300+ POP) i lepsze DDoS protection w free tier. |
| Netlify | Porownywalna jakosc, ale drozszy na wyzszych tierach. Cloudflare DNS + Pages = mniej vendorow. |
| GitHub Pages | Prostszy, ale brak custom headers, brak edge functions, brak DDoS protection. |
| Dhosting (stary) | Shared hosting, PHP wymagany, brak CDN, TTFB 1.8-9.3s. Nie nadaje sie dla static site. |
| VPS aios-2 | Dodaje zaleznosc od infrastruktury AIOS. Strona powinna byc niezalezna. |

## Consequences

- TTFB < 50ms (edge serve z 300+ POP, w tym Warszawa)
- Hosting $0/mies (free tier: unlimited sites, unlimited bandwidth)
- Cloudflare DDoS protection (wlaczone domyslnie)
- Automatic HTTPS (edge + origin)
- Auto-deploy z GitHub (webhook)
- Custom _headers i _redirects
- Minus: vendor lock-in na Cloudflare DNS (jesli przeniesienie DNS)
- Minus: build limits w free tier (500 builds/mies — wystarczajace)
- Fallback: rollback DNS do dhosting (MiroCMS nadal dziala 30 dni po cutover)
