/**
 * Przełącznik checkoutu książki (misja: własny sklep na Autopay, 2026-07-18).
 *
 * 'salescrm' – hostowany koszyk Imker SalesCRM (stan dotychczasowy),
 * 'own'      – własny checkout sklep.pozytywniezbudowani.pl (mikroserwis sklep/ w AIOS).
 *
 * Cutover = zmiana JEDNEJ stałej CHECKOUT_MODE + build + deploy (wrangler).
 * Rollback identycznie (powrót na 'salescrm'). Konsumenci: sklep.astro,
 * nowa.astro, KsiazkaContent.astro (CTA + JSON-LD offer.url + forwarding UTM).
 */
type CheckoutMode = 'salescrm' | 'own';

export const CHECKOUT_MODE: CheckoutMode = 'own';

const CHECKOUT_URLS: Record<CheckoutMode, string> = {
  salescrm: 'https://pozytywnie-zbudowani.salescrm.pl/cart/add_product/15603',
  own: 'https://sklep.pozytywniezbudowani.pl/zamowienie',
};

export const CHECKOUT_URL: string = CHECKOUT_URLS[CHECKOUT_MODE];
