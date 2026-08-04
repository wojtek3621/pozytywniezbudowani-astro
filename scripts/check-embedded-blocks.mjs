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
 * CO SPRAWDZA (1): dla każdego posta renderuje markdown tym samym silnikiem co Astro
 * i porównuje długość każdego bloku <style>/<script> w źródle i w wyjściu.
 * Ubytek powyżej progu = build pada.
 *
 * CO SPRAWDZA (2) - kontrola MERYTORYCZNA wzoru WLZ (incydent INC-019, 2026-08-04):
 * ten sam kalkulator liczył spadek napięcia dokładnie 2x za duży od publikacji
 * (2024-09-30) do 2026-08-04. Wzór łączył dzielenie mocy przez 3 (założenie układu
 * TRÓJFAZOWEGO symetrycznego: prądy sumują się w przewodzie neutralnym do zera,
 * więc nie ma drogi powrotnej) z mnożnikiem 200, który jest poprawką na drogę
 * "tam i z powrotem" - właściwą wyłącznie dla obwodu JEDNOFAZOWEGO. Te dwa
 * założenia się wykluczają. Poprawny mnożnik przy P/3 to 100.
 * Błąd przeżył dwie "niezależne weryfikacje" (20/20 i 5/5), bo obie liczyły
 * referencję wzorem Z TEGO ARTYKUŁU - to była kalibracja, nie walidacja.
 * Strażnik z punktu (1) pilnował wtedy INTEGRALNOŚCI bloku, nie poprawności liczb.
 * Bliźniaczy wartownik po stronie platformy: aios-workspace ->
 * platforma/tests/test_poprawnosc_kalkulatorow.py (referencja z fizyki: I=P/(3*Uf),
 * R=L/(gamma*S), dU=I*R).
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

// ─── Kontrola merytoryczna wzoru: kalkulator WLZ (INC-019) ────────────────
// Świadomie NIE "pomijamy w ciszy", gdy artykułu albo wzoru nie ma: cichy pominięty
// przypadek to dokładnie ten sposób, w jaki strażnik ślepnie po zmianie nazwy pliku.
const ARTYKUL_WLZ = 'jak-dobrac-kabel-przylaczeniowy-do-domu-jednorodzinnego.md';
const problemyWzoru = [];

try {
  const tresc = readFileSync(join(KATALOG, ARTYKUL_WLZ), 'utf-8');

  const mnoznik = tresc.match(/voltageDrop\s*=\s*\(\s*(\d+)\s*\*\s*powerPerPhase/);
  if (!mnoznik) {
    problemyWzoru.push(
      `${ARTYKUL_WLZ}: nie znaleziono wzoru "voltageDrop = (N * powerPerPhase ...)". ` +
        'Strażnik przestał cokolwiek pilnować - dopasuj wzorzec do nowego kształtu kodu.'
    );
  } else if (mnoznik[1] !== '100') {
    problemyWzoru.push(
      `${ARTYKUL_WLZ}: mnożnik we wzorze spadku napięcia = ${mnoznik[1]}, oczekiwane 100. ` +
        'Wartość 200 przy powerPerPhase = P/3 daje wynik dokładnie 2x za duży (INC-019).'
    );
  }

  // Mnożnik 100 jest poprawny TYLKO w parze z założeniem trójfazowym (P/3).
  // Gdyby ktoś przeszedł na moc jednofazową, poprawne stałoby się 200 - dlatego
  // druga kotwica pilnuje założenia, a nie samej liczby.
  if (!/powerPerPhase\s*=\s*\(\s*power\s*\*\s*1000\s*\)\s*\/\s*3\b/.test(tresc)) {
    problemyWzoru.push(
      `${ARTYKUL_WLZ}: zmieniło się założenie fazowe (powerPerPhase != P*1000/3). ` +
        'Mnożnik 100 przestaje być automatycznie poprawny - przelicz spadek napięcia ' +
        'z definicji (I = P/(3*Uf), R = L/(gamma*S), dU = I*R) i zaktualizuj strażnika.'
    );
  }
} catch (e) {
  problemyWzoru.push(
    `${ARTYKUL_WLZ}: nie udało się odczytać artykułu z kalkulatorem WLZ (${e.code || e.message}). ` +
      'Jeśli artykuł zmienił nazwę albo został wycofany - zaktualizuj ten strażnik świadomie.'
  );
}

if (problemyWzoru.length > 0) {
  console.error('\n✗ check-embedded-blocks: kalkulator WLZ liczy WEDŁUG BŁĘDNEGO WZORU!\n');
  for (const p of problemyWzoru) console.error(`  ${p}`);
  console.error(
    '\n  DLACZEGO TO PILNUJEMY: w symetrycznym układzie trójfazowym prądy sumują się\n' +
      '  w przewodzie neutralnym do zera, więc nie ma drogi powrotnej - mnożnik 2 (czyli\n' +
      '  200 zamiast 100) jest poprawką jednofazową i zawyża spadek dokładnie dwukrotnie.\n' +
      '  Skutek: etykiety "Dopuszczalny"/"Nieodpowiedni" przy kablach poprawnych z zapasem,\n' +
      '  na stronie z ~590 wejściami z Google miesięcznie.\n'
  );
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

if (problemyWzoru.length > 0) {
  process.exit(1);
}

console.log(`✓ check-embedded-blocks: mnożnik wzoru WLZ = 100 przy P/3 (kontrola merytoryczna, INC-019).`);
console.log(
  `✓ check-embedded-blocks: ${blokiRazem} bloków <style>/<script> w ${zbadane} postach ` +
    `renderuje się w całości. OK.`
);
