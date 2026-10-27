import path from 'path';
import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
// import partytown from '@astrojs/partytown';
import icon from 'astro-icon';
import compress from 'astro-compress';
import astrowind from './vendor/integration';

import { readingTimeRemarkPlugin, responsiveTablesRehypePlugin, lazyImagesRehypePlugin } from './src/utils/frontmatter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Sitemapa: lastmod artykułów (2026-10-27, badanie indeksacji) ─────────────────────
// Google nie wiedział, który artykuł się zmienił — „Mostki termiczne” wisiały w jego pamięci
// jako 404 od maja, choć tekst wrócił 31.05. `lastmod` = późniejsza z dat `updateDate`
// i `publishDate` z frontmattera (data z gita zawyżałaby: masowe zmiany techniczne, np.
// przetagowanie 300 artykułów). Znacząca edycja artykułu (treść albo linki) MA podbić
// `updateDate` — inaczej mapa podaje starą datę. Wzorzec: 4izby-astro/astro.config.
const SITE_PZ = 'https://pozytywniezbudowani.pl';
const LASTMOD: Record<string, string> = {};
for (const plik of readdirSync('./src/data/post').filter((n) => /\.mdx?$/.test(n))) {
  const tekst = readFileSync(`./src/data/post/${plik}`, 'utf8');
  const fm = tekst.split(/\r?\n---/)[0];
  const daty = ['updateDate', 'publishDate']
    .map((k) => fm.match(new RegExp(`^${k}:\\s*['"]?([0-9][0-9T:.\\-+Z]*)`, 'm'))?.[1])
    .filter((d): d is string => !!d)
    .map((d) => new Date(d))
    .filter((d) => !Number.isNaN(d.valueOf()));
  if (daty.length) {
    const najnowsza = new Date(Math.max(...daty.map((d) => d.valueOf())));
    LASTMOD[`${SITE_PZ}/blog/${plik.replace(/\.mdx?$/, '')}/`] = najnowsza.toISOString();
  }
}

// Note: whenExternalScripts helper removed (was used for Partytown, which is disabled — breaks GTM/Meta Pixel)

export default defineConfig({
  output: 'static',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      // SEO: sitemap zawiera TYLKO strony indeksowalne i kanoniczne.
      // Wyklucz strony tagów (noindex), kategorii (noindex, duplikat /blog/)
      // oraz paginację (noindex). Źródło: audyt 2026-06-01 (1212 URL → ~313).
      // P2 (huby tematyczne): gdy /tag/ stanie się indeksowalne, usuń regułę
      // /tag/ poniżej (zostaw wykluczenie paginacji /tag/x/N/ przez \d+).
      filter: (page) =>
        !/\/tag\//.test(page) &&
        !/\/category\//.test(page) &&
        !/\/blog\/\d+\/?$/.test(page) &&
        // Lead magnet + wariant LP dla płatnego ruchu — noindex, poza sitemap (Sprint 1 książki 2026-07)
        !/\/darmowy-rozdzial\//.test(page) &&
        !/\/ksiazka\/start\//.test(page) &&
        // Robocza kopia strony głównej (noindex) + strona informacyjna narzędzia Google Ads —
        // ani jedna, ani druga nie jest treścią dla czytelnika, więc nie ma jej w sitemapie
        // (audyt 2026-08-23, Finding 6: Google dostawał adresy, których ma nie indeksować).
        !/\/nowa\//.test(page) &&
        !/\/ads-data-connector\//.test(page),
      serialize(item) {
        const lastmod = LASTMOD[item.url];
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
        'flat-color-icons': [
          'template',
          'gallery',
          'approval',
          'document',
          'advertising',
          'currency-exchange',
          'voice-presentation',
          'business-contact',
          'database',
        ],
      },
    }),

    // Partytown removed — breaks GTM, Meta Pixel, CookieYes, Hotjar
    // ...whenExternalScripts(() =>
    //   partytown({
    //     config: { forward: ['dataLayer.push'] },
    //   })
    // ),

    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      // Phase 1 (2026-04-15): enable image compression
      // Plan: plans/active/2026-04-15-pz-astro-performance-ksiazka.md (Faza 1.7)
      // GO/NO-GO: verified via local build + GitHub Actions CI (Node 18/20/22)
      Image: true,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),

    astrowind({
      config: './src/config.yaml',
    }),
  ],

  image: {
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin],
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
