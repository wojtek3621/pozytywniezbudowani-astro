---
publishDate: 2026-01-11T16:42:56
updateDate: 2026-02-03T08:23:44
title: "Kalkulator raty kredytu hipotecznego – oblicz swoją ratę"
excerpt: "Ile zapłacicie bankowi co miesiąc? Wpisz kwotę kredytu i sprawdź sam…"
image: "~/assets/images/blog/kalkulator-raty-kredytu-hipotecznego.jpeg"
category: "Blog"
tags:
  - "kalkulator kredytu hipotecznego"
  - "rata kredytu"
  - "WIBOR marża"
author: "Wojciech Tracichleb"
metadata:
  canonical: "https://pozytywniezbudowani.pl/blog/kalkulator-raty-kredytu-hipotecznego/"
  title: "Kalkulator raty kredytu hipotecznego – oblicz swoją ratę"
  description: "Oblicz ratę kredytu hipotecznego na budowę domu. Sprawdź jak WIBOR i marża wpływają na wysokość raty równej i malejącej."
  robots:
    index: true
    follow: true
---

<p style="text-align: center;"><img alt="Kalkulator z wyświetloną kwotą obok wydrukowanych tabel kredytowych i długopisu" class="responsive-image" src="/files/userfiles/kalkulator-raty-kredytu-hipotecznego-obliczenia.jpeg" style="width: 525px; height: 350px;" title="Kalkulator raty kredytu hipotecznego - obliczanie miesięcznej raty" /></p>

<p style="text-align: justify;">Zastanawialiście się kiedyś, ile tak naprawdę będzie kosztował Was kredyt na budowę domu? Nie chodzi mi o sumę, którą pożyczacie – to wiecie. Chodzi o to, ile będziecie oddawać bankowi co miesiąc przez najbliższych kilkanaście, może kilkadziesiąt lat. Wpiszcie poniżej kwotę kredytu i sprawdźcie sami.</p>

<!-- KALKULATOR RATY KREDYTU HIPOTECZNEGO -->
<div id="kalkulator-kredytu" style="max-width: 700px; margin: 30px auto; padding: 25px; background: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

    <h3 style="text-align: center; color: #3c3c3c; margin: 0 0 25px 0; font-size: 22px; font-weight: 600; border-bottom: 3px solid #c9a456; padding-bottom: 12px;">Kalkulator raty kredytu hipotecznego</h3>

    <!-- Komunikat błędu -->
    <div id="komunikat-bledu" style="display: none; background: #fee; border: 1px solid #c00; color: #c00; padding: 10px 15px; border-radius: 6px; margin-bottom: 15px; font-size: 14px;"></div>

    <!-- Pola formularza -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">

        <div style="grid-column: 1 / -1;">
            <label for="kalk-kwota" style="display: block; margin-bottom: 6px; color: #3c3c3c; font-weight: 500; font-size: 14px;">Kwota kredytu (zł)</label>
            <input type="text" id="kalk-kwota" tabindex="1" placeholder="np. 400 000" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 18px; font-weight: 600; color: #3c3c3c; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#c9a456'" onblur="this.style.borderColor='#ddd'">
        </div>

        <div>
            <label for="kalk-okres" style="display: block; margin-bottom: 6px; color: #3c3c3c; font-weight: 500; font-size: 14px;">Okres kredytowania (lat)</label>
            <input type="text" id="kalk-okres" tabindex="2" placeholder="np. 25" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; color: #3c3c3c; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#c9a456'" onblur="this.style.borderColor='#ddd'">
        </div>

        <div>
            <label for="kalk-wibor" style="display: block; margin-bottom: 6px; color: #3c3c3c; font-weight: 500; font-size: 14px;">WIBOR 3M (%)</label>
            <input type="text" id="kalk-wibor" tabindex="3" placeholder="np. 3,90" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; color: #3c3c3c; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#c9a456'" onblur="this.style.borderColor='#ddd'">
            <div style="font-size: 11px; color: #888; margin-top: 4px;">Aktualną stawkę sprawdzisz na <a href="https://gpwbenchmark.pl/notowania-stawek-referencyjnych" target="_blank" rel="noopener" style="color: #c9a456;">gpwbenchmark.pl</a></div>
        </div>

        <div>
            <label for="kalk-marza" style="display: block; margin-bottom: 6px; color: #3c3c3c; font-weight: 500; font-size: 14px;">Marża banku (%)</label>
            <input type="text" id="kalk-marza" tabindex="4" placeholder="np. 2,00" style="width: 100%; padding: 12px 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; color: #3c3c3c; box-sizing: border-box; transition: border-color 0.2s;" onfocus="this.style.borderColor='#c9a456'" onblur="this.style.borderColor='#ddd'">
            <div style="font-size: 11px; color: #888; margin-top: 4px;">Typowa marża: 1,8% – 2,5%</div>
        </div>

    </div>

    <!-- Przyciski -->
    <div style="display: flex; gap: 10px; margin-bottom: 25px;">
        <button id="kalk-btn-oblicz" onclick="obliczRate()" tabindex="5" style="flex: 1; padding: 14px 20px; background: #c9a456; color: #fff; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#b8934a'" onmouseout="this.style.background='#c9a456'">Oblicz ratę</button>
        <button id="kalk-btn-wyczysc" onclick="wyczyscFormularz()" tabindex="6" style="padding: 14px 20px; background: #fff; color: #777; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.borderColor='#c9a456'; this.style.color='#c9a456'" onmouseout="this.style.borderColor='#ddd'; this.style.color='#777'">Wyczyść</button>
    </div>

    <!-- Wyniki -->
    <div id="wyniki" style="display: none;">

        <!-- GŁÓWNE PODSUMOWANIE -->
        <div id="podsumowanie" style="background: linear-gradient(135deg, #c9a456 0%, #b8934a 100%); color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 5px;">Twoja miesięczna rata (równa)</div>
            <div id="rata-glowna" style="font-size: 42px; font-weight: 700; line-height: 1.2;">-</div>
            <div id="podsumowanie-tekst" style="font-size: 13px; opacity: 0.85; margin-top: 8px;"></div>
        </div>

        <!-- Szczegóły -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px;">

            <!-- Oprocentowanie -->
            <div style="background: #fff; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #c9a456;">
                <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Oprocentowanie</div>
                <div id="oprocentowanie" style="font-size: 22px; font-weight: 700; color: #c9a456; margin-top: 2px;">-</div>
            </div>

            <!-- Łącznie do spłaty -->
            <div style="background: #fff; padding: 12px 15px; border-radius: 6px; border-left: 3px solid #3c3c3c;">
                <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Łącznie do spłaty</div>
                <div id="suma-rowna" style="font-size: 22px; font-weight: 700; color: #3c3c3c; margin-top: 2px;">-</div>
            </div>

        </div>

        <!-- Rata malejąca -->
        <div style="background: #fff; padding: 15px; border-radius: 6px; margin-bottom: 15px; border-left: 3px solid #5a8a6a;">
            <div style="font-size: 12px; color: #888; margin-bottom: 8px;">Rata malejąca (dla porównania)</div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span style="font-size: 12px; color: #888;">Pierwsza: </span>
                    <span id="rata-malejaca-pierwsza" style="font-size: 20px; font-weight: 600; color: #5a8a6a;">-</span>
                </div>
                <div>
                    <span style="font-size: 12px; color: #888;">Ostatnia: </span>
                    <span id="rata-malejaca-ostatnia" style="font-size: 20px; font-weight: 600; color: #5a8a6a;">-</span>
                </div>
                <div>
                    <span style="font-size: 12px; color: #888;">Łącznie: </span>
                    <span id="suma-malejaca" style="font-size: 16px; font-weight: 600; color: #5a8a6a;">-</span>
                </div>
            </div>
        </div>

        <!-- Porównanie -->
        <div id="porownanie" style="background: #fffbf0; padding: 15px; border-radius: 6px; border: 1px dashed #c9a456;">
            <div style="font-size: 12px; color: #888; margin-bottom: 4px;">Różnica w całkowitym koszcie kredytu</div>
            <div id="roznica" style="font-size: 18px; font-weight: 600; color: #3c3c3c;">-</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">Tyle więcej zapłacisz wybierając ratę równą zamiast malejącej.</div>
            <div style="font-size: 12px; color: #666; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5dcc8;"><span style="color: #c9a456; font-size: 14px;">★</span> <strong>Wskazówka:</strong> Możesz wziąć kredyt z ratą równą i regularnie go nadpłacać – zyskujesz elastyczność i zmniejszasz odsetki. Więcej o tej strategii piszę w dalszej części artykułu.</div>
        </div>

    </div>

    <!-- Info -->
    <p style="font-size: 11px; color: #999; text-align: center; margin: 20px 0 0 0; line-height: 1.5;">Kalkulator ma charakter poglądowy. Rzeczywista rata może się różnić w zależności od oferty banku, ubezpieczeń i dodatkowych opłat.</p>

</div>

<script>
// FIX: Własna obsługa Tab w kalkulatorze (obejście konfliktu z motywem strony)
(function() {
    // Wyłącz skip link
    var skipLink = document.querySelector('a.jump-to');
    if (skipLink) {
        skipLink.setAttribute('tabindex', '-1');
        skipLink.style.display = 'none';
    }

    // Kolejność pól w kalkulatorze
    var tabOrder = ['kalk-kwota', 'kalk-okres', 'kalk-wibor', 'kalk-marza', 'kalk-btn-oblicz', 'kalk-btn-wyczysc'];

    // Przechwytuj Tab w fazie capture (przed innymi handlerami)
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        var activeId = document.activeElement.id;
        var currentIndex = tabOrder.indexOf(activeId);

        // Jeśli focus jest na elemencie kalkulatora
        if (currentIndex !== -1) {
            e.preventDefault();
            e.stopPropagation();

            var nextIndex;
            if (e.shiftKey) {
                // Shift+Tab - wstecz
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = tabOrder.length - 1;
            } else {
                // Tab - naprzód
                nextIndex = currentIndex + 1;
                if (nextIndex >= tabOrder.length) nextIndex = 0;
            }

            var nextElement = document.getElementById(tabOrder[nextIndex]);
            if (nextElement) {
                nextElement.focus();
            }
        }
    }, true); // true = capture phase
})();

function obliczRate() {
    // Ukryj poprzedni błąd
    var komunikat = document.getElementById('komunikat-bledu');
    komunikat.style.display = 'none';

    // Pobranie wartości
    var kwotaStr = document.getElementById('kalk-kwota').value;
    var kwota = parseFloat(kwotaStr.replace(/\s/g, '').replace(/,/g, '.'));
    var lataStr = document.getElementById('kalk-okres').value;
    var lata = parseInt(lataStr.replace(/\s/g, ''));
    var wiborStr = document.getElementById('kalk-wibor').value;
    var wibor = parseFloat(wiborStr.replace(/,/g, '.'));
    var marzaStr = document.getElementById('kalk-marza').value;
    var marza = parseFloat(marzaStr.replace(/,/g, '.'));

    // Walidacja
    var bledy = [];
    if (isNaN(kwota) || kwota <= 0) {
        bledy.push('Podaj prawidłową kwotę kredytu');
    }
    if (isNaN(lata) || lata < 5 || lata > 35) {
        bledy.push('Okres kredytowania musi wynosić od 5 do 35 lat');
    }
    if (isNaN(wibor) || wibor < 0 || wibor > 10) {
        bledy.push('WIBOR musi wynosić od 0% do 10%');
    }
    if (isNaN(marza) || marza < 0 || marza > 10) {
        bledy.push('Marża banku musi wynosić od 0% do 10%');
    }

    if (bledy.length > 0) {
        komunikat.innerHTML = bledy.join('<br>');
        komunikat.style.display = 'block';
        document.getElementById('wyniki').style.display = 'none';
        return;
    }

    // Obliczenia
    var oprocentowanieRoczne = wibor + marza;
    var r = oprocentowanieRoczne / 100 / 12;
    var n = lata * 12;

    // Rata równa (annuitetowa)
    var rataRowna;
    if (r === 0) {
        rataRowna = kwota / n;
    } else {
        rataRowna = kwota * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    var sumaRowna = rataRowna * n;

    // Rata malejąca
    var kapitalMiesiecznie = kwota / n;
    var pierwszaRataMalejaca = kapitalMiesiecznie + (kwota * r);
    var ostatniaRataMalejaca = kapitalMiesiecznie + (kapitalMiesiecznie * r);

    // Suma rat malejących
    var sumaMalejaca = 0;
    for (var i = 0; i < n; i++) {
        var pozostalyKapital = kwota - (i * kapitalMiesiecznie);
        var odsetkiMiesieczne = pozostalyKapital * r;
        sumaMalejaca += kapitalMiesiecznie + odsetkiMiesieczne;
    }

    // Różnica
    var roznica = sumaRowna - sumaMalejaca;

    // Wyświetlenie wyników
    document.getElementById('wyniki').style.display = 'block';

    // Główne podsumowanie
    document.getElementById('rata-glowna').textContent = formatujKwote(rataRowna) + ' zł';
    document.getElementById('podsumowanie-tekst').textContent = 'Kredyt ' + formatujKwote(kwota) + ' zł na ' + lata + ' lat przy ' + oprocentowanieRoczne.toFixed(2).replace('.', ',') + '% w skali roku';

    // Szczegóły
    document.getElementById('oprocentowanie').textContent = oprocentowanieRoczne.toFixed(2).replace('.', ',') + '%';
    document.getElementById('suma-rowna').textContent = formatujKwote(sumaRowna) + ' zł';
    document.getElementById('rata-malejaca-pierwsza').textContent = formatujKwote(pierwszaRataMalejaca) + ' zł';
    document.getElementById('rata-malejaca-ostatnia').textContent = formatujKwote(ostatniaRataMalejaca) + ' zł';
    document.getElementById('suma-malejaca').textContent = formatujKwote(sumaMalejaca) + ' zł';
    document.getElementById('roznica').textContent = formatujKwote(roznica) + ' zł';

    // Sformatuj kwotę w polu
    document.getElementById('kalk-kwota').value = formatujKwote(kwota);
}

function wyczyscFormularz() {
    document.getElementById('kalk-kwota').value = '';
    document.getElementById('kalk-okres').value = '';
    document.getElementById('kalk-wibor').value = '';
    document.getElementById('kalk-marza').value = '';
    document.getElementById('wyniki').style.display = 'none';
    document.getElementById('komunikat-bledu').style.display = 'none';
    document.getElementById('kalk-kwota').focus();
}

function formatujKwote(liczba) {
    return Math.round(liczba).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
</script>
<!-- KONIEC KALKULATORA -->

<h2 style="text-align: justify;">Skąd bierze się Wasza rata – WIBOR plus marża</h2>

<p style="text-align: justify;">Zanim zaczniecie porównywać oferty banków, musicie zrozumieć, z czego w ogóle składa się oprocentowanie kredytu hipotecznego. To nie jest jedna liczba, którą bank sobie wymyślił – to suma dwóch elementów, które działają zupełnie inaczej.</p>

<p style="text-align: justify;">Pierwszy element to WIBOR – Warsaw Interbank Offered Rate. To stawka, po jakiej banki pożyczają sobie nawzajem pieniądze na rynku międzybankowym. WIBOR zmienia się regularnie, zależy od decyzji Rady Polityki Pieniężnej i sytuacji gospodarczej. Na ten składnik nie macie żadnego wpływu – ani Wy, ani bank. Rośnie, gdy rosną stopy procentowe, spada, gdy RPP je obniża. To właśnie dlatego raty kredytów tak bardzo skoczyły w latach 2022–2023, a potem zaczęły delikatnie maleć.</p>

<p style="text-align: justify;">Drugi element to marża banku. To już jest czysta decyzja kredytodawcy – jego zarobek na udzieleniu Wam kredytu. Marża jest stała przez cały okres kredytowania i ustalana w momencie podpisywania umowy. I tu uwaga: marża jest negocjowalna. Nawet niewielkie obniżenie – powiedzmy o 0,2 punktu procentowego – przy kredycie na 25–30 lat przekłada się na oszczędności liczone w dziesiątkach tysięcy złotych.</p>

<p style="text-align: justify;">Wasze oprocentowanie to więc WIBOR plus marża. Jeśli WIBOR 3M wynosi przykładowo 5,8%, a bank dał Wam marżę 2%, to oprocentowanie Waszego kredytu wynosi 7,8% w skali roku. I właśnie od tego oprocentowania kalkulator wylicza, ile będziecie płacić co miesiąc.</p>

<h2 style="text-align: justify;">Rata równa czy malejąca – która dla kogo</h2>

<p style="text-align: justify;">Przy podpisywaniu umowy kredytowej staniecie przed wyborem: rata równa czy malejąca. Większość osób wybiera ratę równą – i nieprzypadkowo.</p>

<p style="text-align: justify;">Rata równa oznacza, że przez cały okres kredytowania płacicie bankowi tę samą kwotę. Na początku spłacacie głównie odsetki (kapitał prawie stoi w miejscu), a pod koniec głównie kapitał. To rozwiązanie daje przewidywalność – wiecie dokładnie, ile macie zarezerwować w domowym budżecie co miesiąc. Dla większości rodzin budujących dom to duża wartość, bo i tak na głowie macie wystarczająco dużo niepewności.</p>

<p style="text-align: justify;">Rata malejąca działa inaczej. Na początku płacicie znacznie więcej, ale z każdym rokiem rata maleje. Część kapitałowa jest stała, a ponieważ odsetki naliczane są od coraz mniejszego zadłużenia, całkowita rata systematycznie spada. Matematycznie – płacicie mniej odsetek niż przy racie równej. Ale żeby wejść w tę grę, musicie mieć wyższą zdolność kredytową i więcej wolnych środków na początku.</p>

<p style="text-align: justify;">Moja rekomendacja? Weźcie kredyt z ratą równą na maksymalnie długi okres i nadpłacajcie go co miesiąc tak, jakbyście spłacali kredyt krótszy. Dlaczego? Bo macie elastyczność. Gdy przychodzą gorsze miesiące – remont, awaria samochodu, choroba – po prostu nie nadpłacacie i płacicie niższą, podstawową ratę. Nikt nie pyta, nikt nie wymaga tłumaczeń. A gdy wszystko idzie dobrze – nadpłacacie i skracacie kredyt.</p>

<h2 style="text-align: justify;">Co jeszcze wpływa na wysokość raty</h2>

<p style="text-align: justify;">Kwota kredytu i oprocentowanie to fundament, ale nie wszystko. Każdy z poniższych czynników przesunie Waszą ratę w górę lub w dół.</p>

<p style="text-align: justify;">Okres kredytowania ma ogromne znaczenie. Kredyt na 15 lat oznacza dużo wyższą ratę niż ten sam kredyt na 30 lat – ale też znacznie mniejsze łączne odsetki. Różnica w całkowitym koszcie bywa kolosalna. Jednak jeśli wybierzecie dłuższy okres i będziecie systematycznie nadpłacać, możecie osiągnąć najlepsze z obu światów: niskie minimalne zobowiązanie plus możliwość szybszej spłaty bez stresu.</p>

<p style="text-align: justify;">Wkład własny też ma znaczenie. Banki oferują lepsze marże klientom, którzy wnoszą 20% lub więcej wkładu własnego. Przy 10% macie do czynienia z wyższym ryzykiem dla banku – a ryzyko zawsze kosztuje. Jeśli macie działkę kupioną za gotówkę, to większość banków zaliczy jej wartość jako wkład własny, co znacząco poprawia Waszą pozycję negocjacyjną.</p>

<p style="text-align: justify;">Wreszcie – Wasza sytuacja finansowa. Stabilne dochody z umowy o pracę na czas nieokreślony to dla banków najlepsza sytuacja. Prowadzicie własną działalność? Bank podejdzie do Was ostrożniej, ale to nie znaczy, że nie dostaniecie kredytu – po prostu musicie mieć czystą historię i odpowiednio udokumentowane przychody.</p>

<h2 style="text-align: justify;">Podsumowanie</h2>

<p style="text-align: justify;">Kalkulator powyżej powie Wam, ile mniej więcej będziecie płacić bankowi co miesiąc. To punkt wyjścia, nie ostateczna odpowiedź – bo każdy bank ma inne marże, inne wymagania i inaczej liczy zdolność kredytową. Ale już teraz wiecie, jak działa mechanizm, z czego składa się rata i na co zwrócić uwagę, gdy zasiądziecie do rozmów z doradcą kredytowym. Pełną strategię znajdziecie w artykule o tym, <a href="https://pozytywniezbudowani.pl/blog/jak-przygotowac-sie-finansowo-do-budowy-domu/">jak przygotować się finansowo do budowy domu</a>.</p>

<p style="text-align: justify;">Jeśli chcecie poznać pełną strategię przygotowania do kredytu hipotecznego na budowę domu – od budowania historii w BIK, przez wybór doradcy, po negocjacje z bankiem – znajdziecie ją w mojej książce „Od marzenia do wprowadzenia". A jeśli interesuje Was temat transz, porównanie okresów kredytowania czy wpływ nadpłat na całkowity koszt kredytu – zajrzyjcie do pozostałych artykułów na tym blogu.</p>
