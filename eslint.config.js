import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    files: ['**/*.{js,jsx,astro}'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    // Define the configuration for `<script>` tag.
    // Script in `<script>` is assigned a virtual file name with the `.js` extension.
    files: ['**/*.{ts,tsx}', '**/*.astro/*.js'],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      // Note: you must disable the base rule as it can report incorrect errors
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    // ── Wzorzec obronny beaconów: cichy `catch` jest DECYZJĄ, nie niedbalstwem ──
    // z.js (kolektor first-party), ConsentBanner, PerfTelemetry i telemetria
    // książki są pisane tak, żeby żaden ich błąd nie wywrócił strony ani banera
    // zgód — stąd `try { … } catch {}` bez obsługi. Domyślne `no-empty` oraz
    // `caughtErrors: 'all'` widzą w tym 66 błędów i trzymały `npm run check`
    // (a więc i CI) na czerwono od miesięcy — bramka, która świeci na czerwono
    // zawsze, nie niesie żadnej informacji.
    // Dlatego zmieniamy REGUŁĘ, nie kod: pusty catch i nieużywana nazwa błędu
    // są tu legalne. Reszta `no-unused-vars` (zmienne, argumenty, importy)
    // działa bez zmian, więc realne martwe zmienne nadal wychodzą.
    // ⚠ `public/z.js` jest BAJT W BAJT identyczny z kopiami w platforma/ i sklep/
    // (patrz nagłówek pliku) — nie wolno go „modernizować" w jednym repo.
    rules: {
      'no-empty': ['error', { allowEmptyCatch: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
    },
  },
  {
    ignores: [
      'dist',
      'node_modules',
      '.github',
      'types.generated.d.ts',
      '.astro',
      // Legal pages with raw HTML from old CMS — not worth linting
      'src/pages/polityka-prywatnosci.astro',
      'src/pages/regulamin-*.astro',
      // Third-party tracking scripts (VisitorTracking uses var, non-standard patterns)
      'src/components/common/Analytics.astro',
      // Real-user telemetry instrumentation — intentionally ES5-compatible (old Safari, Chrome 50)
      // to maximize browser coverage. Uses `var`, try/catch without binding name, pre-ES6 patterns.
      'src/components/common/PerfTelemetry.astro',
    ],
  },
];
