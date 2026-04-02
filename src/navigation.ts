import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
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
    {
      text: 'Media',
      href: getPermalink('/media'),
    },
  ],
  actions: [{ text: 'Logowanie', href: 'https://platforma.pozytywniezbudowani.pl/wp-login.php', target: '_blank' }],
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
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    &copy; ${new Date().getFullYear()} Pozytywnie Zbudowani — Wojciech Tracichleb. Wszelkie prawa zastrzeżone.
  `,
};
