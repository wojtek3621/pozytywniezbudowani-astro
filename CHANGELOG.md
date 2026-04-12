# Changelog

Wszystkie istotne zmiany w projekcie pozytywniezbudowani.pl (Astro).

## 2026-04-12 (sesja 3 — Round 4 landing redesign / Meta Ads)

### Dodane

- /ksiazka/: Hero Split dark bg (bg-slate-900) + portret Wojtka + 4 zawężone value props + CTA z data-fbq-event="AddToCart"
- /ksiazka/: Pricing Card dedykowana sekcja (blue gradient, 119 zł, 5 bullets, BEZ value stacking)
- /ksiazka/: Book schema JSON-LD minimal (@type:Book, Hardcover, InStock, 119 PLN, BEZ aggregateRating)
- /ksiazka/: Meta Pixel base + ViewContent + AddToCart listeners (6 CTA) + UTM whitelist forwarding (8 params)
- /ksiazka/: FAQ 7 pytań — natywne `<details>` (Kiedy zacząć / znajomy GW / darmowe art. / 608 stron / ebook / dostawa / zwrot)
- /ksiazka/: Sticky mobile CTA bar (fixed bottom, amber, md:hidden)
- /ksiazka/: Sekcja "Dla kogo" — portret Wojtka (wojtek-dla-kogo.jpg) zastępuje book spread
- /ksiazka/: O autorze — dark bg (bg-slate-900) + portret (wojtek-o-autorze-ksiazka.jpg) + guarantee placeholder box
- /ksiazka/: Recenzje — placeholder "Polecają nas / Extradom.pl" + TODO comment dla logo
- Nowe assety: wojtek-dla-kogo.jpg (atelier 12, 1600×1064), wojtek-o-autorze-ksiazka.jpg (atelier 4, 1600×1064)

### Zmienione

- /ksiazka/ Hero: zastąpiony custom hero Split (dark bg) zamiast generycznego komponentu Hero
- /ksiazka/ title: "Książka — Od Marzenia Do Wprowadzenia" → "Od Marzenia Do Wprowadzenia — Kompletny przewodnik budowy domu | Wojciech Tracichleb"
- /ksiazka/ meta description: zaktualizowany z "600 stron" → "608 stron, 86 rozdziałów, 12 lat doświadczenia generalnego wykonawcy"
- /ksiazka/ "Dla kogo": H2 zmieniony na "Dla kogo napisałem tę książkę"
- /ksiazka/ footer CTA: copy "Kup książkę — 119 zł" → "Gotów zamówić? Kliknij tutaj — 119 zł"
- widgets/Stats.astro, widgets/Testimonials.astro, widgets/Footer.astro, widgets/HeroText.astro (4x), widgets/Pricing.astro: usunięcie `motion-safe:md:opacity-0` — fix IntersectionObserver (Meta Pixel + SEO crawler widzi content)

### Naprawione

- IntersectionObserver opacity bug: 6 plików widgetów miało `motion-safe:md:opacity-0` → content invisible dla crawlerów i przy disabled motion

### Uwagi

- Meta Pixel: placeholder `TODO_META_PIXEL_ID` — Wojtek dostarczy real ID przed uruchomieniem kampanii
- Guarantee: `<!-- WOJTEK DECISION: confirm guarantee terms (30d, buyer pays return shipping, opcja A) -->`
- Extradom.pl logo: `<!-- TODO: Wojtek dostarczy plik logo -->` (placeholder text obecny)
- opacity-0 w ui/ i blog/ (Timeline, ItemGrid, WidgetWrapper, SinglePost, GridItem, ListItem, RelatedPosts) — poza scope tej sesji, do decyzji Wojtka

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
