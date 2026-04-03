# Changelog

Wszystkie istotne zmiany w projekcie pozytywniezbudowani.pl (Astro).

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
- _redirects dla starych URL-i media
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
