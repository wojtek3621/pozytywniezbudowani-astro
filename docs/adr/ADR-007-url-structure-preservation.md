# ADR-007: Zachowanie URL structure 1:1

**Status:** Accepted
**Date:** 2026-04-01
**Deciders:** Wojtek, Claude Code

## Context

MiroCMS uzywa URLi w formacie `/blog/{slug}/`. Migracja na Astro mogla byc okazja do zmiany struktury URL (np. `/artykuly/{slug}/` lub `/blog/{rok}/{slug}/`). Kazda zmiana URL wymaga 301 redirect i ryzyka utraty SEO equity.

## Decision

**Zachowujemy identyczna strukture URL** — zero zmian.

```
/                          → /
/blog/                     → /blog/
/blog/{slug}/              → /blog/{slug}/
/ksiazka/                  → /ksiazka/
/kontakt/                  → /kontakt/
/o-mnie/                   → /o-mnie/
/sklep/                    → /sklep/
/media/                    → /media/
/polityka-prywatnosci/     → /polityka-prywatnosci/
/regulamin-*/              → /regulamin-*/
```

## Alternatives

| Podejscie | Dlaczego odrzucone |
|-----------|-------------------|
| Nowe URLe + 301 | Utrata czesci link equity (Google przekleja 301, ale nie natychmiast). Ryzyko 404 jesli redirect pominiemy. |
| Nowe URLe bez redirect | WYKLUCZONE — utrata calego ruchu organicznego i pozycji w Google. |

## Consequences

- Zero utraty SEO equity — Google nie widzi zmiany URL
- Zero redirect map do utrzymywania
- Trailing slash zachowany (`trailingSlash: 'always'` w astro.config.ts)
- Jedyne redirecty: stare URLe CMS (/admin/, /img2/) → 404, oraz 5 media sub-pages
- Minus: nie mozemy "posprzatac" URL-i (np. `/regulamin-platformy-e-learningowej-2/` — brzydki slug)
