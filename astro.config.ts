import path from 'path';
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
        !/\/ksiazka\/start\//.test(page),
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
