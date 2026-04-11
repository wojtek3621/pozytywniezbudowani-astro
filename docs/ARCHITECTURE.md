---
last_modified: 2026-04-03
owner: kazik
status: current
---

# Architecture — pozytywniezbudowani.pl

Architektura, data flow, crosscutting concepts i glossary.
Source of truth: plan migracji w workspace AIOS (wewn.: `plans/active/2026-04-01-pz-astro-migration.md`)

---

## 1. System Overview

```
                    +------------------+
                    |   Cloudflare     |
                    |   Pages CDN      |
                    |   (300+ POP)     |
                    +--------+---------+
                             |
                             | edge serve (static HTML)
                             |
                    +--------+---------+
                    |   GitHub repo    |
                    | pozytywniezbu-   |
                    | dowani-astro     |
                    +--------+---------+
                             |
                    push     | webhook
                             |
              +--------------+--------------+
              |                             |
     +--------+--------+          +--------+--------+
     |  AIOS Pipeline  |          |  Manual edit    |
     |  (aios-2 VPS)   |          |  (developer)    |
     +-----------------+          +-----------------+
```

## 2. Data Flow: Publikacja artykulu (pipeline)

```
1. Wojtek zleca artykul (Telegram/terminal)
       |
2. AIOS blog-master skill
   - Research (baza wiedzy, web)
   - Pisanie artykulu (HTML)
   - Review (blog-reviewer skill)
   - Humanizacja (styl PZ)
   - Grafika (hero image prompt)
       |
3. pz_astro_publisher.py
   - Konwertuje HTML → Markdown + frontmatter YAML
   - Kopiuje hero image do src/assets/images/blog/
   - Generuje slug z tytulu
       |
4. git add + commit + push
   - Commit: "feat: artykul — {Tytul}"
   - Push do main branch
       |
5. GitHub Actions
   - Build test (Node 18/20/22)
   - astro check (TypeScript)
       |
6. Cloudflare Pages webhook
   - npm run build (22s, 480+ stron)
   - Deploy na CDN
       |
7. Live: https://pozytywniezbudowani.pl/blog/{slug}/
   - Sitemap automatycznie zaktualizowany
   - RSS feed automatycznie zaktualizowany
```

Czas od push do live: **30-60 sekund**.

## 3. Data Flow: Formularz kontaktowy

```
1. Uzytkownik wypelnia formularz na /kontakt/
       |
2. POST → Formspree (https://formspree.io/f/{id})
   - Walidacja po stronie Formspree
   - Honeypot field (anti-spam)
       |
3. Formspree → email na kontakt@pozytywniezbudowani.pl
   - Auto-reply (opcjonalnie)
       |
4. Formspree dashboard — historia submissions
```

Zero backendu na stronie. Zero PHP. Zero bazy danych.

## 4. Data Flow: Analytics (tracking)

```
1. Uzytkownik otwiera strone
       |
2. Layout.astro laduje Partytown (Web Worker)
       |
3. Partytown uruchamia w Worker thread:
   - GTM (GTM-PKRLVW2G)
   - VisitorTracking
       |
4. GTM → GA4 (Google Analytics 4)
   - Page views, events, conversions
       |
5. Zero wplywu na CWV
   - Main thread wolny
   - LCP, FID, CLS — niezaburzone
```

## 5. Crosscutting Concepts

### 5.1 Strategia SEO

| Element                 | Implementacja                               | Plik                            |
| ----------------------- | ------------------------------------------- | ------------------------------- |
| Canonical URL           | Auto per strona                             | Layout.astro via Metadata.astro |
| Open Graph tags         | Auto (title, description, image, url, type) | Metadata.astro                  |
| Twitter Cards           | summary_large_image                         | config.yaml                     |
| JSON-LD: BlogPosting    | Per artykul (title, author, date, image)    | ArticleSchema.astro             |
| JSON-LD: BreadcrumbList | Per artykul (Home > Blog > Artykul)         | BreadcrumbSchema.astro          |
| JSON-LD: Organization   | Tylko homepage                              | OrganizationSchema.astro        |
| Sitemap                 | Auto-generated (@astrojs/sitemap)           | sitemap-index.xml               |
| RSS feed                | Auto-generated (@astrojs/rss)               | rss.xml                         |
| robots.txt              | Explicit Sitemap + Disallow /draft/         | public/robots.txt               |
| Trailing slash          | Wymuszony (`trailingSlash: 'always'`)       | astro.config.ts                 |

### 5.2 Strategia obrazow

| Warstwa                   | Mechanizm                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------- |
| Hero images (blog)        | Astro Assets — auto WebP/AVIF, responsive srcset, lazy loading                        |
| Obrazy w tresci artykulow | Surowy HTML (MiroCMS export) — bez optymalizacji Astro (dług techniczny, ADR pending) |
| Logo, favicon, ikony      | Static w public/ — bez transformacji                                                  |
| OG images                 | Default fallback (`~/assets/images/default.png`) jesli artykul nie ma hero            |

Dlug techniczny: inline images w artykulach (119 plikow) to surowy HTML z `<img>`, nie Markdown `![alt](src)`. Astro nie optymalizuje inline HTML images. Refactor: 4-8h (post-MVP).

### 5.3 Strategia cache

| Zasob                        | Cache-Control                         | Gdzie                |
| ---------------------------- | ------------------------------------- | -------------------- |
| `/_astro/*` (JS, CSS, fonty) | `public, max-age=31536000, immutable` | public/\_headers     |
| HTML strony                  | Cloudflare default (edge cache)       | Cloudflare dashboard |
| Obrazy w public/             | Cloudflare default                    | Cloudflare dashboard |

Cloudflare purge cache: automatyczny przy kazdym deploy (nowy build = nowe hashe w `_astro/`).

### 5.4 Strategia analytics

| Narzedzie             | Cel                                        | Metoda                     |
| --------------------- | ------------------------------------------ | -------------------------- |
| GTM                   | Tag management (GA4, conversions)          | Partytown (worker thread)  |
| GA4                   | Traffic, behavior, conversions             | Via GTM                    |
| VisitorTracking       | Session recording                          | Partytown (worker thread)  |
| Cloudflare Analytics  | Edge metrics (requests, bandwidth, errors) | Wbudowane w Cloudflare     |
| Google Search Console | SEO (indexing, CWV, coverage)              | Weryfikacja via TXT record |
| pz_health_check.py    | Uptime monitoring (co 15 min)              | AIOS cron                  |

### 5.5 Strategia bezpieczenstwa

| Wektor            | MiroCMS (stary)         | Astro (nowy)                                 |
| ----------------- | ----------------------- | -------------------------------------------- |
| SQL injection     | Mozliwy (PHP + MySQL)   | Wyeliminowany (zero bazy danych)             |
| XSS               | Znaleziony w img-editor | Wyeliminowany (static HTML, zero user input) |
| PHP exploits      | Mozliwe (stary CMS)     | Wyeliminowane (zero PHP)                     |
| Brute force admin | Mozliwy (/admin/)       | Wyeliminowany (zero panelu admin)            |
| DDoS              | Brak ochrony            | Cloudflare DDoS protection                   |
| File upload       | Mozliwy (upload.php)    | Wyeliminowany (zero upload)                  |

Security headers (public/\_headers):

- `X-Frame-Options: DENY` — anti-clickjacking
- `X-Content-Type-Options: nosniff` — anti-MIME-sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- CSP: nie wdrozone (Partytown + GTM inline scripts wymagaja unsafe-inline)

## 6. Glossary

| Termin                    | Definicja                                                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **AIOS**                  | AI Operating System — system automatyzacji Vultima sp. z o.o. na VPS aios-2. Zarządza pipeline blogowym, monitoringiem, agentami AI. |
| **Astro**                 | Framework do budowy statycznych stron (SSG). Generuje HTML w momencie build, nie w runtime.                                          |
| **AstroWind**             | Open-source Astro theme (onWidget, 5.5k stars). Base theme dla pozytywniezbudowani.pl.                                               |
| **Cloudflare Pages**      | Hosting static sites z globalnym CDN (300+ POP). Darmowy tier.                                                                       |
| **Content Collections**   | Mechanizm Astro do zarzadzania trescia (pliki Markdown/MDX z type-safe schema).                                                      |
| **CWV / Core Web Vitals** | Metryki Google mierzace UX: LCP (ladowanie), FID (interaktywnosc), CLS (stabilnosc).                                                 |
| **Cutover**               | Moment przelaczenia DNS z dhosting na Cloudflare — "go live" nowej strony.                                                           |
| **dhosting.pl**           | Stary hosting (shared, PHP, MySQL). Zachowany jako fallback 30 dni po cutover.                                                       |
| **Formspree**             | Serwis do obslugi formularzy na static sites. Zero backendu.                                                                         |
| **Frontmatter**           | Metadane artykulu w formacie YAML na poczatku pliku Markdown (title, date, tags).                                                    |
| **GTM**                   | Google Tag Manager — zarządza skryptami analytics (GA4, konwersje).                                                                  |
| **Islands**               | Architektura Astro: interaktywne komponenty JS w morzu statycznego HTML.                                                             |
| **MailerLite**            | Platforma email marketingu. Newsletter PZ.                                                                                           |
| **MDX**                   | Markdown z komponentami (React/Preact). Rozszerzenie Markdown.                                                                       |
| **MiroCMS**               | Autorski CMS (PHP/Smarty/MySQL) — stara strona PZ. Martwy projekt.                                                                   |
| **Partytown**             | Biblioteka do uruchamiania third-party scripts w Web Worker (zero CWV impact).                                                       |
| **Pipeline**              | Automatyczny flow AIOS: blog-master → reviewer → humanizator → grafik → publisher.                                                   |
| **Preact**                | Lekka alternatywa React (~3KB vs ~40KB). Uzywana do island components.                                                               |
| **PZ**                    | Pozytywnie Zbudowani — marka edukacyjna Wojciecha Tracichleba (pozytywniezbudowani.pl).                                              |
| **SalesCRM**              | Platforma e-commerce. Sklep PZ (link zewnetrzny).                                                                                    |
| **Slug**                  | URL-friendly identyfikator artykulu (np. `kolejnosc-prac-wykonczeniowych-w-domu`).                                                   |
| **Trailing slash**        | Slash na koncu URL (`/blog/slug/`). Wymuszony w config dla kompatybilnosci z MiroCMS.                                                |
