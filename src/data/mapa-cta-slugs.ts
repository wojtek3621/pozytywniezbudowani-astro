/**
 * Top-20 artykułów bloga pod box CTA „Mapa 12 tygodni" (LPO, 2026-07-18).
 *
 * Źródło listy: GSC 90 dni (zapytanie z 2026-07-13, aios.db RO) –
 * aios-workspace/builds/2026-07-13-spolecznosc-launch/tresci/plan-blog.md.
 * Kolejność = kliki malejąco. Suma ≈ 5 853 klików/90 dni (~1 950/mies.).
 *
 * Wpięcie: box na końcu artykułu (SinglePost przez [...blog]/index.astro)
 * dla slugów z tej listy + box pod listą wpisów na stronach bloga.
 * Edycja listy = deploy (build-time); świadomie bez CMS.
 */
export const MAPA_CTA_SLUGS: ReadonlySet<string> = new Set([
  'jak-dobrac-kabel-przylaczeniowy-do-domu-jednorodzinnego', // 1 766
  'warunki-zabudowy-kiedy-potrzebne-jak-uzyskac', // 609
  'linia-energetyczna-przez-dzialke-co-robic', // 512
  'ile-trwa-uzyskanie-pozwolenia-na-budowe', // 460
  'xps-pod-plyta-fundamentowa-czy-sie-oplaca', // 302
  'mpzp-jak-czytac-miejscowy-plan-zagospodarowania-przestrzennego', // 260
  'poziom-zero-budynku-co-to-jest-jak-ustalic', // 193
  'mapa-zasadnicza-jak-ja-czytac', // 187
  'cokol-budynku-izolacja-i-wykonczenie', // 175
  'umowa-przedwstepna-na-dzialke-na-co-uwazac', // 169
  'tablica-budowy-co-musi-zawierac-i-gdzie-powiesic', // 153
  'dzialka-z-budynkiem-do-rozbiorki-czy-warto', // 145
  'dylatacje-w-wylewkach-kiedy-i-jak-wykonac', // 135
  'archeologiczne-tereny-a-budowa-domu', // 129
  'zgloszenie-rozpoczecia-budowy-gdzie-i-jak', // 118
  'pelnomocnictwo-dla-kierownika-budowy-zakres', // 115
  'vat-8-vs-23-na-materialy-budowlane-jak-zaoszczedzic', // 115
  'kanalizacja-pod-fundamentami-jak-zaplanowac', // 113
  'odbior-domu-do-uzytkowania-procedura-krok-po-kroku', // 106
  'dziennik-budowy-jak-prowadzic-poprawnie', // 91
]);
