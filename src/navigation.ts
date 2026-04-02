import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Książka',
      href: getPermalink('/ksiazka'),
    },
    {
      text: 'O mnie',
      href: getPermalink('/o-mnie'),
    },
    {
      text: 'Sklep',
      href: getPermalink('/sklep'),
    },
    {
      text: 'Media',
      href: getPermalink('/media'),
    },
    {
      text: 'Kontakt',
      href: getPermalink('/kontakt'),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Blog',
      links: [
        { text: 'Wszystkie artykuły', href: getBlogPermalink() },
      ],
    },
    {
      title: 'Informacje',
      links: [
        { text: 'O mnie', href: getPermalink('/o-mnie') },
        { text: 'Książka', href: getPermalink('/ksiazka') },
        { text: 'Kontakt', href: getPermalink('/kontakt') },
        { text: 'Sklep', href: getPermalink('/sklep') },
      ],
    },
    {
      title: 'Prawne',
      links: [
        { text: 'Polityka prywatności', href: getPermalink('/polityka-prywatnosci') },
        { text: 'Regulamin newslettera', href: getPermalink('/regulamin-newslettera') },
        { text: 'Regulamin sprzedaży', href: getPermalink('/regulamin-sprzedazy-produktow-cyfrowych') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Polityka prywatności', href: getPermalink('/polityka-prywatnosci') },
    { text: 'Regulamin', href: getPermalink('/regulamin-newslettera') },
  ],
  socialLinks: [
    { ariaLabel: 'LinkedIn', icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/in/wojciech-tracichleb/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    &copy; ${new Date().getFullYear()} Pozytywnie Zbudowani — Wojciech Tracichleb. Wszelkie prawa zastrzeżone.
  `,
};
