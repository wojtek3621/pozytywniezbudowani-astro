---
publishDate: 2026-10-22T07:00:00
order: 13
updateDate: 2026-10-22T07:00:00
title: 'Stała czy zmienna stopa kredytu – kalkulator rat i odsetek'
excerpt: 'Ile kosztuje stała stopa w porównaniu ze zmienną w Waszym scenariuszu i przy jakiej zmianie wskaźnika obie wychodzą tak samo. Wpiszcie ofertę banku, a kalkulator policzy raty i odsetki w okresie stałej stopy.'
image: '~/assets/images/blog/stala-czy-zmienna-stopa-kalkulator.jpeg'
category: 'Blog'
tags:
  - 'Finanse i kredyt'
author: 'Wojciech Tracichleb'
metadata:
  canonical: 'https://pozytywniezbudowani.pl/blog/stala-czy-zmienna-stopa-kalkulator/'
  title: 'Stałe czy zmienne oprocentowanie kredytu – kalkulator'
  description: 'Porównajcie stałą, okresowo stałą i zmienną stopę na liczbach z oferty: raty, suma odsetek w okresie stałej stopy, próg zmiany wskaźnika i tabela scenariuszy. Przykład z jawnymi założeniami.'
  robots:
    index: true
    follow: true
---

<!-- Powiazane: platforma/content/html/kalkulator-stalej-i-zmiennej-stopy.html (repo AIOS), builds/2026-10-20-kalk-polstr/raport.md, builds/2026-10-21-kalk-polstr-wpisy/raport.md -->

<p>Do nowego domu przyzwyczaicie się szybciej, niż dziś myślicie. To, co jednak nigdy nie przestaje robić wrażenia, to rata kredytu hipotecznego. Dobitnie pokazało nam to podniesienie stóp procentowych po pandemii – raty kredytów hipotecznych potrafiły w niektórych przypadkach urosnąć ponaddwukrotnie. Dlatego wybór między stałą, okresowo stałą a zmienną stopą jest ważniejszy niż to, czy zmienna opiera się na WIBOR, czy na POLSTR. Ten kalkulator porównuje obie formuły na liczbach z Waszej oferty: pokazuje raty, sumę odsetek w okresie stałej stopy oraz to, przy jakiej zmianie wskaźnika obie kosztują tyle samo.</p>

<p>Od razu uczciwie: nie jestem doradcą kredytowym. Buduję domy od 2013 roku, a sam jako inwestor budowałem własny, więc na wybór stopy patrzę od strony domowego budżetu na najbliższe lata. Kalkulator nie wybierze za Was formuły, bo nikt nie zna przyszłych stóp procentowych. Pokaże za to, ile w Waszej ofercie kosztuje stała rata oraz przy jakim wzroście wskaźnika zmienna przestaje być tańsza.</p>

<p>Co reforma WIBOR zmienia w nowych umowach i dlaczego banki obok kredytów na POLSTR mają oferować stałą lub okresowo stałą stopę, opisałem w tekście <a href="/blog/polstr-zamiast-wibor/">POLSTR zamiast WIBOR – co to znaczy dla kredytu na budowę domu</a>. Jeśli już spłacacie kredyt i bank proponuje aneks na nowy wskaźnik, ratę przed zmianą i po niej policzycie w <a href="/blog/kalkulator-raty-po-zmianie-wibor-na-polstr/">kalkulatorze raty po zmianie WIBOR na POLSTR</a>.</p>

<h2>Skąd wziąć liczby do kalkulatora</h2>

<p>Kalkulator nie pobiera notowań ani ofert, więc wszystkie wartości wpisujecie sami z oferty banku, najlepiej z dwóch symulacji przygotowanych na identyczną kwotę i okres.</p>

<ul>
<li><strong>Kwota kredytu</strong> – cała kwota, którą bank już wypłacił. Kalkulator liczy fazę spłaty, więc przy kredycie na budowę wpiszcie kwotę po ostatniej transzy, a okres budowy i karencję policzcie osobno, o czym piszę niżej.</li>
<li><strong>Okres kredytu</strong> – w pełnych latach, liczony od początku spłaty. Jeśli karencja jest wliczona w okres kredytu, wpiszcie liczbę lat, które zostaną po niej, a nie cały okres z umowy, bo inaczej kalkulator pokaże ratę zaniżoną: w przykładzie z artykułu o reformie pierwsza pełna rata po 18 miesiącach karencji wynosi 3 809,10 zł, a liczona na pełne 25 lat – 3 698,68 zł. Kalkulator przyjmuje tylko pełne lata, więc przy niepełnym roku wynik będzie przybliżony. Liczy też wyłącznie raty równe.</li>
<li><strong>Wskaźnik dziś i marża przy zmiennej</strong> – wartość wskaźnika z oferty zmiennej stopy, na przykład POLSTR 1M Stopa Składana, i marża, którą bank podał w tej ofercie.</li>
<li><strong>Oprocentowanie stałe z oferty</strong> – całe oprocentowanie, a nie sama marża, bo przy stałej stopie bank podaje jedną liczbę, która nie zależy od wskaźnika.</li>
<li><strong>Na ile lat stała</strong> – długość okresu stałej stopy z oferty. Kalkulator przyjmuje od 5 lat, bo tyle wynosi minimum według Rekomendacji S, do całego okresu kredytu, gdy stała obowiązuje do końca spłaty.</li>
<li><strong>Scenariusz</strong> – o ile punktów procentowych zmieni się wskaźnik i od którego miesiąca. Wpiszcie taki, przy którym chcecie zobaczyć swoją ratę, a typowe scenariusze kalkulator i tak pokaże w tabeli pod wynikiem.</li>
</ul>

<!-- POCZĄTEK KALKULATORA POLSTR K2 -->
<div id="kalk-k2" class="polstr-kalk">
<h2>Stała, okresowo stała czy zmienna – raty równe</h2>
<p>Wartości wpisz z harmonogramu, zawiadomienia lub oferty banku. Notowania i opis wskaźników znajdziesz u <a href="https://gpwbenchmark.pl/" target="_blank" rel="noopener">administratora GPW Benchmark</a>. Przykłady w polach nie są bieżącymi notowaniami.</p>

<div id="k2-blad" role="alert" style="display:none"></div>
<div class="polstr-pola"><div><label for="k2-kwota">Kwota kredytu wypłacona w całości (zł)</label><input id="k2-kwota" type="text" inputmode="decimal" placeholder="np. 600 000"><small>Ten kalkulator obejmuje fazę spłaty, po wypłacie całego kapitału.</small></div><div><label for="k2-lata">Okres kredytu (lat)</label><input id="k2-lata" type="text" inputmode="numeric" placeholder="np. 25"><small></small></div><div><label for="k2-wsk">Wskaźnik dziś, np. POLSTR 1M Stopa Składana (%)</label><input id="k2-wsk" type="text" inputmode="decimal" placeholder="np. 3,54"><small></small></div><div><label for="k2-marza">Marża przy zmiennej (p.p.)</label><input id="k2-marza" type="text" inputmode="decimal" placeholder="np. 2,00"><small></small></div><div><label for="k2-stala">Oprocentowanie stałe z oferty (%)</label><input id="k2-stala" type="text" inputmode="decimal" placeholder="np. 6,04"><small></small></div><div><label for="k2-lata-stalej">Na ile lat stała stopa (lat)</label><input id="k2-lata-stalej" type="text" inputmode="numeric" placeholder="np. 5"><small>Od 5 lat (minimum z Rekomendacji S) do całego okresu kredytu.</small></div><div><label for="k2-delta">Scenariusz: wskaźnik zmieni się o (p.p.)</label><input id="k2-delta" type="text" inputmode="decimal" placeholder="np. 2"><small>Zmiana w punktach procentowych; znak minus oznacza spadek.</small></div><div><label for="k2-od">Od którego miesiąca (mies.)</label><input id="k2-od" type="text" inputmode="numeric" placeholder="np. 13"><small></small></div></div>
<p>Kalkulator liczy wyłącznie raty równe.</p>
<div class="polstr-akcje"><button id="k2-btn-oblicz" type="button" onclick="obliczK2()">Oblicz</button><button id="k2-btn-wyczysc" type="button" onclick="wyczyscK2()">Wyczyść</button></div>
<div id="k2-status" role="status" class="polstr-sr"></div>
<div id="k2-wyniki" style="display:none">
<p id="k2-horyzont"></p><div class="polstr-wynik"><div class="polstr-karta"><span>Rata przy stałej stopie</span><strong id="k2-rata_stala" data-etykieta="Rata przy stałej stopie">–</strong></div><div class="polstr-karta"><span>Rata zmienna przy dzisiejszym wskaźniku, bez zmiany</span><strong id="k2-rata_bazowa" data-etykieta="Rata zmienna przy dzisiejszym wskaźniku, bez zmiany">–</strong></div><div class="polstr-karta"><span>Pierwsza rata w Twoim scenariuszu</span><strong id="k2-rata_start" data-etykieta="Pierwsza rata w Twoim scenariuszu">–</strong></div><div class="polstr-karta"><span>Najwyższa rata w Twoim scenariuszu</span><strong id="k2-rata_max" data-etykieta="Najwyższa rata w Twoim scenariuszu">–</strong></div><div class="polstr-karta"><span>Suma odsetek stałej w horyzoncie</span><strong id="k2-odsetki_stala" data-etykieta="Suma odsetek stałej w horyzoncie">–</strong></div><div class="polstr-karta"><span>Suma odsetek zmiennej w horyzoncie</span><strong id="k2-odsetki_zmienna" data-etykieta="Suma odsetek zmiennej w horyzoncie">–</strong></div><div class="polstr-karta"><span>Różnica odsetek: zmienna minus stała</span><strong id="k2-roznica_odsetek" data-etykieta="Różnica odsetek: zmienna minus stała">–</strong></div><div class="polstr-karta"><span>Suma wpłat przy stałej stopie</span><strong id="k2-wplaty_stala" data-etykieta="Suma wpłat przy stałej stopie">–</strong></div><div class="polstr-karta"><span>Suma wpłat przy zmiennej stopie</span><strong id="k2-wplaty_zmienna" data-etykieta="Suma wpłat przy zmiennej stopie">–</strong></div><div class="polstr-karta"><span>Saldo po horyzoncie przy stałej stopie</span><strong id="k2-saldo_stala" data-etykieta="Saldo po horyzoncie przy stałej stopie">–</strong></div><div class="polstr-karta"><span>Saldo po horyzoncie przy zmiennej stopie</span><strong id="k2-saldo_zmienna" data-etykieta="Saldo po horyzoncie przy zmiennej stopie">–</strong></div><div class="polstr-karta"><span>Próg zmiany wskaźnika</span><strong id="k2-prog" data-etykieta="Próg zmiany wskaźnika">–</strong></div></div><p id="k2-interpretacja"></p>
<div class="polstr-tabela"><table><caption>Scenariusze zmiany wskaźnika – koszt to suma odsetek</caption><thead><tr><th>Scenariusz</th><th>Odsetki stałej</th><th>Odsetki zmiennej</th><th>Różnica odsetek w tym scenariuszu</th></tr></thead><tbody id="k2-scenariusze"></tbody></table></div><p>Kalkulator liczy raty równe. Przy ratach malejących płatności, saldo i koszt będą inne.</p>
<p>Różnicę odsetek liczymy przed zaokrągleniem. Dlatego może różnić się o grosz od różnicy pokazanych kwot.</p>
<p>Kalkulator porównuje samo oprocentowanie w okresie stałej stopy. Nie wie, jakie oprocentowanie będzie po jego końcu. Nie uwzględnia prowizji, ubezpieczeń ani wartości pieniądza w czasie.</p>
<details><summary>Jeśli planujesz nadpłatę</summary><p>Ten kalkulator nie uwzględnia nadpłaty. Planujesz dużą nadpłatę, np. ze sprzedaży mieszkania? Poproś bank o harmonogramy obu ofert z nadpłatą w tym samym miesiącu. Jeśli umowa przewiduje rekompensatę: przy stałej stopie bank może ją pobrać w okresie stałym, nie więcej niż swoje koszty związane z wcześniejszą spłatą; przy zmiennej tylko przez 36 miesięcy od zawarcia umowy, nie więcej niż odsetki od nadpłaty za rok (za krótszy czas, gdy do końca umowy został mniej niż rok), nie więcej niż 3% nadpłaty i nie więcej niż koszty banku. Dotyczy umów od 22.07.2017. Gdy umowa już obowiązuje, bank na Twój wniosek poda koszty wcześniejszej spłaty w 7 dni roboczych.</p></details>
<details><summary>Zdolność kredytowa</summary><p id="k2-zdolnosc"></p></details><p>Liczymy w uproszczeniu – miesiąc to 1/12 roku. Bank liczy odsetki za rzeczywiste dni i zaokrągla raty, więc kwoty w harmonogramie mogą się nieco różnić.</p>
<p>Kalkulator liczy matematykę raty i nie sprawdza limitu odsetek maksymalnych – wynik nie przesądza, jakie odsetki bank może pobrać.</p>
<p>Budujesz i bank wypłaca kredyt w transzach? Pełna rata zacznie się po karencji; koszt tej fazy policz ze wzoru we <a href="/blog/kalkulator-transz-kredytu-na-budowe-domu/">wpisie o transzach i karencji</a>.</p>
</div></div>

<style>
.polstr-kalk {max-width:820px;margin:24px auto;padding:24px;border:1px solid #ddd;border-radius:12px;background:#faf9f6;color:#30383c;font-size:16px;line-height:1.55;font-family:inherit;box-sizing:border-box}
.polstr-kalk * {box-sizing:border-box;min-width:0}
.polstr-kalk :is(h2,h3,p,span,strong,label,th,td,caption,summary,li,legend,em,div) {color:#30383c !important}
.polstr-kalk small {color:#555 !important}
.polstr-kalk [role=alert] {color:#9b2020 !important}
.polstr-kalk a {color:#3369b1 !important}
.polstr-kalk h2 {font-size:1.5rem;line-height:1.3;margin:0 0 20px}
.polstr-pola,.polstr-wynik {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.polstr-kalk label {display:block;font-weight:600;margin-bottom:6px}
.polstr-kalk input[type=text] {display:block;width:100%;font-size:18px;padding:12px;border:1px solid #849097;border-radius:6px;background:white;color:#30383c}
.polstr-kalk small {display:block;color:#555;font-size:14px;line-height:1.5;margin-top:6px}
.polstr-kalk fieldset {border:0;padding:0;margin:16px 0}
.polstr-kalk fieldset label {display:inline-block;margin-right:18px}
.polstr-akcje {display:flex;flex-wrap:wrap;gap:12px;margin:24px 0}
.polstr-kalk button {font-size:16px;font-weight:600;padding:12px 18px;border:1px solid #555;border-radius:6px;background:white;color:#30383c;cursor:pointer}
.polstr-kalk button:first-child {background:#c5a44e;color:#202629;border-color:#8a6d2a}
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
function stopaK2(x) { return Math.round(x * 1e10) / 1e10; }
function harmonogramK2(kwota, n, h, baza, delta, od) {
    let saldo = kwota, odsetki = 0, wplaty = 0, start = 0, maks = 0;
    for (let i = 0; i < h; i++) {
        const opr = stopaK2(baza + (i >= od - 1 ? delta : 0));
        const rata = Kalk.rataRowna(saldo, opr / 1200, n - i);
        const odsetka = saldo * opr / 1200;
        saldo += odsetka - rata;
        odsetki += odsetka;
        wplaty += rata;
        if (i === 0) start = rata;
        maks = Math.max(maks, rata);
    }
    return {saldo: Math.abs(saldo) < 1e-7 ? 0 : saldo, odsetki, wplaty, start, maks};
}
function liczK2(kwota, lata, wsk, marza, stala, latSt, delta, od) {
    const n = lata * 12, h = latSt * 12, baza = stopaK2(wsk + marza);
    if (!Kalk.skonczone([kwota, n, h, baza, stala, delta, od]) || kwota <= 0 ||
        !Number.isInteger(n) || !Number.isInteger(h) || !Number.isInteger(od) ||
        h < 1 || h > n || od < 1 || od > h || Math.min(baza, stopaK2(baza + delta), stala) < 0) return null;
    const st = harmonogramK2(kwota, n, h, stala, 0, 1);
    const zm = harmonogramK2(kwota, n, h, baza, delta, od);
    const roznica = zm.odsetki - st.odsetki;
    const f = d => harmonogramK2(kwota, n, h, baza, d, od).odsetki - st.odsetki;
    let lo = Math.max(-5, -baza), hi = 8, prog = null;
    if (f(lo) <= 0 && f(hi) >= 0) {
        for (let j = 0; j < 80; j++) {
            const mid = (lo + hi) / 2;
            if (f(mid) < 0) lo = mid; else hi = mid;
        }
        prog = (lo + hi) / 2;
    }
    return {rata_stala: st.start, rata_bazowa: Kalk.rataRowna(kwota, baza / 1200, n),
        rata_start: zm.start, rata_max: zm.maks, odsetki_stala: st.odsetki, odsetki_zmienna: zm.odsetki,
        roznica_odsetek: roznica, saldo_stala: st.saldo, saldo_zmienna: zm.saldo,
        wplaty_stala: st.wplaty, wplaty_zmienna: zm.wplaty, prog};
}
// KONIEC LICZENIA

const POLA_K2 = {"k2-kwota": {"co": "kwotę kredytu", "jednostka": "zł", "min": 10000, "max": 5000000, "przyklad": "600 000", "zakres": "Wpisz kwotę kredytu od 10000 do 5000000"}, "k2-lata": {"co": "okres kredytu", "jednostka": "lat", "min": 5, "max": 35, "przyklad": "25", "zakres": "Wpisz okres kredytu od 5 do 35", "calkowita": true, "pelne": "lata"}, "k2-wsk": {"co": "wskaźnik dziś", "jednostka": "%", "min": -2, "max": 15, "przyklad": "3,54", "zakres": "Wpisz wskaźnik dziś od -2 do 15", "maksMiejsc": 5, "miejsca": "Wpisz wskaźnik dziś – najwyżej 5 miejsc po przecinku"}, "k2-marza": {"co": "marżę przy zmiennej", "jednostka": "%", "min": 0, "max": 10, "przyklad": "2,00", "zakres": "Wpisz marżę przy zmiennej od 0 do 10", "maksMiejsc": 2, "miejsca": "Wpisz marżę przy zmiennej – najwyżej 2 miejsca po przecinku"}, "k2-stala": {"co": "oprocentowanie stałe z oferty", "jednostka": "%", "min": 0, "max": 20, "przyklad": "6,04", "zakres": "Wpisz oprocentowanie stałe z oferty od 0 do 20", "maksMiejsc": 5, "miejsca": "Wpisz oprocentowanie stałe z oferty – najwyżej 5 miejsc po przecinku"}, "k2-lata-stalej": {"co": "liczbę lat stałej stopy", "jednostka": "lat", "min": 5, "max": 35, "przyklad": "5", "zakres": "Wpisz liczbę lat stałej stopy od 5 do 35", "calkowita": true, "pelne": "lata"}, "k2-delta": {"co": "zmianę wskaźnika", "jednostka": "%", "min": -5, "max": 8, "przyklad": "2", "zakres": "Wpisz zmianę wskaźnika od -5 do 8", "maksMiejsc": 2, "miejsca": "Wpisz zmianę wskaźnika – najwyżej 2 miejsca po przecinku"}, "k2-od": {"co": "miesiąc zmiany", "jednostka": "mies.", "min": 1, "max": 420, "przyklad": "13", "zakres": "Wpisz miesiąc zmiany od 1 do 420", "calkowita": true, "pelne": "miesiące"}};
const ETYKIETY_K2 = {"rata_stala": "Rata przy stałej stopie", "rata_bazowa": "Rata zmienna przy dzisiejszym wskaźniku, bez zmiany", "rata_start": "Pierwsza rata w Twoim scenariuszu", "rata_max": "Najwyższa rata w Twoim scenariuszu", "odsetki_stala": "Suma odsetek stałej w horyzoncie", "odsetki_zmienna": "Suma odsetek zmiennej w horyzoncie", "roznica_odsetek": "Różnica odsetek: zmienna minus stała", "wplaty_stala": "Suma wpłat przy stałej stopie", "wplaty_zmienna": "Suma wpłat przy zmiennej stopie", "saldo_stala": "Saldo po horyzoncie przy stałej stopie", "saldo_zmienna": "Saldo po horyzoncie przy zmiennej stopie", "prog": "Próg zmiany wskaźnika"};
function opcjeK2() {
    return {kontener: document.getElementById('kalk-k2'), wynik: document.getElementById('k2-wyniki'),
        komunikat: document.getElementById('k2-blad'), status: document.getElementById('k2-status')};
}
function obliczK2() {
    const bledy = [], wartosci = Object.keys(POLA_K2).map(id => Kalk.pole(id, POLA_K2[id], bledy));
    const o = opcjeK2();

    if (bledy.length) { Kalk.pokazBlad({...o, bledy}); return; }
    if (wartosci[5] > wartosci[1]) bledy.push({pole: 'k2-lata-stalej', tekst: 'Okres stałej stopy nie może być dłuższy niż okres kredytu'});
    if (wartosci[7] > 12 * wartosci[5]) bledy.push({pole: 'k2-od', tekst: 'Miesiąc zmiany musi mieścić się w okresie stałej stopy'});
    if (bledy.length) { Kalk.pokazBlad({...o, bledy}); return; }
    const w = liczK2(...wartosci);
    if (!w) { Kalk.pokazBlad({...o, bledy: [{pole: wartosci[2] + wartosci[3] < 0 ? 'k2-wsk' : 'k2-delta', tekst: 'Oprocentowanie wyszło ujemne – sprawdź wskaźnik, marżę i zmianę w scenariuszu'}]}); return; }
    for (const key of Object.keys(ETYKIETY_K2)) {
        let tekst = key === 'prog' ? (w.prog === null ? 'Brak progu w badanym zakresie' : Kalk.procent(Math.abs(w.prog) < .000005 ? 0 : w.prog, 5) + ' p.p.') : Kalk.zl(Math.abs(w[key]) < .005 ? 0 : w[key], true);
        if (key === 'roznica_odsetek' && w[key] >= .005) tekst = '+' + tekst;
        document.getElementById('k2-' + key).textContent = tekst;
    }
    const h = wartosci[5] * 12, od = wartosci[7], baza = stopaK2(wartosci[2] + wartosci[3]);
    document.getElementById('k2-horyzont').textContent = 'Porównanie obejmuje ' + h + ' ' + Kalk.odmiana(h, ['miesiąc', 'miesiące', 'miesięcy']) + ' stałej stopy. Rata przy stałej jest bez zmian przez ' + wartosci[5] + ' ' + Kalk.odmiana(wartosci[5], ['rok', 'lata', 'lat']) + '. Koszt w tym okresie to suma odsetek; saldo i wpłaty pokazujemy osobno.';
    let opis;
    if (w.prog === null) opis = 'W badanym zakresie od ' + Kalk.procent(Math.max(-5, -baza), 2) + ' do +8 p.p. nie ma progu – jedna formuła jest zawsze tańsza.';
    else if (Math.abs(w.prog) < .000005) opis = 'Przy dzisiejszym wskaźniku obie formuły kosztują tyle samo; każdy wzrost czyni zmienną droższą, każdy spadek – tańszą.';
    else if (w.prog < 0) opis = 'Stała jest tańsza już przy dzisiejszym wskaźniku. Zmienna kosztowałaby mniej odsetek dopiero, gdyby wskaźnik spadł o więcej niż ' + Kalk.procent(-w.prog, 5) + ' p.p.';
    else opis = 'Jeśli wskaźnik wzrośnie o więcej niż ' + Kalk.procent(w.prog, 5) + ' p.p., zmienna kosztuje więcej odsetek niż stała; przy mniejszym wzroście albo spadku – mniej.';
    document.getElementById('k2-interpretacja').textContent = 'Przy zmianie od miesiąca ' + od + ': ' + opis;
    const tbody = document.getElementById('k2-scenariusze');
    tbody.textContent = '';
    const scenariusze = [['Twój scenariusz', wartosci[6], od], ['Bez zmiany', 0, 1], ['+1 p.p. od 13. miesiąca', 1, 13], ['+2 p.p. od 13. miesiąca', 2, 13], ['−1 p.p. od 13. miesiąca', -1, 13]];
    for (const [nazwa, delta, mies] of scenariusze) {
        const tr = document.createElement('tr');
        const scen = h < mies || stopaK2(baza + delta) < 0 ? null : harmonogramK2(wartosci[0], wartosci[1] * 12, h, baza, delta, mies);
        const roznica = scen ? scen.odsetki - w.odsetki_stala : 0;
        const teksty = [nazwa, Kalk.zl(w.odsetki_stala, true), scen ? Kalk.zl(scen.odsetki, true) :
            (h < mies ? 'Okres stały krótszy niż 13 miesięcy' : 'Scenariusz poza zakresem – oprocentowanie ujemne'),
            scen ? (Math.abs(roznica) < .005 ? 'Tyle samo odsetek' : 'Zmienna ' + (roznica > 0 ? 'drożej' : 'taniej') + ' o ' + Kalk.zl(Math.abs(roznica), true)) : 'Nie liczymy tego scenariusza'];
        for (const tekst of teksty) { const td = document.createElement('td'); td.textContent = tekst; tr.appendChild(td); }
        tbody.appendChild(tr);
    }
    document.getElementById('k2-zdolnosc').textContent = wartosci[5] === wartosci[1] ?
        'Zdolność przy stałej stopie na cały okres poproś bank wyliczyć osobno.' :
        'Według Rekomendacji S minimalny bufor stopy, który bank dolicza przy liczeniu zdolności, zależy od formuły oprocentowania, długości okresu stałego, poziomu stopy referencyjnej NBP i jej zmienności. Przy 5-letniej okresowo stałej jest taki sam jak przy zmiennej tylko wtedy, gdy stopa NBP wynosi co najmniej 2,5% i nie ma dodatku za zmienność; przy dłuższym okresie stałym – mniejszy. To minima; przy pozostałych założeniach jednakowych różnicę robi oprocentowanie. Poproś bank o zdolność dla obu formuł.';
    Kalk.pokazWynik({...o, tekst: 'Rata stała: ' + Kalk.zl(w.rata_stala, true) + '. Różnica odsetek w scenariuszu (zmienna minus stała): ' + document.getElementById('k2-roznica_odsetek').textContent});
}
function wyczyscK2() {
    Kalk.wyczysc({...opcjeK2(), pola: Object.keys(POLA_K2), fokus: 'k2-kwota'});
    
}
function inicjujK2() {
    const root = document.getElementById('kalk-k2');
    if (!root || root.__kalkPolstrGotowy) return;
    root.__kalkPolstrGotowy = true;
    root.addEventListener('input', function () {
    opcjeK2().wynik.style.display = 'none';
    opcjeK2().status.textContent = '';
    Kalk.zdarzenie('kalk:wyczysc', opcjeK2().kontener);
});

}
// ClientRouter może ponownie wstawić nowy formularz do tego samego dokumentu.
window.obliczK2 = obliczK2;
window.wyczyscK2 = wyczyscK2;
window.POLA_K2 = POLA_K2;
if (window.inicjujPolstrK2) document.removeEventListener('astro:page-load', window.inicjujPolstrK2);
window.inicjujPolstrK2 = inicjujK2;
document.addEventListener('astro:page-load', inicjujK2);
inicjujK2();
})();
</script>
<!-- KONIEC KALKULATORA POLSTR K2 -->

<div class="polstr-kalk"><a href="https://platforma.pozytywniezbudowani.pl/narzedzia/kalkulator-stalej-i-zmiennej-stopy">Wersja w Centrum z zapisem wyników (po zalogowaniu)</a></div>

<h2>Przykład: stała na 5 lat, a wskaźnik od drugiego roku wyższy o 2 punkty</h2>

<p>Przykład jest taki, jak w artykule o reformie. Kredyt 600 000 zł na 25 lat w ratach równych, a zmienna stopa to POLSTR 1M Stopa Składana z 20 października 2026 roku, czyli 3,53946%, plus przykładowa marża 2,00 punktu procentowego. Okresowo stałą na 5 lat przyjąłem o 0,50 punktu wyższą od dzisiejszej zmiennej, czyli 6,03946%, i jest to założenie przykładu, bez związku z ofertą konkretnego banku. W scenariuszu wskaźnik od trzynastego miesiąca rośnie o 2 punkty procentowe.</p>

<table>
<tr><th>Co pokazuje kalkulator</th><th>Wynik</th></tr>
<tr><td>rata przy stałej stopie, bez zmian przez 5 lat</td><td>3 880,29 zł</td></tr>
<tr><td>rata zmienna przy dzisiejszym wskaźniku</td><td>3 698,68 zł</td></tr>
<tr><td>najwyższa rata zmienna w scenariuszu</td><td>4 426,86 zł</td></tr>
<tr><td>suma odsetek z 60 rat przy stałej</td><td>172 715,14 zł</td></tr>
<tr><td>suma odsetek z 60 rat przy zmiennej</td><td>204 746,67 zł</td></tr>
<tr><td>różnica odsetek</td><td>zmienna drożej o 32 031,54 zł</td></tr>
<tr><td>do spłaty po 60 ratach przy stałej i przy zmiennej</td><td>539 897,50 zł i 547 873,32 zł</td></tr>
<tr><td>próg zmiany wskaźnika od trzynastego miesiąca</td><td>0,63632 punktu</td></tr>
</table>

<p>A co, jeśli wskaźnik wzrośnie mniej albo spadnie? Pod wynikiem kalkulator pokazuje też tabelę typowych scenariuszy dla tej oferty; odsetki stałej są w każdym wierszu takie same, 172 715,14 zł, bo stała nie zależy od wskaźnika.</p>

<table>
<tr><th>Co się dzieje ze wskaźnikiem</th><th>Odsetki zmiennej z 60 rat</th><th>Zmienna w porównaniu ze stałą</th></tr>
<tr><td>bez zmiany</td><td>157 869,28 zł</td><td>taniej o 14 845,85 zł</td></tr>
<tr><td>od trzynastego miesiąca wyższy o 1 punkt</td><td>181 230,96 zł</td><td>drożej o 8 515,82 zł</td></tr>
<tr><td>od trzynastego miesiąca wyższy o 2 punkty</td><td>204 746,67 zł</td><td>drożej o 32 031,54 zł</td></tr>
<tr><td>od trzynastego miesiąca niższy o 1 punkt</td><td>134 696,54 zł</td><td>taniej o 38 018,59 zł</td></tr>
</table>

<h2>Jak czytać wynik</h2>

<p><strong>Okres porównania</strong> to okres stałej stopy, w przykładzie 60 miesięcy. Kalkulator kończy rachunek w tym miejscu świadomie, bo nikt nie wie, jakie oprocentowanie bank zaproponuje po jego końcu. Koniec okresu stałego nie oznacza automatycznego przejścia na zmienną: strony mogą uzgodnić kolejny okres stały, a jeśli się nie porozumieją, działa formuła wpisana w umowę, dlatego sprawdźcie ją przed podpisaniem.</p>

<p><strong>Koszt formuły</strong> to suma odsetek zapłaconych w okresie stałej stopy, a nie suma wpłat, bo wpłaty zawierają też spłacony kapitał. W przykładzie przy zmiennej przez 5 lat wpłacicie o 24 055,72 zł więcej, niż wpłacilibyście przy stałej, a odsetek zapłacicie więcej o 32 031,54 zł. Skąd ta różnica? Przy zmiennej po wzroście wskaźnika mniejsza część raty idzie na kapitał, więc po 60 ratach do spłaty zostaje 547 873,32 zł zamiast 539 897,50 zł. Suma odsetek uwzględnia już tę różnicę, więc nie dodawajcie do niej różnicy sald drugi raz. Kalkulator liczy różnice przed zaokrągleniem kwot do grosza, dlatego mogą one różnić się o grosz od odejmowania liczb pokazanych na ekranie.</p>

<p><strong>Próg zmiany wskaźnika</strong> mówi, przy jakim wzroście wskaźnika od wskazanego miesiąca obie formuły kosztują w okresie stałym tyle samo odsetek. W przykładzie jest to 0,63632 punktu od trzynastego miesiąca, więc przy większym wzroście zmienna kosztuje więcej niż stała; przy mniejszym albo przy spadku – mniej. Gdyby wskaźnik zmienił się już od pierwszego miesiąca, próg wyniósłby 0,50 punktu, czyli dokładnie tyle, o ile stała jest wyższa od zmiennej. Im później przychodzi zmiana, tym większa musi być, żeby zrównać koszt, bo działa przez mniej miesięcy – w tym przykładzie przy zmianie od 25. miesiąca próg wynosi już 0,86458 punktu.</p>

<p><strong>Najwyższa rata w scenariuszu</strong> to liczba do sprawdzenia domowego budżetu. W przykładzie rata zmienna rośnie z 3 698,68 zł do 4 426,86 zł, czyli o 728,18 zł miesięcznie, podczas gdy rata stała przez 5 lat wynosi 3 880,29 zł. Jeżeli wyższa rata rozłożyłaby Wasz budżet, nie zakładajcie sobie pętli na szyję. Ale stała jest w tym przykładzie na starcie droższa i jest to cena za to, że rata nie wzrośnie przez cały okres stały. W Waszej ofercie różnica między stałą a zmienną może być większa, mniejsza albo odwrotna, dlatego liczcie na własnych liczbach.</p>

<h2>Nadpłata, której kalkulator nie widzi</h2>

<p>W książce radzę brać kredyt na najdłuższy możliwy okres i co miesiąc nadpłacać tyle, na ile Was stać. Sprawdźcie, jaką mielibyście ratę przy kredycie na krótszy czas, i mentalnie uznajcie to za swoje minimum. Przy stałej stopie taka strategia może jednak kosztować, a kalkulator nadpłaty nie uwzględnia. Jeśli umowa przewiduje rekompensatę za wcześniejszą spłatę, bank przy stałej stopie może ją pobrać przez cały okres stałego oprocentowania, w wysokości nie większej niż jego koszty bezpośrednio związane z wcześniejszą spłatą. Przy zmiennej stopie rekompensata jest możliwa tylko przez 36 miesięcy od zawarcia umowy i nie może przekroczyć odsetek od nadpłacanej kwoty za rok, a gdy do końca umowy zostało mniej niż rok – za ten krótszy czas, ani 3% tej kwoty, ani kosztów banku. Te zasady wynikają z ustawy o kredycie hipotecznym i dotyczą umów zawartych od 22 lipca 2017 roku.</p>

<p>Zanim wybierzecie stałą stopę, zapytajcie bank, czy w okresie stałym każda nadpłata kosztuje i jak w tej ofercie liczy się rekompensatę. Planujecie dużą nadpłatę, na przykład po sprzedaży mieszkania? Poproście o harmonogramy obu ofert z nadpłatą w jednym, wskazanym przez Was miesiącu. Gdy umowa już obowiązuje, bank na Wasz wniosek musi w ciągu 7 dni roboczych podać koszty wcześniejszej spłaty. Skracanie okresu i obniżanie raty przy nadpłacie porównuję w tekście o <a href="/blog/nadplata-kredytu-hipotecznego-skrocenie-okresu-czy-nizsza-rata/">nadpłacie kredytu hipotecznego</a>.</p>

<h2>Czego kalkulator nie policzy</h2>

<ul>
<li><strong>Rat malejących.</strong> Przy nich płatności, saldo i koszt będą inne.</li>
<li><strong>Oprocentowania po końcu okresu stałego</strong>, bo nikt go dziś nie zna.</li>
<li><strong>Prowizji, ubezpieczeń i wartości pieniądza w czasie.</strong> Kalkulator porównuje samo oprocentowanie.</li>
<li><strong>Zdolności kredytowej.</strong> Bank liczy ją z buforem na wzrost stóp, który zależy od formuły oprocentowania i długości okresu stałego. Jak to wygląda według Rekomendacji S, opisałem w artykule o reformie. Poproście bank o wyliczenie zdolności dla obu formuł przy identycznej kwocie i okresie.</li>
<li><strong>Okresu budowy.</strong> Przy kredycie budowlanym okres stały może liczyć się od uruchomienia kredytu, a nie od podpisania umowy, więc zapytajcie o to bank. Odsetki w karencji policzycie ze wzoru z tekstu o <a href="/blog/kalkulator-transz-kredytu-na-budowe-domu/">transzach kredytu na budowę domu</a>, a pełna rata zacznie się po karencji.</li>
<li><strong>Kwoty co do grosza z harmonogramu.</strong> Kalkulator liczy miesiąc jako jedną dwunastą roku, a bank liczy odsetki za rzeczywiste dni.</li>
</ul>

<p><em>Kalkulator i przykłady mają charakter informacyjny i nie są poradą kredytową ani prawną. Wartości wskaźników i ofert wpisujecie sami. Wartość POLSTR 1M Stopa Składana w przykładzie pochodzi ze strony GPW Benchmark z 20 października 2026 roku, a oprocentowanie stałe to założenie przykładu. Przed podpisaniem umowy sprawdźcie warunki w swoim banku.</em></p>
