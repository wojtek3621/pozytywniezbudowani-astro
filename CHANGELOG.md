# Changelog

Wszystkie istotne zmiany w projekcie pozytywniezbudowani.pl (Astro).

## 2026-04-12 (sesja 2 — feedback po deploy)

### Dodane

- /ksiazka/: lightbox galerii "Wnętrze książki" — vanilla JS, zero dependencies, keyboard nav (Escape/Arrow), aria-labels, prev/next buttons, scroll lock
- /ksiazka/: nowy asset `niezaleznie-etapu-flatlay.jpg` — DALL-E 3 flat lay (book + blueprints + tools, 1600×914 JPEG)

### Zmienione

- Zdjęcie "O mnie": photo (20).jpg — granatowa koszula, hala showroom, brak rekwizytu (zastępuje photo(6) z zielonym placeholderem green screen)
- /ksiazka/ sekcja "Niezależnie od etapu": YouTube iframe (qTDvpQbUg9c) → AI-generated flat lay image (spójny z brand construction magazine)
- /ksiazka/ galeria: `<div>` thumbnails → `<button class="lightbox-trigger">` z data-lightbox-index, cursor-pointer

## 2026-04-12 (sesja 1)

### Dodane

- Homepage: YouTube iframe embed w sekcji "Dla kogo" (qTDvpQbUg9c) — video Wojtka po lewej + lista 5 grup docelowych po prawej
- /ksiazka/: spis treści → collapsible akordeon z 5 `<details>` (Części 1-4), domyślnie zwinięty
- /ksiazka/: galeria przywrócona do rzeczywistych rozkładówek (interior-01..08), zastępuje stockowe product shots

### Zmienione

- Homepage (index.astro): merge /nowa/ → / — Split Hero z Wojtek + książka portret, Oswald H1, gold CTA "Kup książkę — 119 zł"; stary hero zachowany jako index.astro.bak-magazine-hero
- Zdjęcie "O mnie": photo (6).jpg — jasna koszula, marmurowe schody; nadpisuje brązową koszulę (photo 9)
- /ksiazka/ copy: "Ponad 600 stron" → "Aż 600 stron napisanych przystępnym językiem" (3 miejsca)

### Naprawione

- Usunięty `robots: { index: false, follow: false }` z nowego index.astro (był w /nowa/, niepotrzebny na homepage — noindex aplikowany przez `public/_headers` dla test domain)

## 2026-04-03

### Dokumentacja

- Enterprise documentation: README, Operations Runbook, 8 ADRow, Architecture
- Metadata governance: frontmatter, cross-references, content schema, CHANGELOG
- CI quality gates: markdownlint + lychee link check

## 2026-04-02

### Content alignment

- Strona ksiazki: pelny spis tresci, Druzyna Pierscienia, statystyki
- Homepage: pelne tresci z produkcji (hero, CTA, sekcje)
- O mnie + Media: pelne bio, opisy, YouTube embed
- Newsletter: strona /newsletter/ z MailerLite embed form
- Sklep, nawigacja, social media, kontakt RODO — wyrownane z produkcja

## 2026-04-01

### Performance

- CLS fix: inline image styles na blogu
- Accessibility: poprawiony kontrast muted text
- Preconnect/dns-prefetch dla GTM, VisitorTracking, MailerLite

### Infrastructure

- CI green: astro check 0 errors, eslint 0 errors, prettier clean
- Formspree: prawidlowy endpoint (mpqojwrz)

### Branding

- PZ branded favicons (gold/dark icon z logo SVG)

### SEO

- JSON-LD structured data: BlogPosting, BreadcrumbList, Organization
- \_redirects dla starych URL-i media
- robots.txt: pelny, z sitemap
- RSS: polski tytul + autocomplete na formularzu kontaktowym

### Security

- Security headers: X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy

### Integracje

- GTM + VisitorTracking via Partytown (Web Worker, zero CWV impact)

### Migracja (initial)

- Init AstroWind template
- Import 119 artykulow blogowych z MiroCMS + hero images
- PZ branding: kolory (#c5a44e, #3369B1, #5A656B), logo, nawigacja
- Strony statyczne: homepage, ksiazka, kontakt, o-mnie, sklep, media, regulaminy
- Inline images + polskie UI labels
