import { getPermalink, getBlogPermalink, getHomePermalink } from './utils/permalinks';

// Nawigacja główna: Start · Centrum · Książka · Blog · Sklep · O mnie · Kontakt.
// Media zostają w stopce.
//
// ⚠ DYREKTYWA WŁAŚCICIELA 2026-07-20 — NIE PRZYWRACAĆ LIMITU 5 POZYCJI.
// Koncepcja strony-bramy (M3, 2026-07-18; strategia ekosystemu
// 04-koncepcja-strony §2) zakładała max 5 pozycji i zsyłała Sklep/Kontakt do
// stopki. Wojtek świadomie to nadpisał: 'Start' (jawne wyjście na stronę
// główną obok klikalnego logo) oraz powrót 'Sklep' i 'Kontakt' do menu —
// przekroczenie piątki jest zamierzone, nie przeoczeniem. Sesja czytająca sam
// dokument koncepcji zobaczy rozjazd; to NIE jest błąd do naprawienia.
// Zmiana składu menu wymaga nowej decyzji Wojtka.
export const headerData = {
  links: [
    {
      text: 'Start',
      href: getHomePermalink(),
    },
    {
      text: 'Centrum',
      href: getPermalink('/centrum'),
    },
    {
      text: 'Książka',
      href: getPermalink('/ksiazka'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Sklep',
      href: getPermalink('/sklep'),
    },
    {
      text: 'O mnie',
      href: getPermalink('/o-mnie'),
    },
    {
      text: 'Kontakt',
      href: getPermalink('/kontakt'),
    },
  ],
  actions: [{ text: 'Logowanie', href: 'https://platforma.pozytywniezbudowani.pl/', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Blog',
      links: [{ text: 'Wszystkie artykuły', href: getBlogPermalink() }],
    },
    {
      title: 'Informacje',
      links: [
        { text: 'Centrum Dowodzenia Budową', href: getPermalink('/centrum') },
        { text: 'O mnie', href: getPermalink('/o-mnie') },
        { text: 'Książka', href: getPermalink('/ksiazka') },
        { text: 'Sklep', href: getPermalink('/sklep') },
        { text: 'Kontakt', href: getPermalink('/kontakt') },
        { text: 'Media', href: getPermalink('/media') },
      ],
    },
    {
      title: 'Prawne',
      links: [
        { text: 'Polityka prywatności', href: getPermalink('/polityka-prywatnosci') },
        { text: 'Regulamin newslettera', href: getPermalink('/regulamin-newslettera') },
        { text: 'Regulamin sprzedaży', href: getPermalink('/regulamin-sprzedazy-produktow-cyfrowych') },
        {
          text: 'Regulamin platformy e-learningowej',
          href: getPermalink('/regulamin-platformy-e-learningowej-2'),
        },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Polityka prywatności', href: getPermalink('/polityka-prywatnosci') },
    { text: 'Regulamin', href: getPermalink('/regulamin-newslettera') },
  ],
  socialLinks: [
    {
      ariaLabel: 'Facebook',
      icon: 'tabler:brand-facebook',
      href: 'https://www.facebook.com/PozytywnieZbudowani1',
    },
    {
      ariaLabel: 'Instagram',
      icon: 'tabler:brand-instagram',
      href: 'https://www.instagram.com/pozytywniezbudowani/',
    },
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/wojciech-tracichleb/' },
  ],
  footNote: `
    &copy; ${new Date().getFullYear()} Pozytywnie Zbudowani – Wojciech Tracichleb. Wszelkie prawa zastrzeżone.
  `,
};
