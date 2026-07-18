/*!
 * z.js — first-party behavioral collector (misja „analityka-atrybucja" 2026-07-18).
 *
 * KANONICZNY kolektor first-party. Identyczna kopia działa na platformie
 * (platforma/static/js/z.js). Wysyła page_view / page_leave / click_out na
 * same-origin POST /api/z (PZ: Cloudflare Worker; platforma: FastAPI). Zero
 * blokowania (sendBeacon / fetch keepalive), zero wpływu na stronę (try/catch wszędzie).
 *
 * REGUŁA A: to OSOBNY system od beaconu zgód (consent.js/ConsentBanner) — nie dotyka go.
 * REGUŁA B: dane lecą WYŁĄCZNIE na nasz endpoint (→ D1/tracking.db), nigdzie na zewnątrz;
 *           dlatego kolektor działa też przed zgodą (first-party u nas), a consent-gating
 *           zewnętrznych narzędzi (GA4/Meta/Clarity) zostaje nietknięty.
 *
 * device_id: cookie pz_did (Domain=.pozytywniezbudowani.pl → współdzielone z subdomeną
 *            platformy = deterministyczny stitching) + mirror localStorage + fallback fingerprint.
 * session_id: localStorage, 30 min bezczynności.
 */
(function () {
  'use strict';
  try {
    if (window.__pzTrackerInit) return;
    window.__pzTrackerInit = true;
  } catch (e) { return; }

  var ENDPOINT = '/api/z';
  var DID_KEY = 'pz_did', SID_KEY = 'pz_sid', STS_KEY = 'pz_sts';
  var SESSION_TIMEOUT = 30 * 60 * 1000;
  var COOKIE_DOMAIN = '.pozytywniezbudowani.pl';

  function site() {
    try {
      var h = location.host;
      if (h.indexOf('platforma.') === 0 || h.indexOf('.platforma.') !== -1) return 'platforma';
      if (h.indexOf('4izby') !== -1) return '4izby';
      return 'pz';
    } catch (e) { return 'pz'; }
  }
  var SITE = site();

  function uuid() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return 'fb-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function readCookie(name) {
    try {
      var m = document.cookie.match('(^|;)\\s*' + name + '=([^;]+)');
      return m ? decodeURIComponent(m[2]) : null;
    } catch (e) { return null; }
  }
  function writeCookie(name, val) {
    try {
      var d = new Date();
      d.setTime(d.getTime() + 400 * 864e5); // 400 dni (max Chrome)
      var secure = location.protocol === 'https:' ? ';Secure' : '';
      var dom = (location.host.indexOf('pozytywniezbudowani.pl') !== -1) ? ';domain=' + COOKIE_DOMAIN : '';
      document.cookie = name + '=' + encodeURIComponent(val) + ';expires=' + d.toUTCString() +
        ';path=/' + dom + ';SameSite=Lax' + secure;
    } catch (e) {}
  }

  var isNewDevice = false;
  function deviceId() {
    var did = readCookie(DID_KEY);
    var ls = null;
    try { ls = localStorage.getItem(DID_KEY); } catch (e) {}
    did = did || ls;
    if (!did) { did = uuid(); isNewDevice = true; }
    writeCookie(DID_KEY, did);
    try { localStorage.setItem(DID_KEY, did); } catch (e) {}
    return did;
  }

  var isNewSession = false;
  function sessionId() {
    var now = Date.now(), sid = null, sts = 0;
    try {
      sid = localStorage.getItem(SID_KEY);
      sts = parseInt(localStorage.getItem(STS_KEY) || '0', 10);
    } catch (e) {}
    if (!sid || !sts || (now - sts) > SESSION_TIMEOUT) { sid = uuid(); isNewSession = true; }
    try { localStorage.setItem(SID_KEY, sid); localStorage.setItem(STS_KEY, String(now)); } catch (e) {}
    return sid;
  }
  function touchSession() {
    try { localStorage.setItem(STS_KEY, String(Date.now())); } catch (e) {}
  }

  // cyrb53 — szybki, synchroniczny hash (do fallback-matchingu fingerprintu)
  function cyrb53(str, seed) {
    var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  }
  function fingerprint() {
    try {
      var parts = [];
      // canvas
      try {
        var c = document.createElement('canvas'); c.width = 240; c.height = 60;
        var ctx = c.getContext('2d');
        ctx.textBaseline = 'top'; ctx.font = "14px 'Arial'";
        ctx.fillStyle = '#f60'; ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069'; ctx.fillText('PZ analytics ✨', 2, 15);
        ctx.fillStyle = 'rgba(102,204,0,0.7)'; ctx.fillText('PZ analytics ✨', 4, 17);
        parts.push(c.toDataURL());
      } catch (e) { parts.push('nocanvas'); }
      // webgl
      try {
        var gl = document.createElement('canvas').getContext('webgl');
        if (gl) {
          var dbg = gl.getExtension('WEBGL_debug_renderer_info');
          if (dbg) {
            parts.push(gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) + '~' +
              gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL));
          }
        }
      } catch (e) {}
      // screen + hardware + locale
      parts.push([
        screen.width, screen.height, screen.colorDepth, window.devicePixelRatio || '',
        Intl.DateTimeFormat().resolvedOptions().timeZone || '',
        navigator.language || '', navigator.platform || '',
        navigator.hardwareConcurrency || '', navigator.deviceMemory || ''
      ].join('|'));
      return cyrb53(parts.join('###'), 0x505A);
    } catch (e) { return null; }
  }

  function qp(name) {
    try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; }
  }
  function hostOf(u) {
    try { return u ? new URL(u, location.href).host : ''; } catch (e) { return ''; }
  }
  function deviceClass() {
    try {
      var ua = navigator.userAgent || '', w = screen.width || 0;
      if (/iPad|Tablet/i.test(ua) || (w >= 600 && w < 1024 && 'ontouchstart' in window)) return 'tablet';
      if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
      return 'desktop';
    } catch (e) { return null; }
  }

  // ── Sygnały detekcji botów (Warstwa 2, MIĘKKIE — misja jakosc-ruchu 2026-07-18) ──
  // navigator.webdriver: 1 automat / 0 przeglądarka / null gdy brak API.
  function webdriverFlag() {
    try {
      if (navigator.webdriver === true) return 1;
      if (typeof navigator.webdriver === 'boolean') return 0;
      return null;
    } catch (e) { return null; }
  }
  // WebGL renderer: 'software' (SwiftShader/llvmpipe = tell headless), 'none' (brak WebGL),
  // 'masked' (ekstensja debug niedostępna) albo realny string GPU. NIGDY jako fingerprint.
  function webglRenderer() {
    try {
      var cv = document.createElement('canvas');
      var gl = cv.getContext('webgl') || cv.getContext('experimental-webgl');
      if (!gl) return 'none';
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (!dbg) return 'masked';
      var r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
      if (!r) return 'masked';
      if (/swiftshader|llvmpipe|software|mesa offscreen|microsoft basic render/i.test(r)) return 'software';
      return r.slice(0, 100);
    } catch (e) { return null; }
  }
  // Liczba języków (navigator.languages) — 0 = częsty tell headless.
  function languagesCount() {
    try { return (navigator.languages && navigator.languages.length) || 0; } catch (e) { return null; }
  }

  var DID = deviceId(), SID = sessionId(), FP = fingerprint();
  var pageStart = Date.now(), maxScroll = 0, activeMs = 0, lastActive = Date.now();

  function base(type) {
    return {
      event_uid: uuid(), site: SITE, ts: new Date().toISOString(), event_type: type,
      device_id: DID, session_id: SID, fingerprint: FP,
      path: location.pathname.slice(0, 300), query: location.search.slice(0, 500),
      referrer: (document.referrer || '').slice(0, 500), referrer_host: hostOf(document.referrer),
      title: (document.title || '').slice(0, 200),
      utm_source: qp('utm_source'), utm_medium: qp('utm_medium'), utm_campaign: qp('utm_campaign'),
      utm_term: qp('utm_term'), utm_content: qp('utm_content'),
      nlt: qp('nlt'), pxid: qp('_pxid'),
      screen_w: screen.width, screen_h: screen.height,
      viewport_w: window.innerWidth, viewport_h: window.innerHeight,
      device_pixel_ratio: window.devicePixelRatio || null,
      language: navigator.language || null,
      timezone: (function () { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { return null; } })(),
      hardware_concurrency: navigator.hardwareConcurrency || null,
      device_memory: navigator.deviceMemory || null,
      connection_type: (navigator.connection && navigator.connection.effectiveType) || null,
      device_class: deviceClass(),
      // env-sygnały detekcji botów (miękkie; fingerprint NIGDY nie jest sygnałem bota)
      webdriver: webdriverFlag(),
      webgl_renderer: webglRenderer(),
      languages_count: languagesCount()
    };
  }

  function send(payload) {
    try {
      var b = JSON.stringify(payload);
      if (b.length > 4000) { payload.title = ''; payload.query = payload.query.slice(0, 120); b = JSON.stringify(payload); }
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([b], { type: 'application/json' }));
      } else {
        fetch(ENDPOINT, { method: 'POST', body: b, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(function () {});
      }
    } catch (e) {}
  }

  // page_view
  var pvSent = false;
  function pageView() {
    if (pvSent) return; pvSent = true;
    var p = base('page_view');
    p.is_new_device = isNewDevice; p.is_new_session = isNewSession;
    send(p);
  }

  // engagement
  try {
    document.addEventListener('scroll', function () {
      try {
        var h = document.documentElement;
        var pct = Math.round((h.scrollTop + window.innerHeight) / (h.scrollHeight || 1) * 100);
        if (pct > maxScroll) maxScroll = Math.min(100, pct);
      } catch (e) {}
    }, { passive: true });
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, function () {
        var now = Date.now();
        if (now - lastActive < 30000) activeMs += now - lastActive;
        lastActive = now; touchSession();
      }, { passive: true });
    });
  } catch (e) {}

  // click_out (outbound + checkout)
  try {
    document.addEventListener('click', function (e) {
      try {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var h = hostOf(a.href);
        if (!h || h === location.host) return;
        var p = base('click_out');
        p.outbound_url = a.href.slice(0, 500);
        p.outbound_host = h;
        p.link_text = (a.textContent || '').trim().slice(0, 120);
        p.is_checkout = /imker|sklep|zamowien|checkout|\/kup|platnos|przelewy24|payu|stripe|tpay|paypal/i.test(a.href) ? 1 : 0;
        send(p);
      } catch (err) {}
    }, true);
  } catch (e) {}

  // page_leave (re-armed on return; sessionizer bierze MAX engagement per sesja+path)
  var leaveSent = false;
  function pageLeave() {
    if (leaveSent) return; leaveSent = true;
    var now = Date.now();
    if (now - lastActive < 30000) activeMs += now - lastActive;
    var p = base('page_leave');
    p.time_on_page_ms = now - pageStart;
    p.active_time_ms = activeMs;
    p.max_scroll_pct = maxScroll;
    send(p);
  }
  try {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') pageLeave();
      else leaveSent = false;
    });
    window.addEventListener('pagehide', pageLeave);
  } catch (e) {}

  // fire page_view
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', pageView, { once: true });
  } else {
    pageView();
  }
})();
