#!/usr/bin/env node
/**
 * Bramka: żaden wydany link do artykułu bloga nie może prowadzić donikąd.
 *
 * Dlaczego istnieje (badanie indeksacji 2026-10-25): artykuł „Mostki termiczne"
 * opublikowano 25.04 i po 14 minutach cofnięto (`git revert`), a linki do niego
 * w 15 innych artykułach zostały. Google wszedł 24.05, dostał 404 i od pięciu
 * miesięcy nie wraca — choć tekst wrócił 31.05. Budowa strony nie widziała
 * problemu, bo link do nieistniejącej strony jest dla Astro zwykłym napisem.
 *
 * Co sprawdza: każdy `href` do `/blog/{slug}/` (względny albo z domeną PZ) na
 * każdej stronie w `dist/` musi wskazywać WYDANĄ stronę (`dist/blog/{slug}/index.html`)
 * albo adres z regułą w `public/_redirects`. Skanujemy wynik budowy, nie źródła:
 * szkic (`draft: true`) ma plik w `src/`, a strony nie ma — i linki wstawiają też komponenty.
 *
 * Uruchamiany jako `postbuild` (po `npm run build`) oraz ręcznie: `npm run check:links`.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const REDIRECTS = new URL('../public/_redirects', import.meta.url).pathname;

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** `/blog/x` i `/blog/x/` → `/blog/x/` */
const normalizuj = (sciezka) => (sciezka.endsWith('/') ? sciezka : `${sciezka}/`);

const przekierowane = new Set();
if (existsSync(REDIRECTS)) {
  for (const linia of readFileSync(REDIRECTS, 'utf8').split('\n')) {
    const zrodlo = linia.trim().split(/\s+/)[0];
    if (zrodlo && zrodlo.startsWith('/blog/')) przekierowane.add(normalizuj(zrodlo));
  }
}

let pliki;
try {
  pliki = htmlFiles(DIST);
} catch {
  console.log('• check:links — brak dist/, pomijam (uruchom po buildzie)');
  process.exit(0);
}

const WZORZEC =
  /href="(?:https?:\/\/(?:www\.)?pozytywniezbudowani\.pl)?(\/blog\/[a-z0-9][a-z0-9-]*\/?)(?:[#?][^"]*)?"/g;
const martwe = new Map(); // cel → zbiór stron, które do niego linkują
let linkow = 0;

for (const f of pliki) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(WZORZEC)) {
    linkow++;
    const cel = normalizuj(m[1]);
    if (existsSync(join(DIST, cel, 'index.html')) || przekierowane.has(cel)) continue;
    if (!martwe.has(cel)) martwe.set(cel, new Set());
    martwe.get(cel).add(f.replace(DIST, '/'));
  }
}

if (martwe.size) {
  console.error(
    `✗ check:links — ${martwe.size} adresów bloga, do których linkujemy, nie istnieje (brak strony i przekierowania):`
  );
  for (const [cel, skad] of martwe) {
    console.error(`  ${cel}  ← ${skad.size} stron, np. ${[...skad].slice(0, 3).join(', ')}`);
  }
  console.error('  Napraw: usuń/przepnij link albo dodaj 301 w public/_redirects.');
  process.exit(1);
}

console.log(
  `✓ check:links — ${pliki.length} stron, ${linkow} linków do bloga, wszystkie prowadzą do wydanej strony albo przekierowania`
);
