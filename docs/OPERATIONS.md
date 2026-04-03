# Operations Runbook — pozytywniezbudowani.pl

Procedury operacyjne dla strony Astro na Cloudflare Pages.
Source of truth: `~/aios-workspace/plans/active/2026-04-01-pz-astro-migration.md`

---

## 1. Publikacja nowego artykulu

### Pipeline AIOS (standardowy flow)

1. Skill `/blog-master` generuje artykul (research, pisanie, review, grafika)
2. `pz_astro_publisher.py` konwertuje output na Markdown + frontmatter
3. Automatyczny `git commit + push` do repo
4. Cloudflare Pages auto-build (30-60s)
5. Artykul live na `https://pozytywniezbudowani.pl/blog/{slug}/`

Skrypt: `~/aios-workspace/data/connectors/pz_astro_publisher.py`

### Recznie

1. Utworz `src/data/post/{slug}.md` z frontmatter (patrz README)
2. Hero image → `src/assets/images/blog/{slug}.jpg`
3. `npm run build` — weryfikacja
4. `git add . && git commit -m "feat: artykul — {Tytul}" && git push`
5. Cloudflare auto-deploy

### Weryfikacja po publikacji

- Sprawdz URL: `https://pozytywniezbudowani.pl/blog/{slug}/`
- Sprawdz sitemap: `https://pozytywniezbudowani.pl/sitemap-index.xml`
- Sprawdz RSS: `https://pozytywniezbudowani.pl/rss.xml`
- Google Search Console: Request Indexing (opcjonalnie)

## 2. Aktualizacja istniejacego artykulu

1. Edytuj plik `src/data/post/{slug}.md`
2. Zaktualizuj `modifiedDate` w frontmatter (jesli istnieje) lub dodaj je
3. `git commit -m "fix: aktualizacja — {Tytul}" && git push`
4. Auto-deploy

Uwaga: zmiana slug = zmiana URL. Jesli slug sie zmienia, dodaj redirect w `public/_redirects`:
```
/blog/stary-slug/ /blog/nowy-slug/ 301
```

## 3. Dodanie nowej strony statycznej

1. Utworz `src/pages/{slug}.astro`
2. Uzyj Layout:
   ```astro
   ---
   import Layout from '~/layouts/PageLayout.astro';
   import { SITE } from 'astrowind:config';
   const metadata = { title: 'Tytul strony' };
   ---
   <Layout metadata={metadata}>
     <!-- tresc -->
   </Layout>
   ```
3. Dodaj link w `src/navigation.ts` (menu glowne lub footer)
4. `npm run build && git push`

## 4. Zmiana konfiguracji

### Social media (footer)

Plik: `src/navigation.ts` → tablica `socialLinks`
```typescript
{ ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://facebook.com/...' },
```

### Dane kontaktowe

Plik: `src/pages/kontakt.astro` — edytuj sekcje z adresem, telefonem, emailem.

### Formularz kontaktowy (Formspree)

Plik: `src/pages/kontakt.astro` → atrybut `action` w formularzu.
Konto Formspree: https://formspree.io/ (zaloguj sie aby zobaczyc submissions).

### MailerLite (newsletter)

Plik: `src/pages/newsletter.astro` — embed form z MailerLite.
Account ID: 1272504, form: konfigurowany w MailerLite dashboard.

### SEO defaults

Plik: `src/config.yaml` → sekcje `metadata`, `site`.

### Kolory / typografia

Pliki: `src/components/CustomStyles.astro`, `tailwind.config.js`
Brand PZ: `#c5a44e` (zloty), `#3369B1` (niebieski), `#5A656B` (szary).

## 5. Monitoring

### pz_health_check.py (AIOS, co 15 min)

Sprawdza: homepage (200), blog listing (200), sitemap (200).
Logi: `~/aios-workspace/automation/logs/pz_health_check.log`
Stan: `~/aios-workspace/automation/logs/pz_health_state.json`
Alert: Telegram do Wojtka jesli strona nie odpowiada.

### Cloudflare Analytics

Dashboard: https://dash.cloudflare.com/ → projekt PZ → Analytics.
Metryki: requests, bandwidth, CWV, error rate.

### Google Search Console

URL: https://search.google.com/search-console/ → pozytywniezbudowani.pl
Sprawdzaj: Coverage, CWV, Sitemaps, Indexing.

## 6. Troubleshooting

### Build sie wysypal po push

1. Sprawdz GitHub Actions: https://github.com/wojtek3621/pozytywniezbudowani-astro/actions
2. Sprawdz Cloudflare Pages deploy log
3. Najczestsze przyczyny:
   - Bledny frontmatter w nowym poscie (brak wymaganego pola)
   - Import nieistniejacego obrazka
   - Blad TypeScript w komponencie
4. Fix: popraw blad, `git push` ponownie

### Strona zwraca 404

- Sprawdz czy URL ma trailing slash (`/blog/slug/` nie `/blog/slug`)
- Sprawdz `public/_redirects` — czy jest redirect
- Sprawdz czy plik istnieje w `src/pages/` lub `src/data/post/`

### Formularz kontaktowy nie dziala

- Sprawdz Formspree dashboard — czy endpoint jest aktywny
- Sprawdz czy `action` w kontakt.astro ma prawidlowy URL
- Sprawdz siec (DevTools → Network) — status POST requesta

### Newsletter nie zbiera leadow

- Sprawdz MailerLite dashboard — status formularza
- Sprawdz czy embed code w newsletter.astro jest aktualny
- Test: zapisz sie z testowym emailem

### Google deindeksuje strony

- Sprawdz GSC Coverage report
- Sprawdz robots.txt (nie blokuje crawlera?)
- Sprawdz `_headers` — nie wysylaja `X-Robots-Tag: noindex`?
- Sprawdz frontmatter postow — `robots: index: false`?
- Submit sitemap ponownie w GSC

## 7. Rollback

### Content rollback (zly artykul, bledna tresc)

```bash
cd ~/pozytywniezbudowani-astro
git revert HEAD    # cofnij ostatni commit
git push           # auto-redeploy (<2 min)
```

### Infrastructure rollback (do MiroCMS)

Procedura awaryjna — tylko jesli Cloudflare/Astro kompletnie nie dziala:
1. Zmien nameservery z powrotem na dhosting: ns1.dhosting.pl / ns2.dhosting.pl
2. DNS propagation: 1-4h (do 48h worst case)
3. MiroCMS na dhostingu nadal dziala (zachowac konto min. 30 dni po cutover)

Pelna procedura: `~/aios-workspace/plans/active/2026-04-01-pz-astro-migration.md` sekcja 9.

## 8. Kontakty i eskalacja

| Rola | Kto | Kanal |
|------|-----|-------|
| Wlasciciel | Wojciech Tracichleb | Telegram, tel. 574 421 100 |
| Utrzymanie | Kazik (AIOS Senior Dev) | Telegram @KazikVultimaBot |
| Hosting | Cloudflare | https://dash.cloudflare.com/ |
| DNS (stary) | dhosting.pl | Panel klienta |
| Email | dpoczta.pl | Panel dhosting |
| Formularz | Formspree | https://formspree.io/ |
| Newsletter | MailerLite | https://app.mailerlite.com/ |
