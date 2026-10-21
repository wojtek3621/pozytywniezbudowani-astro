---
# Roboczy blok na osobnej gałęzi; tekst i data do odbioru przed scaleniem.
publishDate: 2026-10-20T00:00:00Z
title: 'Stała czy zmienna stopa – kalkulator rat i odsetek'
category: 'Finansowanie budowy'
tags: ['kalkulator', 'POLSTR', 'WIBOR', 'kredyt hipoteczny']
metadata:
  canonical: 'https://pozytywniezbudowani.pl/blog/stala-czy-zmienna-stopa-kalkulator/'
---

<!-- Powiazane: platforma/content/html/kalkulator-stalej-i-zmiennej-stopy.html (repo AIOS), builds/2026-10-20-kalk-polstr/raport.md -->
<!-- TEKST-WPISU: pisze proces pisania w głosie autora -->
<!-- LINK-ARTYKUL: /blog/polstr-zamiast-wibor/ – do wpięcia po scaleniu gałęzi artykułu -->

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
