---
last_modified: 2026-04-03
owner: kazik
status: accepted
---

---
last_modified: 2026-04-03
owner: kazik
status: accepted
---

# ADR-002: Formspree jako formularz kontaktowy

**Status:** Accepted
**Date:** 2026-04-01 (challenge runda 1, punkt #1)
**Deciders:** Wojtek, Claude Code

## Context

Migracja z MiroCMS (PHP backend, reCAPTCHA v2) na static site (Astro, Cloudflare Pages). Static site nie ma backendu — formularz kontaktowy wymaga zewnetrznego serwisu lub custom backendu.

## Decision

Wybralismy **Formspree** jako primary form handler.

## Alternatives

| Opcja | Dlaczego odrzucone |
|-------|-------------------|
| Cloudflare Worker | Wymaga pisania i utrzymywania kodu backendowego. Overengineering na traffic PZ (~1-5 submissions/dzien). |
| Endpoint na aios-2 VPS | Dodaje zaleznosc od VPS. Jesli VPS padnie, formularz przestaje dzialac. Strona Astro jest niezalezna od infra AIOS. |
| mailto: link | Wystawia email na scrapery. Brak ochrony antyspamowej. |

## Consequences

- Zero kodu backendowego, zero utrzymania
- Darmowy plan: 50 submissions/miesiac — wystarczajacy na PZ
- Auto-email na kontakt@pozytywniezbudowani.pl
- Minus: zaleznosc od zewnetrznego serwisu (Formspree)
- Minus: brak pelnej kontroli nad danymi (Formspree przechowuje submissions)
- Fallback: jesli traffic wzrosnie ponad 50/mies — Cloudflare Worker (opcja B)
