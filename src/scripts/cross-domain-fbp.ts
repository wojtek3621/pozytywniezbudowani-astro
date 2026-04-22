// Cross-domain Meta attribution bridge
//
// Appends `_fbp`, `_fbc` and `fbclid` to salescrm.pl links at click time so
// the SalesCRM subdomain can restore Meta attribution on navigation.
// Pairs with the GTM-KQL4T3DR `FB - fbp restore from URL` tag.
//
// Plan: builds/audyty/2026-04-22-purchase-pipeline-forensics.md (Faza 8, P0.3)
// Brief: builds/briefs/2026-04-22-kazik-krok2-purchase-pipeline-fix.md (WS A4)
//
// Guardrails:
// - Passive, capture-phase click listener: fires before default click handler.
// - Never overwrites params already present in the outbound URL.
// - Invalid URLs fail silently (non-fatal cosmetic bridge).
// - Uses `closest('a[href*="salescrm.pl"]')` so clicks on nested elements
//   inside an anchor still resolve to the anchor tag.

(function () {
  function getCookie(name: string): string | null {
    if (!document.cookie) return null;
    const parts = document.cookie.split('; ');
    const needle = name + '=';
    for (const part of parts) {
      if (part.indexOf(needle) === 0) {
        return part.substring(needle.length);
      }
    }
    return null;
  }

  function appendFbParams(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target || typeof target.closest !== 'function') return;

    const link = target.closest('a[href*="salescrm.pl"]') as HTMLAnchorElement | null;
    if (!link || !link.href) return;

    let url: URL;
    try {
      url = new URL(link.href);
    } catch {
      return;
    }

    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    let fbclid: string | null = null;
    try {
      fbclid = new URLSearchParams(window.location.search).get('fbclid');
    } catch {
      fbclid = null;
    }

    let changed = false;
    if (fbp && !url.searchParams.has('fbp')) {
      url.searchParams.set('fbp', fbp);
      changed = true;
    }
    if (fbc && !url.searchParams.has('fbc')) {
      url.searchParams.set('fbc', fbc);
      changed = true;
    }
    if (fbclid && !url.searchParams.has('fbclid')) {
      url.searchParams.set('fbclid', fbclid);
      changed = true;
    }

    if (changed) {
      try {
        link.href = url.toString();
      } catch {
        // Defensive: setter should never throw on a valid URL string.
      }
    }
  }

  // capture:true -> fires before default click / framework handlers.
  // passive:true -> we never preventDefault (non-blocking).
  // Document-level listener covers SPA navigation (ClientRouter) without rebind.
  document.addEventListener('click', appendFbParams, { capture: true, passive: true });
})();
