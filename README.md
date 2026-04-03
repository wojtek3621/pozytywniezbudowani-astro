# pozytywniezbudowani.pl

Blog budowlany i strona autorska Wojciecha Tracichleba. Astro 5 + Tailwind CSS + Cloudflare Pages.

**Produkcja:** https://pozytywniezbudowani.pl
**Base theme:** [AstroWind](https://github.com/onWidget/astrowind) (MIT)

---

## Quick start

```bash
npm install
npm run dev       # localhost:4321
npm run build     # produkcyjny build → ./dist/
npm run preview   # podglad buildu lokalnie
npm run check     # sprawdzenie typow i bledow Astro
npm run fix       # ESLint + Prettier
```

Wymagania: Node.js 18+ (testowane na 18, 20, 22).

## Architektura

```
src/
  content/        # Content Collections
    config.ts     # schema (title, description, publishDate, heroImage, tags, ...)
  data/
    post/         # 119 artykulow blogowych (.md)
  pages/
    index.astro          # strona glowna
    ksiazka.astro        # strona ksiazki "Od marzenia do wprowadzenia"
    sklep.astro          # produkty (link do SalesCRM)
    o-mnie.astro         # bio autora
    kontakt.astro        # formularz (Formspree)
    media/               # publikacje prasowe
    newsletter.astro     # zapis do MailerLite
    [...blog]/           # dynamiczny routing artykulow (/blog/slug/)
    rss.xml.ts           # RSS feed
    404.astro
    polityka-prywatnosci.astro
    regulamin-*.astro    # regulaminy (3)
  components/
    common/              # SEO, JSON-LD (ArticleSchema, BreadcrumbSchema, OrganizationSchema)
    blog/                # komponenty bloga
    widgets/             # Header, Footer, Hero, itd.
    ui/                  # przyciski, formularze, karty
  layouts/
    Layout.astro         # glowny layout (head, meta, Partytown, footer)
    MarkdownLayout.astro # layout dla postow
  navigation.ts          # nawigacja + social links + linki prawne
  config.yaml            # konfiguracja SEO, bloga, analytics
public/
  images/                # hero images, ksiazka, media, logo
  _headers               # security headers (Cloudflare Pages)
  _redirects             # 301 redirects
  robots.txt             # sitemap + disallow rules
  favicon.svg, favicon.ico, apple-touch-icon.png
```

## Publikacja artykulu

### Przez pipeline AIOS (automatycznie)

```
AIOS blog-master → reviewer → humanizator → grafik
    → pz_astro_publisher.py (HTML → Markdown frontmatter)
    → git commit + push → Cloudflare auto-build (30-60s) → live
```

Skrypt: `pz_astro_publisher.py` (wewn.: `data/connectors/pz_astro_publisher.py` w workspace AIOS)

### Recznie

1. Utworz plik `src/data/post/slug-artykulu.md` z frontmatter:
   ```yaml
   ---
   title: "Tytul artykulu"
   description: "Meta opis (150-160 znakow)"
   publishDate: 2026-04-03
   author: "Wojciech Tracichleb"
   image: "~/assets/images/blog/slug.jpg"
   tags: ["budowa domu", "fundamenty"]
   category: "Blog"
   ---
   ```
2. Dodaj hero image do `src/assets/images/blog/`
3. `npm run build` — sprawdz czy build przechodzi
4. `git add . && git commit -m "feat: nowy artykul — Tytul" && git push`
5. Cloudflare Pages auto-deploy (30-60s do live)

## Deploy

Push do `main` → GitHub Actions (build + check) → Cloudflare Pages webhook → auto-deploy na CDN.

Staging: automatyczny preview na `*.pages.dev` per commit.
Rollback: `git revert <hash> && git push` → Cloudflare auto-redeploy (<2 min).

## Konfiguracja

| Plik | Co konfiguruje |
|------|---------------|
| `src/config.yaml` | Nazwa strony, SEO defaults, blog settings, analytics |
| `astro.config.ts` | Integracje Astro (Partytown, MDX, Sitemap, Preact) |
| `tailwind.config.js` | Kolory brandowe, typografia |
| `src/navigation.ts` | Menu, social media, linki prawne w footerze |
| `public/_headers` | Security headers (Cloudflare Pages) |
| `public/_redirects` | 301 redirects |
| `public/robots.txt` | Sitemap, Disallow rules |

## Integracje

| System | Mechanizm | Config |
|--------|-----------|--------|
| GTM (GTM-PKRLVW2G) | Partytown (worker thread, zero CWV impact) | `astro.config.ts` |
| MailerLite | Embed form (island component) | `src/pages/newsletter.astro` |
| Formspree | POST formularz kontaktowy | `src/pages/kontakt.astro` |
| SalesCRM | Link zewnetrzny (sklep) | `src/pages/sklep.astro` |
| Cloudflare Pages | Auto-deploy na push do main | GitHub webhook |
| AIOS pipeline | pz_astro_publisher.py → git push | wewn.: `data/connectors/` |
| pz_health_check.py | Monitoring co 15 min (homepage, blog, sitemap) | wewn.: `automation/` |

## Brand

Kolory PZ: `#c5a44e` (zloty), `#3369B1` (niebieski), `#5A656B` (szary).
Szczegoly: wewn. `context/brand-voice.md` (workspace AIOS)

## Dokumentacja

| Dokument | Lokalizacja |
|----------|------------|
| Operations Runbook | [docs/OPERATIONS.md](docs/OPERATIONS.md) |
| Architecture & Data Flow | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Architecture Decision Records | [docs/adr/](docs/adr/) |
| Migration Plan (source of truth) | wewn.: `plans/active/2026-04-01-pz-astro-migration.md` |
| Audyt starej strony | wewn.: `builds/audyty/2026-04-01-pz-website-full-audit.md` |
| Audyt enterprise standards | wewn.: `builds/audyty/2026-04-02-pz-astro-enterprise-audit.md` |
| Audyt dokumentacji | wewn.: `builds/audyty/2026-04-03-pz-astro-documentation-re-audit.md` |

## Wlasciciel

**Wojciech Tracichleb** — Pozytywnie Zbudowani / Vultima sp. z o.o.
Utrzymanie: AIOS (Kazik — Senior Developer)

## Licencja

Base theme AstroWind: MIT — [LICENSE.md](LICENSE.md).
Tresci (artykuly, obrazy, branding): Copyright Wojciech Tracichleb. All rights reserved.

<!-- doc-metadata: last_modified=2026-04-03, owner=kazik, status=current -->
