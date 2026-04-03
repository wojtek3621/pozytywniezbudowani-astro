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

# ADR-001: AstroWind jako base theme

**Status:** Accepted
**Date:** 2026-04-01
**Deciders:** Wojtek, Claude Code

## Context

Potrzebowalismy Astro theme jako punkt startowy dla migracji pozytywniezbudowani.pl z MiroCMS. Projekt wymaga: landing page (strona ksiazki), blog (119 artykulow), paginacja, dark mode, SEO, responsive images, kategorie/tagi.

## Decision

Wybralismy **AstroWind** (onWidget, 5.5k stars, MIT).

## Alternatives

| Theme | Stars | Dlaczego odrzucone |
|-------|-------|-------------------|
| AstroPaper | 4.4k | Najlepszy na czysty blog, ale brak gotowego landing page. Strona ksiazki wymagalaby budowy od zera. |
| Bookworm Light | 359 | Ladny magazynowy styl, ale brak dark mode, mniejsza spolecznosc. |
| Astro Cactus | 1.6k | Dev-blog, zbyt techniczny na blog budowlany. |
| Blogster | 656 | Martwy projekt (ostatni commit 2023-11), niekompatybilny z Astro 5. |
| Astro Nano | 844 | Ultra-minimalny, portfolio — za prosty na 119 artykulow. |

## Consequences

- AstroWind daje gotowy landing page + blog — strona ksiazki, hero, CTA, FAQ z pudelka
- Paginacja, dark mode, RSS, sitemap, kategorie, tagi, responsive images — wbudowane
- Tailwind = latwa zmiana kolorow na brand PZ
- Minus: wiecej pracy na personalizacji niz czysty blog theme
- Minus: ostatni update 2025-08 — monitorowac aktywnosc upstream

## References

- Research: wewn. `builds/research-astro-themes-pz-2026-04-01.md` (workspace AIOS)
