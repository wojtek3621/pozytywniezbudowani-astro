---
last_modified: 2026-04-03
owner: kazik
status: accepted
---

# ADR-008: Markdown content (nie headless CMS)

**Status:** Accepted
**Date:** 2026-04-01
**Deciders:** Wojtek, Claude Code

## Context

Artykuly PZ byly w MySQL (MiroCMS). Przy migracji na Astro trzeba bylo zdecydowac gdzie przechowywac content: pliki Markdown w repo (git-based) czy headless CMS (Strapi, Contentful, Sanity, etc.).

## Decision

Wybralismy **pliki Markdown w repozytorium** (Astro Content Collections).

## Alternatives

| Podejscie                              | Dlaczego odrzucone                                                                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Headless CMS (Strapi, self-hosted)     | Wymaga osobnego serwera, bazy danych, utrzymania. Over-engineering na 1-osobowy zespol redakcyjny.                                            |
| Headless CMS (Contentful/Sanity, SaaS) | Dodatkowa zaleznosc od zewnetrznego serwisu. Koszty rosna z iloscia contentu. Wojtek nie potrzebuje WYSIWYG — AIOS pipeline generuje content. |
| Zachowanie MySQL + API                 | Utrzymywanie starej bazy + backendu. Sprzeczne z celem migracji (eliminacja PHP/MySQL).                                                       |

## Non-Goals

- Auto-sync z zewnetrznym CMS (content flow jest jednokierunkowy: AIOS → git → live)
- WYSIWYG edytor w przegladarce (Wojtek nie edytuje recznie, pipeline AIOS generuje Markdown)
- Multi-author workflow (1 autor, 1 pipeline)

## Consequences

- Zero zewnetrznych zaleznosci — content w git, wersjonowany, z historia
- Pipeline AIOS generuje Markdown bezposrednio → git push → live
- Backup = git (GitHub + lokalne klony na VPS)
- Astro Content Collections daje type-safe schema (frontmatter walidowany w buildzie)
- Minus: edycja wymaga git (nie WYSIWYG) — ale Wojtek nie edytuje recznie, AIOS pipeline robi to za niego
- Minus: kazda zmiana wymaga rebuild (30-60s) — akceptowalne
- Minus: content w repo = wieksze repo (119 plikow .md + hero images) — akceptowalne

## Content schema

```yaml
---
title: string # wymagany
description: string # wymagany (meta description)
publishDate: date # wymagany
author: string # default: "Wojciech Tracichleb"
image: string # hero image path
tags: string[] # SEO keywords
category: string # default: "Blog"
draft: boolean # default: false
---
```
