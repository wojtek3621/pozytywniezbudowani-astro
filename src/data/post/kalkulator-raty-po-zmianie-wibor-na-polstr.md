---
publishDate: 2026-10-22T07:00:00 # ustawić w dniu publikacji
updateDate: 2026-10-22T07:00:00 # ustawić w dniu publikacji
title: 'Kalkulator raty po zmianie WIBOR na POLSTR – policzcie aneks od banku'
excerpt: 'Bank proponuje aneks: POLSTR zamiast WIBOR, nowa marża, czasem spread. Wpiszcie liczby z harmonogramu i z aneksu, a kalkulator pokaże ratę dziś i po zmianie, marżę, przy której oprocentowanie się nie zmienia, i ratę przy wyższym wskaźniku.'
image: '~/assets/images/blog/kalkulator-raty-po-zmianie-wibor-na-polstr.jpeg'
category: 'Blog'
tags:
  - 'Finanse i kredyt'
author: 'Wojciech Tracichleb'
metadata:
  canonical: 'https://pozytywniezbudowani.pl/blog/kalkulator-raty-po-zmianie-wibor-na-polstr/'
  title: 'Kalkulator raty po zmianie WIBOR na POLSTR – aneks od banku'
  description: 'Policzcie ratę przed aneksem i po nim: nowy wskaźnik, marża i spread z aneksu, marża zrównująca oprocentowanie i rata przy wskaźniku wyższym o 1 i 2 punkty. Przykład liczbowy z jawnymi założeniami.'
  robots:
    index: true
    follow: true
---

<!-- Powiazane: platforma/content/html/kalkulator-zmiany-wskaznika.html (repo AIOS), builds/2026-10-20-kalk-polstr/raport.md, builds/2026-10-21-kalk-polstr-wpisy/raport.md -->

<p>Bank przysłał propozycję aneksu, w której zamiast WIBOR 3M ma być POLSTR 1M Stopa Składana, do tego nowa marża, a czasem jeszcze spread korygujący. Pierwsze pytanie, jakie wtedy przychodzi do głowy, dotyczy raty i właśnie na nie odpowiada ten kalkulator. Wpisujecie liczby z harmonogramu spłat i z aneksu, a on pokazuje ratę dziś i po zmianie, różnicę w ciągu najbliższego roku, odsetki do końca kredytu, marżę, przy której oprocentowanie zostałoby takie, jakie jest dziś, oraz ratę po zmianie przy wskaźniku wyższym o 1 i 2 punkty procentowe.</p>

<p>Od razu uczciwie: nie jestem doradcą kredytowym i nigdy nie pracowałem przy kredytach ani ubezpieczeniach. Od 2013 roku buduję domy, a sam jako inwestor budowałem własny i brałem na niego kredyt hipoteczny. Kalkulator policzy oprocentowanie i ratę, ale o tym, czy podpisać aneks, zdecydujecie sami, gdy przeczytacie cały dokument, także to, co zmienia się w nim poza oprocentowaniem.</p>

<p>Skąd wzięła się zmiana, co obowiązuje dziś, a co jest dopiero w projekcie ustawy, opisałem w tekście <a href="/blog/polstr-zamiast-wibor/">POLSTR zamiast WIBOR – co to znaczy dla kredytu na budowę domu</a>, a tutaj zajmiemy się wyłącznie liczeniem.</p>

<h2>Skąd wziąć liczby do kalkulatora</h2>

<p>Kalkulator nie pobiera notowań wskaźników, więc wszystkie wartości wpisujecie sami i przy każdej liczy się to, skąd ją weźmiecie.</p>

<ul>
<li><strong>Kapitał pozostały do spłaty i liczba pozostałych rat</strong> – z aktualnego harmonogramu spłat lub zaświadczenia z banku, a nie z umowy sprzed lat, bo od tamtej pory część kapitału już spłaciliście. Kredyt, który ma jeszcze 22 lata do końca, to 264 raty.</li>
<li><strong>Wskaźnik, który bank stosuje dziś</strong> – wartość z ostatniego ustalenia oprocentowania, którą znajdziecie w harmonogramie lub w zawiadomieniu o zmianie oprocentowania. Nie wpisujcie dzisiejszego notowania ze strony GPW Benchmark, bo bank ustalił Wasze oprocentowanie z innego dnia i z notowania wyjdzie rata inna niż ta, którą płacicie.</li>
<li><strong>Marża dziś</strong> – tak jak jest zapisana w umowie kredytu.</li>
<li><strong>Nowy wskaźnik</strong> – dokładnie ten, który jest w aneksie, z wartością z dnia, z którego bank będzie ją brał. Pełna nazwa ma znaczenie, bo POLSTR 1M Stopa Składana i jednodniowy POLSTR to dwie różne liczby: według GPW Benchmark pierwszy wynosił 20 października 2026 roku 3,53946%, a drugi 19 października 3,634%.</li>
<li><strong>Marża po zmianie</strong> – z aneksu. Kalkulator na początek przepisuje do tego pola marżę dziś, żebyście nie musieli wpisywać jej drugi raz, jeśli bank jej nie zmienia.</li>
<li><strong>Spread korygujący</strong> – stały dodatek do nowego wskaźnika, o ile aneks go przewiduje, przy czym może on być też ujemny. Gdy aneks nie mówi o spreadzie, zostawcie pole puste lub wpiszcie 0.</li>
<li><strong>Raty równe albo malejące</strong> – zaznaczcie te, które macie w umowie.</li>
</ul>

<!-- POCZĄTEK KALKULATORA POLSTR K1 -->
<div id="kalk-k1" class="polstr-kalk">
<h2>Rata po zmianie wskaźnika – WIBOR i POLSTR</h2>
<p>Wartości wpisz z harmonogramu, zawiadomienia lub oferty banku. Notowania i opis wskaźników znajdziesz u <a href="https://gpwbenchmark.pl/" target="_blank" rel="noopener">administratora GPW Benchmark</a>. Przykłady w polach nie są bieżącymi notowaniami.</p>
<p>Przy okresowo stałej stopie wskaźnik nie zmienia oprocentowania do końca okresu stałego. Ten kalkulator liczy ratę przy oprocentowaniu znanym z góry; inną konstrukcję poproś bank o rozpisanie.</p>
<div id="k1-blad" role="alert" style="display:none"></div>
<div class="polstr-pola"><div><label for="k1-saldo">Kapitał pozostały do spłaty (zł)</label><input id="k1-saldo" type="text" inputmode="decimal" placeholder="np. 480 000"><small>Weź saldo z harmonogramu albo zaświadczenia banku.</small></div><div><label for="k1-raty">Liczba pozostałych rat (mies.)</label><input id="k1-raty" type="text" inputmode="numeric" placeholder="np. 264"><small></small></div><div><label for="k1-wsk-przed">Wskaźnik, który bank stosuje dziś (%)</label><input id="k1-wsk-przed" type="text" inputmode="decimal" placeholder="np. 3,89"><small>Wartość z ostatniego ustalenia oprocentowania – w harmonogramie albo zawiadomieniu banku. Dzisiejsze notowanie to inny scenariusz.</small></div><div><label for="k1-marza-przed">Marża dziś (p.p.)</label><input id="k1-marza-przed" type="text" inputmode="decimal" placeholder="np. 2,00"><small></small></div><div><label for="k1-wsk-po">Nowy wskaźnik – dokładnie ten z aneksu (%)</label><input id="k1-wsk-po" type="text" inputmode="decimal" placeholder="np. 3,54"><small>Wpisz wartość wskaźnika z aneksu i z dnia, z którego bank będzie ją brał. Jeśli aneks mówi o POLSTR 1M Stopa Składana, nie wpisuj jednodniowego POLSTR.</small></div><div><label for="k1-marza-po">Marża po zmianie (p.p.)</label><input id="k1-marza-po" type="text" inputmode="decimal" placeholder="np. 2,00"><small>Na początek kopiujemy marżę dziś; możesz ją zmienić.</small></div><div><label for="k1-spread">Spread korygujący z aneksu (p.p.)</label><input id="k1-spread" type="text" inputmode="decimal" placeholder="np. 0"><small>Zostaw puste albo wpisz 0, jeśli aneks nie przewiduje spreadu. Dopuszczalny jest także spread ujemny.</small></div></div>
<fieldset><legend>Raty</legend><label><input type="radio" name="k1-rodzaj-wybor" value="rowne" checked> Równe</label><label><input type="radio" name="k1-rodzaj-wybor" value="malejace"> Malejące</label><input id="k1-rodzaj" type="hidden" value="rowne"></fieldset>
<div class="polstr-akcje"><button id="k1-btn-oblicz" type="button" onclick="obliczK1()">Oblicz</button><button id="k1-btn-wyczysc" type="button" onclick="wyczyscK1()">Wyczyść</button></div>
<div id="k1-status" role="status" class="polstr-sr"></div>
<div id="k1-wyniki" style="display:none">
<p id="k1-horyzont"></p><div class="polstr-wynik"><div class="polstr-karta"><span>Modelowa rata za pełny miesiąc po zmianie</span><strong id="k1-rata_po" data-etykieta="Modelowa rata za pełny miesiąc po zmianie">–</strong></div><div class="polstr-karta"><span>Modelowa rata dziś</span><strong id="k1-rata_przed" data-etykieta="Modelowa rata dziś">–</strong></div><div class="polstr-karta"><span>Różnica rat: po zmianie minus dziś</span><strong id="k1-roznica_raty" data-etykieta="Różnica rat: po zmianie minus dziś">–</strong></div><div class="polstr-karta"><span>Suma różnic: po zmianie minus dziś</span><strong id="k1-roznica_12" data-etykieta="Suma różnic: po zmianie minus dziś">–</strong></div><div class="polstr-karta"><span>Oprocentowanie dziś</span><strong id="k1-opr_przed" data-etykieta="Oprocentowanie dziś">–</strong></div><div class="polstr-karta"><span>Oprocentowanie po zmianie</span><strong id="k1-opr_po" data-etykieta="Oprocentowanie po zmianie">–</strong></div><div class="polstr-karta"><span>Odsetki do końca przy dzisiejszym wskaźniku</span><strong id="k1-odsetki_przed" data-etykieta="Odsetki do końca przy dzisiejszym wskaźniku">–</strong></div><div class="polstr-karta"><span>Odsetki do końca przy nowym wskaźniku</span><strong id="k1-odsetki_po" data-etykieta="Odsetki do końca przy nowym wskaźniku">–</strong></div><div class="polstr-karta"><span>Marża zrównująca oprocentowanie</span><strong id="k1-marza" data-etykieta="Marża zrównująca oprocentowanie">–</strong></div><div class="polstr-karta"><span>Rata po zmianie przy wskaźniku wyższym o 1 p.p.</span><strong id="k1-stres1" data-etykieta="Rata po zmianie przy wskaźniku wyższym o 1 p.p.">–</strong></div><div class="polstr-karta"><span>Rata po zmianie przy wskaźniku wyższym o 2 p.p.</span><strong id="k1-stres2" data-etykieta="Rata po zmianie przy wskaźniku wyższym o 2 p.p.">–</strong></div></div><p id="k1-interpretacja"></p>
<p>Kalkulator liczy samo oprocentowanie. Nie uwzględnia opłat, ubezpieczeń, produktów dodatkowych ani kosztu aneksu.</p>
<p>Gdyby oba wskaźniki stały w miejscu do końca kredytu, odsetki wyniosłyby tyle, ile pokazano wyżej. Wskaźniki się zmieniają – to porównanie dzisiejszych warunków, nie prognoza.</p>
<p>Marża zrównuje tylko oprocentowanie. Opłaty, ubezpieczenia i warunki nadpłaty porównaj w aneksie.</p><p>Liczymy w uproszczeniu – miesiąc to 1/12 roku. Bank liczy odsetki za rzeczywiste dni i zaokrągla raty, więc kwoty w harmonogramie mogą się nieco różnić.</p>
<p>Kalkulator liczy matematykę raty i nie sprawdza limitu odsetek maksymalnych – wynik nie przesądza, jakie odsetki bank może pobrać.</p>
<p>Budujesz i bank wypłaca kredyt w transzach? Pełna rata zacznie się po karencji; koszt tej fazy policz ze wzoru we <a href="/blog/kalkulator-transz-kredytu-na-budowe-domu/">wpisie o transzach i karencji</a>.</p>
</div></div>

<style>
.polstr-kalk {max-width:820px;margin:24px auto;padding:24px;border:1px solid #ddd;border-radius:12px;background:#faf9f6;color:#30383c;font-size:16px;line-height:1.55;font-family:inherit;box-sizing:border-box}
.polstr-kalk * {box-sizing:border-box;min-width:0}
.polstr-kalk h2 {font-size:1.5rem;line-height:1.3;margin:0 0 20px}
.polstr-pola,.polstr-wynik {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.polstr-kalk label {display:block;font-weight:600;margin-bottom:6px}
.polstr-kalk input[type=text] {display:block;width:100%;font-size:18px;padding:12px;border:1px solid #849097;border-radius:6px;background:white;color:#30383c}
.polstr-kalk small {display:block;color:#555;font-size:14px;line-height:1.5;margin-top:6px}
.polstr-kalk fieldset {border:0;padding:0;margin:16px 0}
.polstr-kalk fieldset label {display:inline-block;margin-right:18px}
.polstr-akcje {display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}
.polstr-kalk button {font-size:16px;font-weight:600;padding:12px 18px;border:1px solid #555;border-radius:6px;background:white;color:#30383c;cursor:pointer}
.polstr-kalk button:first-child {background:var(--aw-color-primary,#c5a44e);color:#202629;border-color:#8a6d2a}
.polstr-kalk :focus-visible {outline:3px solid #3369b1;outline-offset:3px}
.polstr-kalk [role=alert] {padding:14px;color:#9b2020;background:#fff0f0;border:1px solid #9b2020;margin-bottom:20px}
.polstr-kalk .polstr-karta {background:white;padding:16px;border:1px solid #ddd;border-radius:8px}
.polstr-kalk .polstr-karta span {display:block;font-size:14px}
.polstr-kalk .polstr-karta strong {display:block;font-size:clamp(18px,4.8vw,25px);margin-top:8px;overflow-wrap:anywhere}
.polstr-kalk .polstr-tabela {overflow-x:auto;margin:20px 0}
.polstr-kalk table {border-collapse:collapse;width:100%;font-size:14px}
.polstr-kalk th,.polstr-kalk td {padding:10px;text-align:left;border-bottom:1px solid #ccc}
.polstr-kalk .polstr-sr {position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.polstr-kalk details {margin:18px 0}
.polstr-kalk summary {cursor:pointer;font-weight:600}
@media(max-width:600px) {.polstr-kalk {padding:16px;margin:16px 0}.polstr-pola,.polstr-wynik {grid-template-columns:1fr}}
</style>

<script>
/* Kalkulatory Centrum: wspólny odczyt liczb z pól, komunikaty, formatowanie i pokazywanie
   wyniku albo błędu (misja KALK-N, 20.10.2026; audyt KALK: K03, K04, K06, K07, K08, K17, K20,
   K29, K30, K37, K43). Ładowany `<script src>` w pliku treści PRZED skryptem kalkulatora.

   Zasada odczytu (K03): cały napis z pola musi być liczbą. Dozwolone: spacje każdego rodzaju
   jako separator tysięcy, przecinek albo kropka dziesiętna, jednostka POLA na końcu („zł”, „%”,
   „m”, „kW”, „cm”, „m²”, „lat”, „mies.”), minus typograficzny. W polu kwoty zapis z kropkami
   albo przecinkami w tysiącach („400.000”, „1.200.000”, „400,000”) jest odrzucany z podpowiedzią,
   nigdy czytany jako 400 zł. Tekst to komunikat, nigdy zero.

   Zdarzenia dla zapisu wyniku (kalkulator-zapis.js): `kalk:wynik` po udanym obliczeniu (szczegół
   `obszar` = id elementu z wynikiem), `kalk:blad` po odrzuceniu danych, `kalk:wyczysc` po „Wyczyść”.
   Powiazane: platforma/static/js/kalkulator-zapis.js, platforma/content/html/kalkulator-*.html,
   platforma/tests/test_poprawnosc_kalkulatorow.py (rata równa). */
(function () {
  "use strict";

  var NBSP = " ";
  var SPACJE = /[\s     ]/g;
  var JEDNOSTKI = {
    "zł": /(?:zł|zl|pln)$/i,
    "%": /%$/,
    "m": /m$/i,
    "kW": /kw$/i,
    "cm": /cm$/i,
    "m²": /(?:m²|m2)$/i,
    "lat": /(?:lata|lat|roku|rok|l)$/i,
    "mies.": /(?:miesięcy|miesiące|miesiąc|mies\.?|m)$/i
  };

  /* Ścisły odczyt napisu z pola. Zwraca {ok: true, wartosc, miejsca} albo
     {ok: false, powod: 'pusty' | 'tysiace' | 'tekst' | 'ulamek'}.
     opcje: jednostka (klucz z JEDNOSTKI), calkowita (ułamek = odrzucenie). */
  function odczyt(tekst, opcje) {
    opcje = opcje || {};
    var s = String(tekst == null ? "" : tekst).replace(SPACJE, "").replace(/[−–]/g, "-");
    if (s === "") return { ok: false, powod: "pusty" };
    var j = opcje.jednostka && JEDNOSTKI[opcje.jednostka];
    if (j) s = s.replace(j, "");
    if (opcje.jednostka === "zł" && /^[+-]?\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?$/.test(s)) {
      var kropki = /^[+-]?\d{1,3}(?:\.\d{3})+/.test(s);
      return { ok: false, powod: "tysiace", separator: kropki ? "." : "," };
    }
    var m = /^([+-]?)(\d+)(?:[.,](\d+))?$/.exec(s);
    if (!m) return { ok: false, powod: "tekst" };
    var wartosc = parseFloat(m[1] + m[2] + (m[3] ? "." + m[3] : ""));
    if (!isFinite(wartosc)) return { ok: false, powod: "tekst" };
    var ulamek = m[3] ? m[3].replace(/0+$/, "") : "";
    if (opcje.calkowita && ulamek) return { ok: false, powod: "ulamek" };
    return { ok: true, wartosc: wartosc, miejsca: ulamek.length };
  }

  /* Komunikat do odrzuconego odczytu. p: {co: 'kwotę kredytu', przyklad: '400 000',
     pelne: 'lata', brak: 'Podaj …' (opcjonalnie), ulamek: '…' (opcjonalnie)}. */
  function komunikat(wynik, p) {
    switch (wynik.powod) {
      case "pusty":
        return p.brak || ("Podaj " + p.co);
      case "tysiace":
        return "Wpisz " + p.co + (wynik.separator === "." ? " bez kropek" : " bez przecinków w tysiącach") +
          ", np. " + p.przyklad;
      case "ulamek":
        return p.ulamek || ("Wpisz pełne " + p.pelne + ", np. " + p.przyklad);
      default:
        return "Wpisz " + p.co + " liczbą, np. " + p.przyklad;
    }
  }

  /* Odczyt pola po id; błędy dopisywane do tablicy `bledy` jako {pole, tekst}.
     p: jak w `komunikat` oraz: jednostka, calkowita, pusteJakoZero, dodatnia, nieujemna,
     min, max, zakres (komunikat zakresu), maksMiejsc, miejsca (komunikat precyzji). */
  function pole(id, p, bledy) {
    var el = document.getElementById(id);
    var w = odczyt(el ? el.value : "", p);
    if (!w.ok) {
      if (w.powod === "pusty" && p.pusteJakoZero) return 0;
      bledy.push({ pole: id, tekst: komunikat(w, p) });
      return NaN;
    }
    var x = w.wartosc;
    var zly = (p.dodatnia && !(x > 0)) || (p.nieujemna && x < 0) ||
      (p.min != null && x < p.min) || (p.max != null && x > p.max);
    if (zly) {
      bledy.push({ pole: id, tekst: p.zakres || ("Wpisz " + p.co + " od " + liczbaTekst(p.min) + " do " + liczbaTekst(p.max)) });
      return NaN;
    }
    if (p.maksMiejsc != null && w.miejsca > p.maksMiejsc) {
      bledy.push({ pole: id, tekst: p.miejsca || ("Wpisz " + p.co + " z najwyżej jednym miejscem po przecinku, np. " + p.przyklad) });
      return NaN;
    }
    return x;
  }

  /* ── Formatowanie prezentacji (nigdy z powrotem do pól) ── */

  function tysiace(cyfry) {
    return cyfry.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  }

  /* Kwota z twardymi spacjami (K08). grosze: true = zawsze 2 miejsca, 'auto' = gdy nie całe. */
  function kwota(x, grosze) {
    var zGroszami = grosze === true || (grosze === "auto" && Math.abs(x - Math.round(x)) >= 0.005);
    if (zGroszami) {
      var t = Math.abs(x).toFixed(2).split(".");
      return (x < 0 ? "-" : "") + tysiace(t[0]) + "," + t[1];
    }
    var r = Math.round(x);
    return (r < 0 ? "-" : "") + tysiace(String(Math.abs(r)));
  }

  function zl(x, grosze) {
    return kwota(x, grosze) + NBSP + "zł";
  }

  /* Procent z przecinkiem dziesiętnym (K37). */
  function procent(x, miejsca) {
    return x.toFixed(miejsca == null ? 2 : miejsca).replace(".", ",");
  }

  /* Liczba z przecinkiem, bez zer końcowych, do 2 miejsc (udziały transz, K47). */
  function procentKrotko(x) {
    return String(Math.round(x * 100) / 100).replace(".", ",");
  }

  function liczbaTekst(x) {
    return String(x).replace(".", ",");
  }

  /* Odmiana: formy = [1, 2–4, 5+, ułamek] (ułamek opcjonalny, inaczej forma 5+). */
  function odmiana(n, formy) {
    if (Math.round(n) !== n) return formy[3] || formy[2];
    if (n === 1) return formy[0];
    var j = n % 10, d = n % 100;
    if (j >= 2 && j <= 4 && (d < 12 || d > 14)) return formy[1];
    return formy[2];
  }

  /* Rata równa (annuitetowa) stabilna przy stopie bliskiej zera i równej zero (K30):
     kwota · r / (1 − (1 + r)^−n), mianownik liczony jako −expm1(−n · log1p(r)); r = 0 albo
     mianownik niestabilny → kapitał / liczba rat. Referencja z definicji (bisekcja na saldzie):
     platforma/tests/test_poprawnosc_kalkulatorow.py. */
  function rataRowna(kapital, r, n) {
    if (!(n > 0)) return NaN;
    if (r === 0) return kapital / n;
    var mianownik = -Math.expm1(-n * Math.log1p(r));
    if (!(mianownik > 0) || !isFinite(mianownik)) return kapital / n;
    return kapital * r / mianownik;
  }

  function skonczone(lista) {
    for (var i = 0; i < lista.length; i++) if (!isFinite(lista[i])) return false;
    return true;
  }

  /* ── Pokazywanie wyniku i błędu (K07, K20) ── */

  function ruch() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    } catch (e) { return "auto"; }
  }

  function przewinDo(el) {
    if (!el || !el.scrollIntoView) return;
    el.style.scrollMarginTop = "72px";
    try { el.scrollIntoView({ block: "start", behavior: ruch() }); } catch (e) { el.scrollIntoView(true); }
  }

  /* Zdarzenie dla zapisu wyniku: `obszar` = element z widocznym wynikiem (tylko `kalk:wynik`). */
  function zdarzenie(nazwa, kontener, obszar) {
    try {
      document.dispatchEvent(new CustomEvent(nazwa, { detail: {
        kalkulator: kontener ? kontener.id : null, obszar: obszar && obszar.id ? obszar.id : null } }));
    } catch (e) { /* stara przeglądarka bez CustomEvent: zapis zostaje nieaktywny */ }
  }

  function czyscOznaczenia(kontener) {
    if (!kontener) return;
    var pola = kontener.querySelectorAll("input, select");
    for (var i = 0; i < pola.length; i++) {
      pola[i].removeAttribute("aria-invalid");
      pola[i].removeAttribute("aria-describedby");
    }
  }

  /* o: {komunikat, bledy: [{pole, tekst}], wynik, status, kontener} */
  function pokazBlad(o) {
    var k = o.komunikat, pierwsze = null;
    czyscOznaczenia(o.kontener);
    if (o.wynik) o.wynik.style.display = "none";
    if (o.status) o.status.textContent = "";
    if (k) {
      k.textContent = "";
      for (var i = 0; i < o.bledy.length; i++) {
        if (i) k.appendChild(document.createElement("br"));
        k.appendChild(document.createTextNode(o.bledy[i].tekst));
      }
      if (!k.getAttribute("role")) k.setAttribute("role", "alert");
      k.style.display = "block";
    }
    for (var j = 0; j < o.bledy.length; j++) {
      var el = o.bledy[j].pole && document.getElementById(o.bledy[j].pole);
      if (!el) continue;
      el.setAttribute("aria-invalid", "true");
      if (k && k.id) el.setAttribute("aria-describedby", k.id);
      if (!pierwsze) pierwsze = el;
    }
    if (k) przewinDo(k);
    if (pierwsze) {
      try { pierwsze.focus({ preventScroll: true }); } catch (e) { pierwsze.focus(); }
    }
    zdarzenie("kalk:blad", o.kontener);
  }

  /* o: {wynik, status, tekst, komunikat, kontener} */
  function pokazWynik(o) {
    czyscOznaczenia(o.kontener);
    if (o.komunikat) o.komunikat.style.display = "none";
    o.wynik.style.display = "block";
    if (o.status) o.status.textContent = o.tekst || "";
    przewinDo(o.wynik);
    zdarzenie("kalk:wynik", o.kontener, o.wynik);
  }

  /* o: {pola: [id…], wynik, komunikat, status, kontener, fokus: id} */
  function wyczysc(o) {
    for (var i = 0; i < o.pola.length; i++) {
      var el = document.getElementById(o.pola[i]);
      if (el) el.value = "";
    }
    czyscOznaczenia(o.kontener);
    if (o.wynik) o.wynik.style.display = "none";
    if (o.komunikat) o.komunikat.style.display = "none";
    if (o.status) o.status.textContent = "";
    zdarzenie("kalk:wyczysc", o.kontener);
    var f = o.fokus && document.getElementById(o.fokus);
    if (f) f.focus();
  }

  window.Kalk = {
    NBSP: NBSP, odczyt: odczyt, komunikat: komunikat, pole: pole,
    kwota: kwota, zl: zl, procent: procent, procentKrotko: procentKrotko, liczbaTekst: liczbaTekst,
    odmiana: odmiana, rataRowna: rataRowna, skonczone: skonczone,
    przewinDo: przewinDo, zdarzenie: zdarzenie, pokazBlad: pokazBlad, pokazWynik: pokazWynik, wyczysc: wyczysc
  };
})();

</script>

<script>
(function () {
// POCZATEK LICZENIA
// Sumy stóp do 10 miejsc: usuwamy wyłącznie szum IEEE 754, poniżej precyzji pól (5 miejsc).
function stopaK1(x) { return Math.round(x * 1e10) / 1e10; }
function liczK1(saldo, n, w1, m1, w2, m2, spread, rodzaj) {
    const o1 = stopaK1(w1 + m1), o2 = stopaK1(w2 + m2 + spread);
    if (!Kalk.skonczone([saldo, n, o1, o2]) || saldo <= 0 || !Number.isInteger(n) || n < 1 ||
        Math.min(o1, o2) < 0 || !['rowne', 'malejace'].includes(rodzaj)) return null;
    const rata = (opr, k) => rodzaj === 'rowne' ? Kalk.rataRowna(saldo, opr / 1200, n) :
        saldo / n + (saldo - k * saldo / n) * opr / 1200;
    const odsetki = opr => rodzaj === 'rowne' ? rata(opr, 0) * n - saldo : saldo * opr / 1200 * (n + 1) / 2;
    let roznica12 = 0;
    for (let k = 0; k < Math.min(12, n); k++) {
        roznica12 += rata(o2, k) - rata(o1, k);
    }
    const przed = rata(o1, 0), po = rata(o2, 0);
    return {rata_przed: przed, rata_po: po, roznica_raty: (Math.round(Number(po.toFixed(2)) * 100) - Math.round(Number(przed.toFixed(2)) * 100)) / 100,
        roznica_12: roznica12, opr_przed: o1, opr_po: o2, odsetki_przed: odsetki(o1), odsetki_po: odsetki(o2),
        marza: stopaK1(o1 - w2 - spread), stres1: rata(o2 + 1, 0), stres2: rata(o2 + 2, 0)};
}
// KONIEC LICZENIA

const POLA_K1 = {"k1-saldo": {"co": "kapitał pozostały do spłaty", "jednostka": "zł", "min": 1000, "max": 5000000, "przyklad": "480 000", "zakres": "Wpisz kapitał pozostały do spłaty od 1000 do 5000000"}, "k1-raty": {"co": "liczbę pozostałych rat", "jednostka": "mies.", "min": 1, "max": 420, "przyklad": "264", "zakres": "Wpisz liczbę pozostałych rat od 1 do 420", "calkowita": true, "pelne": "miesiące"}, "k1-wsk-przed": {"co": "wskaźnik stosowany dziś", "jednostka": "%", "min": -2, "max": 15, "przyklad": "3,89", "zakres": "Wpisz wskaźnik stosowany dziś od -2 do 15", "maksMiejsc": 5, "miejsca": "Wpisz wskaźnik stosowany dziś – najwyżej 5 miejsc po przecinku"}, "k1-marza-przed": {"co": "marżę dziś", "jednostka": "%", "min": 0, "max": 10, "przyklad": "2,00", "zakres": "Wpisz marżę dziś od 0 do 10", "maksMiejsc": 2, "miejsca": "Wpisz marżę dziś – najwyżej 2 miejsca po przecinku"}, "k1-wsk-po": {"co": "nowy wskaźnik z aneksu", "jednostka": "%", "min": -2, "max": 15, "przyklad": "3,54", "zakres": "Wpisz nowy wskaźnik z aneksu od -2 do 15", "maksMiejsc": 5, "miejsca": "Wpisz nowy wskaźnik z aneksu – najwyżej 5 miejsc po przecinku"}, "k1-marza-po": {"co": "marżę po zmianie", "jednostka": "%", "min": 0, "max": 10, "przyklad": "2,00", "zakres": "Wpisz marżę po zmianie od 0 do 10", "maksMiejsc": 2, "miejsca": "Wpisz marżę po zmianie – najwyżej 2 miejsca po przecinku"}, "k1-spread": {"co": "spread korygujący", "jednostka": "%", "min": -2, "max": 3, "przyklad": "0", "zakres": "Wpisz spread korygujący od -2 do 3", "maksMiejsc": 5, "miejsca": "Wpisz spread korygujący – najwyżej 5 miejsc po przecinku", "pusteJakoZero": true}};
const ETYKIETY_K1 = {"rata_po": "Modelowa rata za pełny miesiąc po zmianie", "rata_przed": "Modelowa rata dziś", "roznica_raty": "Różnica rat: po zmianie minus dziś", "roznica_12": "Suma różnic: po zmianie minus dziś", "opr_przed": "Oprocentowanie dziś", "opr_po": "Oprocentowanie po zmianie", "odsetki_przed": "Odsetki do końca przy dzisiejszym wskaźniku", "odsetki_po": "Odsetki do końca przy nowym wskaźniku", "marza": "Marża zrównująca oprocentowanie", "stres1": "Rata po zmianie przy wskaźniku wyższym o 1 p.p.", "stres2": "Rata po zmianie przy wskaźniku wyższym o 2 p.p."};
function opcjeK1() {
    return {kontener: document.getElementById('kalk-k1'), wynik: document.getElementById('k1-wyniki'),
        komunikat: document.getElementById('k1-blad'), status: document.getElementById('k1-status')};
}
function obliczK1() {
    const bledy = [], wartosci = Object.keys(POLA_K1).map(id => Kalk.pole(id, POLA_K1[id], bledy));
    const o = opcjeK1();
    const rodzaj = document.getElementById('k1-rodzaj').value;
    document.querySelectorAll('[name="k1-rodzaj-wybor"]').forEach(el => { el.checked = el.value === rodzaj; });
    // Przywrócony aneks z inną marżą zachowuje tę wartość także przy poprawianiu błędnego pola.
    const mp = document.getElementById('k1-marza-po').value;
    if (mp && mp !== document.getElementById('k1-marza-przed').value) o.kontener.dataset.marzaReczna = '1';
    if (bledy.length) { Kalk.pokazBlad({...o, bledy}); return; }
    const w = liczK1(...wartosci, rodzaj);
    if (!w) { Kalk.pokazBlad({...o, bledy: [{pole: wartosci[2] + wartosci[3] < 0 ? 'k1-wsk-przed' : 'k1-wsk-po', tekst: 'Oprocentowanie wyszło ujemne – sprawdź wskaźnik, spread i marżę'}]}); return; }
    for (const key of Object.keys(ETYKIETY_K1)) {
        let tekst = key.startsWith('opr_') ? Kalk.procent(w[key], 5) + '%' : Kalk.zl(Math.abs(w[key]) < .005 ? 0 : w[key], true);
        if (key === 'marza') tekst = w.marza < 0 || w.marza > 10 ? (w.marza < 0 ? 'Zawsze wyższe' : 'Zawsze niższe') + ' (marża poza 0–10 p.p.)' : Kalk.procent(w.marza, 5) + ' p.p.';
        if (key.startsWith('roznica') && w[key] >= .005) tekst = '+' + tekst;
        document.getElementById('k1-' + key).textContent = tekst;
    }
    document.getElementById('k1-horyzont').textContent = (wartosci[1] === 1 ? 'W najbliższej racie: ' : 'W ciągu najbliższych ' + Math.min(12, wartosci[1]) + ' rat: ') + (w.roznica_12 >= .005 ? '+' : '') + Kalk.zl(Math.abs(w.roznica_12) < .005 ? 0 : w.roznica_12, true) + '. Kwota po zmianie to modelowa rata za pełny miesiąc, nie najbliższa płatność z harmonogramu.';
    document.getElementById('k1-interpretacja').textContent = w.marza < 0 || w.marza > 10 ?
        'W dopuszczalnym zakresie marży (0–10 p.p.) oprocentowania nie da się zrównać – po zmianie będzie ono zawsze ' + (w.marza < 0 ? 'wyższe.' : 'niższe.') :
        'Przy marży ' + Kalk.procent(w.marza, 5) + ' p.p. oprocentowanie byłoby dziś identyczne. Nie oznacza to, że cała oferta jest równie dobra.';
    Kalk.pokazWynik({...o, tekst: 'Modelowa rata po zmianie: ' + Kalk.zl(w.rata_po, true)});
}
function wyczyscK1() {
    Kalk.wyczysc({...opcjeK1(), pola: Object.keys(POLA_K1), fokus: 'k1-saldo'});
    opcjeK1().kontener.dataset.marzaReczna = '';
    document.getElementById('k1-rodzaj').value = 'rowne';
    document.querySelectorAll('[name="k1-rodzaj-wybor"]').forEach(el => { el.checked = el.value === 'rowne'; });
}
function inicjujK1() {
    const root = document.getElementById('kalk-k1');
    if (!root || root.__kalkPolstrGotowy) return;
    root.__kalkPolstrGotowy = true;
    root.addEventListener('input', function () {
    opcjeK1().wynik.style.display = 'none';
    Kalk.zdarzenie('kalk:wyczysc', opcjeK1().kontener);
});
root.dataset.marzaReczna = '';
document.getElementById('k1-marza-po').addEventListener('input', function () { opcjeK1().kontener.dataset.marzaReczna = '1'; });
document.getElementById('k1-marza-przed').addEventListener('input', function () {
    if (!opcjeK1().kontener.dataset.marzaReczna) document.getElementById('k1-marza-po').value = this.value;
});
document.querySelectorAll('[name="k1-rodzaj-wybor"]').forEach(el => el.addEventListener('change', function () {
    document.getElementById('k1-rodzaj').value = this.value;
    opcjeK1().wynik.style.display = 'none';
    Kalk.zdarzenie('kalk:wyczysc', opcjeK1().kontener);
}));
}
// ClientRouter może ponownie wstawić nowy formularz do tego samego dokumentu.
window.obliczK1 = obliczK1;
window.wyczyscK1 = wyczyscK1;
window.POLA_K1 = POLA_K1;
if (window.inicjujPolstrK1) document.removeEventListener('astro:page-load', window.inicjujPolstrK1);
window.inicjujPolstrK1 = inicjujK1;
document.addEventListener('astro:page-load', inicjujK1);
inicjujK1();
})();
</script>
<!-- KONIEC KALKULATORA POLSTR K1 -->

<div class="polstr-kalk"><a href="https://platforma.pozytywniezbudowani.pl/narzedzia/kalkulator-zmiany-wskaznika">Wersja w Centrum z zapisem wyników (po zalogowaniu)</a></div>

<h2>Przykład: aneks z marżą wyższą o 0,30 punktu</h2>

<p>Przykład jest taki, jak w artykule o reformie. Do spłaty zostało 480 000 zł i 22 lata, czyli 264 raty równe, a kredyt jest na WIBOR 3M z marżą 2,00 punktu procentowego. Bank proponuje POLSTR 1M Stopa Składana z marżą 2,30, bez spreadu. Zamiast wartości z harmonogramu i z aneksu wpisałem notowania z GPW Benchmark: WIBOR 3M 3,89% z 19 października 2026 roku i POLSTR 1M Stopa Składana 3,53946% z 20 października 2026 roku. Liczby służą do pokazania mechanizmu i nie pochodzą z oferty żadnego banku.</p>

<table>
<tr><th>Co pokazuje kalkulator</th><th>Wynik</th></tr>
<tr><td>oprocentowanie dziś i po zmianie</td><td>5,89000% i 5,83946%</td></tr>
<tr><td>rata dziś</td><td>3 247,63 zł</td></tr>
<tr><td>modelowa rata za pełny miesiąc po zmianie</td><td>3 233,38 zł</td></tr>
<tr><td>różnica rat</td><td>14,25 zł mniej</td></tr>
<tr><td>suma różnic w ciągu najbliższych 12 rat</td><td>171,02 zł mniej</td></tr>
<tr><td>odsetki do końca kredytu przy dzisiejszym wskaźniku</td><td>377 374,08 zł</td></tr>
<tr><td>odsetki do końca kredytu przy nowym wskaźniku</td><td>373 611,56 zł</td></tr>
<tr><td>marża zrównująca oprocentowanie</td><td>2,35054 punktu</td></tr>
<tr><td>rata po zmianie przy wskaźniku wyższym o 1 punkt</td><td>3 521,13 zł</td></tr>
<tr><td>rata po zmianie przy wskaźniku wyższym o 2 punkty</td><td>3 820,55 zł</td></tr>
</table>

<p>Różnice kalkulator pokazuje ze znakiem, a minus przed kwotą znaczy, że po zmianie płacicie mniej. Rata spada, choć marża w aneksie jest wyższa, bo przy wartościach z tego przykładu POLSTR 1M Stopa Składana jest niższy od WIBOR 3M o 0,35054 punktu, a marża rośnie tylko o 0,30, więc całe oprocentowanie spada o 0,05054 punktu.</p>

<h2>Jak czytać wynik</h2>

<p><strong>Marża zrównująca oprocentowanie</strong> to liczba, z którą warto iść na rozmowę o aneksie. Czy wiecie, że z bankiem można negocjować? Gdyby marża po zmianie wynosiła 2,35054 punktu, oprocentowanie byłoby w tym przykładzie dokładnie takie, jakie jest dziś. Bank proponuje 2,30, czyli mniej, i dlatego rata spada. Gdyby zaproponował 2,40, oprocentowanie po zmianie byłoby wyższe niż dziś, choć w aneksie podwyżka marży o 0,40 punktu wyglądałaby prawie tak samo jak o 0,30. W przypadku kredytu hipotecznego nawet niewielkie obniżenie prowizji lub marży przekłada się na duże oszczędności – różnica 0,05054 punktu z tego przykładu to 3 762,52 zł odsetek do końca kredytu, o ile wskaźniki się nie zmienią. Marża zrównująca jest liczona dla wartości z dnia porównania; zależy od różnicy między wskaźnikami, a gdy ta różnica się zmieni, zmieni się i ona. Nie znaczy też, że przy takiej marży cała oferta jest równie dobra, bo opłaty, ubezpieczenia i warunki nadpłaty trzeba porównać w aneksie osobno.</p>

<p><strong>Rata po zmianie</strong> to modelowa rata za pełny miesiąc. Pierwsza płatność po aneksie może być inna, ponieważ bank liczy odsetki za rzeczywistą liczbę dni, pierwszy okres po zmianie bywa niepełny, a raty bank zaokrągla do grosza. Do porównania raty przed zmianą i po niej wystarczy rata modelowa, natomiast kwotę do zapłaty sprawdźcie w nowym harmonogramie – umowa kredytu hipotecznego musi przewidywać, że o zmianie wskaźnika dowiecie się najpóźniej razem z nim.</p>

<p><strong>Suma różnic w ciągu 12 rat</strong> to różnica rat dodana miesiąc po miesiącu. Przy ratach równych wychodzi prawie dwanaście razy różnica jednej raty, ale przy malejących już nie, bo każda kolejna rata jest inna. Gdyby kredyt z przykładu był spłacany w ratach malejących, pierwsza rata spadłaby z 4 174,18 zł do 4 153,97 zł, czyli o 20,21 zł, a w ciągu roku różnica wyniosłaby 237,54 zł, nie 242,52 zł, które wyszłyby z prostego mnożenia.</p>

<p><strong>Odsetki do końca kredytu</strong> kalkulator liczy tak, jakby oba wskaźniki stały w miejscu przez wszystkie pozostałe raty. Jest to porównanie dzisiejszych warunków. Prognozą nie jest, bo wskaźniki będą się zmieniać, a razem z nimi odsetki, które zapłacicie.</p>

<p><strong>Rata przy wskaźniku wyższym o 1 i 2 punkty</strong> przypomina, że aneks zmienia wskaźnik, ale ryzyko zmiennej stopy zostaje po Waszej stronie. W przykładzie rata po zmianie rośnie przy wskaźniku wyższym o 2 punkty do 3 820,55 zł, czyli o 587,17 zł miesięcznie. Jeżeli taki wzrost rozłożyłby Wasz domowy budżet, nie zakładajcie sobie pętli na szyję. Zapytajcie bank, czy przy okazji aneksu możecie przejść na stałą lub okresowo stałą stopę, i porównajcie obie drogi w <a href="/blog/stala-czy-zmienna-stopa-kalkulator/">kalkulatorze stałej i zmiennej stopy</a>. Jako kwotę wpiszcie tam kapitał, który został do spłaty, a jako okres liczbę lat, które zostały do końca kredytu.</p>

<h2>Gdy aneks dodaje spread</h2>

<p>Część aneksów zostawia marżę bez zmian i dodaje do nowego wskaźnika spread korygujący. Gdyby w przykładzie marża została na poziomie 2,00, a spread wynosił 0,35 punktu, oprocentowanie po zmianie wyniosłoby 5,88946%, a rata spadłaby z 3 247,63 zł do 3 247,48 zł, czyli o 0,15 zł, co przez 12 rat daje 1,83 zł. Spread 0,35 wyrównuje więc różnicę wskaźników prawie co do grosza, a dokładnie wyrównałby ją spread 0,35054 punktu. Taki aneks zmienia sposób, w jaki bank liczy oprocentowanie, ale przy wartościach z dnia porównania nie zmienia jego wysokości. Zapytajcie, jak bank policzył spread i czy zostanie on taki sam do końca kredytu.</p>

<h2>Czego kalkulator nie policzy</h2>

<ul>
<li><strong>Opłat, ubezpieczeń, produktów dodatkowych i kosztu samego aneksu.</strong> Przeczytajcie, czy aneks zmienia coś poza oprocentowaniem, na przykład zasady nadpłaty, bo tego żaden kalkulator za Was nie sprawdzi.</li>
<li><strong>Okresowo stałej stopy w trakcie okresu stałego.</strong> Do jego końca wskaźnik nie wpływa na Wasze oprocentowanie, więc ten rachunek będzie Was dotyczył dopiero przy ustalaniu kolejnego okresu.</li>
<li><strong>Innej konstrukcji oprocentowania</strong> niż wartość wskaźnika znana z góry na okres odsetkowy, na przykład średniej z okresu lub wskaźnika ustalanego z dołu. W takiej sytuacji poproście bank o rozpisanie raty.</li>
<li><strong>Okresu budowy.</strong> Kalkulator liczy kredyt, który bank wypłacił w całości. Jeśli pieniądze dostajecie w transzach, pełna rata zacznie się po karencji, a odsetki w karencji policzycie ze wzoru z tekstu o <a href="/blog/kalkulator-transz-kredytu-na-budowe-domu/">transzach kredytu na budowę domu</a>.</li>
<li><strong>Kwoty co do grosza z harmonogramu.</strong> Kalkulator liczy miesiąc jako jedną dwunastą roku, a bank liczy odsetki za rzeczywiste dni i zaokrągla raty, dlatego kwoty mogą się nieco różnić.</li>
</ul>

<p>Z takim wynikiem idziecie do banku z rachunkiem, który zrobiliście sami, a nie tylko z tym, który przyszedł razem z aneksem. Po co być aż tak mocno na czyjejś łasce? Jeśli aneks się nie opłaca, możecie go negocjować lub nie podpisywać, a co się wtedy stanie, wynika z Waszej umowy i obowiązujących przepisów.</p>

<p><em>Kalkulator i przykłady mają charakter informacyjny i nie są poradą kredytową ani prawną. Wartości wskaźników wpisujecie sami, bo kalkulator ich nie pobiera. Notowania w przykładzie pochodzą ze strony GPW Benchmark z 19 i 20 października 2026 roku. Przed podpisaniem aneksu sprawdźcie warunki w swoim banku.</em></p>
