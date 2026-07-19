#!/usr/bin/env node
/**
 * Strażnik osadzonych bloków <style>/<script> w postach blogowych.
 *
 * PO CO TO ISTNIEJE (incydent 2026-07-19):
 * Kalkulator doboru kabla WLZ - strona #1 serwisu, ~590 wejść z Google miesięcznie -
 * przez wiele tygodni pokazywał odwiedzającym SUROWY KOD CSS jako tekst i nie liczył
 * niczego. Awaria była CICHA: strona zwracała 200, sitemap się zgadzał, monitoring
 * (pz_health_check.py) sprawdzał wyłącznie kody HTTP i liczbę artykułów, a weryfikacja
 * kalkulatorów z 2026-07-12 testowała POPRAWNOŚĆ WZORÓW na wyekstrahowanej logice
 * (bez DOM), a nie to, czy kod w ogóle dojeżdża do przeglądarki.
 *
 * MECHANIZM USTERKI:
 * W Markdownie surowy HTML dzieli się na bloki. Blok otwarty przez <p>/<div> (typ 6)
 * kończy się na PIERWSZEJ PUSTEJ LINII. Blok otwarty przez <style>/<script> (typ 1)
 * kończy się dopiero na tagu zamykającym. Jeśli więc przed <style>/<script> NIE MA
 * pustej linii, tag nie zaczyna własnego bloku - wpada do poprzedniego i zostaje
 * ucięty na pierwszej pustej linii, czyli w środku CSS/JS. Reszta kodu wycieka na
 * stronę jako widoczny tekst.
 *
 * CO SPRAWDZA: dla każdego posta renderuje markdown tym samym silnikiem co Astro
 * i porównuje długość każdego bloku <style>/<script> w źródle i w wyjściu.
 * Ubytek powyżej progu = build pada.
 *
 * Wołany z `npm run build` (obok check:emdash) oraz `npm run check`.
 */

import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KATALOG = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'post');
const PROG = 0.9; // blok musi przetrwać w >=90% (drobne różnice whitespace są OK)

const proc = await createMarkdownProcessor({});

function bezFrontmattera(t) {
  return t.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
}

const problemy = [];
let zbadane = 0;
let blokiRazem = 0;

for (const plik of readdirSync(KATALOG).filter((f) => f.endsWith('.md'))) {
  const src = bezFrontmattera(readFileSync(join(KATALOG, plik), 'utf-8'));
  const bloki = [...src.matchAll(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/g)];
  if (bloki.length === 0) continue;

  zbadane++;
  const { code } = await proc.render(src);

  for (const dopasowanie of bloki) {
    const [pelny, tag] = dopasowanie;
    blokiRazem++;

    const wnetrze = pelny.slice(pelny.indexOf('>') + 1).trim();
    const probka = wnetrze.slice(0, 25);
    if (!probka) continue;

    let dlugoscWyjscia = 0;
    const i = code.indexOf(probka);
    if (i >= 0) {
      const s = code.lastIndexOf(`<${tag}`, i);
      const e = code.indexOf(`</${tag}>`, i);
      if (s >= 0 && e > s) dlugoscWyjscia = e - s;
    }

    if (dlugoscWyjscia < pelny.length * PROG) {
      problemy.push({
        plik,
        tag,
        zrodlo: pelny.length,
        wyjscie: dlugoscWyjscia,
        procent: Math.round((dlugoscWyjscia / pelny.length) * 100),
      });
    }
  }
}

if (problemy.length > 0) {
  console.error('\n✗ check-embedded-blocks: bloki <style>/<script> są UCINANE przy renderze!\n');
  for (const p of problemy) {
    console.error(`  ${p.plik}`);
    console.error(`     <${p.tag}>: ${p.zrodlo} -> ${p.wyjscie} znaków (ocalało ${p.procent}%)`);
  }
  console.error('\n  PRZYCZYNA (prawie zawsze ta sama): brak PUSTEJ LINII przed <style>/<script>.');
  console.error('  Bez niej tag wpada do bloku HTML otwartego wcześniej przez <p>/<div>,');
  console.error('  a taki blok kończy się na pierwszej pustej linii - czyli w środku kodu.\n');
  console.error('  NAPRAWA: wstaw pustą linię bezpośrednio przed <style>/<script>');
  console.error('  (albo przed komentarzem HTML, który je poprzedza).\n');
  console.error('  Skutek zaniechania: kod wycieka na stronę jako widoczny tekst,');
  console.error('  a narzędzie przestaje działać - przy zachowanym HTTP 200 (awaria CICHA).\n');
  process.exit(1);
}

console.log(
  `✓ check-embedded-blocks: ${blokiRazem} bloków <style>/<script> w ${zbadane} postach ` +
    `renderuje się w całości. OK.`
);
