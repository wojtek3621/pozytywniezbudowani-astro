---
last_modified: 2026-04-03
owner: kazik
status: accepted
---

# ADR-004: Preact (nie React) dla island components

**Status:** Accepted
**Date:** 2026-04-01 (challenge runda 1, punkt #2)
**Deciders:** Wojtek, Claude Code

## Context

Astro Islands wymaga JS framework do interaktywnych komponentow (formularz, newsletter, slider). Domyslnie wiele Astro themes uzywa React.

## Decision

Wybralismy **Preact** (~3KB) zamiast React (~40KB).

## Alternatives

| Framework | Rozmiar | Dlaczego odrzucone                                                                                  |
| --------- | ------- | --------------------------------------------------------------------------------------------------- |
| React     | ~40KB   | 10x wiekszy. Identyczne API (JSX), ale niepotrzebny rozmiar na proste komponenty.                   |
| Svelte    | ~2KB    | Mniejszy niz Preact, ale inny ekosystem — mniej kompatybilny z istniejacymi komponentami AstroWind. |
| Solid.js  | ~7KB    | Reaktywny, ale mniej popularny ekosystem.                                                           |
| Vue       | ~33KB   | Zbyt duzy. Inny paradygmat niz JSX.                                                                 |
| CSS-only  | 0KB     | Idealne dla slidera, ale formularz z walidacja wymaga JS.                                           |

## Consequences

- 10x mniejszy bundle niz React (3KB vs 40KB)
- API compatible z React (JSX, hooks) — latwe portowanie
- Aktywnie utrzymywany przez AstroWind (juz zintegrowany)
- Wystarczajacy na PZ: formularz, newsletter embed, slider ksiazki
- Minus: mniejszy ekosystem komponentow niz React (ale PZ nie potrzebuje bibliotek UI)
