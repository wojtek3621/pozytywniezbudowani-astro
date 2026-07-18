import { getPermalink, getBlogPermalink } from './utils/permalinks';

// Nawigacja główna wg koncepcji strony-bramy (M3, 2026-07-18; strategia
// ekosystemu 04-koncepcja-strony §2): max 5 pozycji — Centrum · Książka ·
// Blog · O mnie (+ docelowo Sztab Budowy, czeka na decyzję nazwy W4).
// Sklep / Kontakt / Media mieszkają w stopce — nie rozpychamy menu.
export const headerData = {
  links: [
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
      text: 'O mnie',
      href: getPermalink('/o-mnie'),
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
