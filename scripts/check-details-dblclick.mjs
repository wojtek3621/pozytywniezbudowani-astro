#!/usr/bin/env node
/**
 * Bramka: każda wydana strona z akordeonem <details> MUSI mieć mechanizm
 * tłumiący przypadkowy dwuklik.
 *
 * Dlaczego istnieje (P0 2026-08-29, pewnaplyta.pl → ta sama klasa błędu tutaj):
 * natywne <details>/<summary> przełącza się przy KAŻDYM kliknięciu, więc dwuklik
 * (nawyk z pulpitu) otwierał treść i w tej samej chwili ją zamykał. Dla człowieka
 * akordeon wyglądał na martwy: klika i nic się nie dzieje. Pomiar przed naprawą
 * dawał `open=false` po dwukliku na 8/8 pytań /pakiet-prawny i 12/12 na /ksiazka.
 *
 * Mechanizm mieszka w src/layouts/Layout.astro (guard `__pzDetailsDblGuard`).
 * Jeśli ktoś zbuduje stronę z akordeonem na layoucie bez tego guardu — usterka
 * wraca po cichu, bo `<details>` nadal „działa", tylko nie dla człowieka.
 *
 * Uruchamiany jako `postbuild` (npm robi to automatycznie po `npm run build`)
 * oraz ręcznie: `npm run check:details`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const GUARD = '__pzDetailsDblGuard';

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

let sprawdzone = 0;
let zAkordeonem = 0;
const bledy = [];

let pliki;
try {
  pliki = htmlFiles(DIST);
} catch {
  console.log('• check:details — brak dist/, pomijam (uruchom po buildzie)');
  process.exit(0);
}

for (const f of pliki) {
  const html = readFileSync(f, 'utf8');
  sprawdzone++;
  if (!html.includes('<details')) continue;
  zAkordeonem++;
  if (!html.includes(GUARD)) {
    bledy.push(f.replace(DIST, ''));
  }
}

if (bledy.length) {
  console.error(
    `✗ check:details — ${bledy.length} stron ma <details> BEZ mechanizmu tłumiącego dwuklik (${GUARD}):`
  );
  for (const b of bledy.slice(0, 20)) console.error('   ', b);
  if (bledy.length > 20) console.error(`    … i ${bledy.length - 20} więcej`);
  console.error('  Skutek: dwuklik otwiera i natychmiast zamyka treść — akordeon wygląda na martwy.');
  console.error('  Mechanizm mieszka w src/layouts/Layout.astro (P0 2026-08-29).');
  process.exit(1);
}

console.log(
  `✓ check:details — ${zAkordeonem}/${sprawdzone} stron z akordeonem ma mechanizm tłumiący dwuklik`
);
