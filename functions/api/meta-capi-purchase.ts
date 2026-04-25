/**
 * Cloudflare Pages Function — /api/meta-capi-purchase
 *
 * Purpose: Self-hosted Meta Conversions API Purchase endpoint. Receives
 * Imker paid-order webhooks and forwards them to Meta Graph /events with
 * SHA-256 hashed customer data, event_id dedup, and fbp/fbc passthrough.
 *
 * Replaces: Social Elite (Stape) Global tenant pipeline that broke during
 * SalesCRM migration on 2026-04-12 (Jan can't restore per email 23546).
 *
 * Architecture:
 *   Imker paid order webhook
 *     -> HMAC verify (IMKER_WEBHOOK_SECRET, header X-Imker-Signature or X-Hub-Signature-256)
 *     -> SHA-256 hash customer email/phone/name (Meta EMQ)
 *     -> POST https://graph.facebook.com/v21.0/{pixel}/events
 *          event_name: Purchase
 *          event_id: order_number (without leading #) — DEDUP KEY
 *          user_data: {em, ph, fn, ln, zp, external_id, fbp, fbc, client_ip, client_ua}
 *          custom_data: {value, currency, content_ids, content_type, contents, num_items, order_id}
 *     -> Respond 200 to Imker (or 502 if Meta failed)
 *
 * Environment (Cloudflare Pages dashboard -> Settings -> Environment variables):
 *   META_PIXEL_ID            = 9313819978715439
 *   META_ADS_TOKEN           = (Graph API token, ads_management scope)
 *   IMKER_WEBHOOK_SECRET     = (shared secret for HMAC-SHA256 webhook signing)
 *
 * Plan:  builds/audyty/2026-04-22-purchase-pipeline-forensics.md (Faza 8)
 * Brief: builds/briefs/2026-04-22-kazik-krok2-purchase-pipeline-fix.md (WS B2)
 *
 * Runtime constraint: Cloudflare Workers only — uses `crypto.subtle`,
 * `fetch`, `TextEncoder`. No Node.js APIs.
 */

interface Env {
  META_PIXEL_ID: string;
  META_ADS_TOKEN: string;
  IMKER_WEBHOOK_SECRET: string;
}

interface ImkerProduct {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface ImkerOrderPayload {
  order_number: string;
  order_date: string;
  customer_email: string;
  customer_name: string;
  phone: string;
  order_total: number;
  currency: string;
  products: ImkerProduct[];
  delivery_address_json?: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  client_ip?: string;
  client_user_agent?: string;
}

interface MetaUserData {
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  zp?: string[];
  external_id?: string[];
  fbp?: string;
  fbc?: string;
  client_ip_address?: string;
  client_user_agent?: string;
}

interface MetaCustomData {
  currency: string;
  value: number;
  content_ids: string[];
  content_type: string;
  contents: Array<{ id: string; quantity: number; item_price: number }>;
  num_items: number;
  order_id: string;
}

interface MetaEvent {
  event_name: 'Purchase';
  event_time: number;
  event_id: string;
  action_source: 'website';
  event_source_url: string;
  user_data: MetaUserData;
  custom_data: MetaCustomData;
}

const META_GRAPH_VERSION = 'v21.0';
const EVENT_SOURCE_URL = 'https://pozytywnie-zbudowani.salescrm.pl/';
const RESPONSE_HEADERS = { 'Content-Type': 'application/json' };

function bufferToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

async function sha256Hex(input: string): Promise<string> {
  const normalized = input.toLowerCase().trim();
  const buf = new TextEncoder().encode(normalized);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return bufferToHex(hash);
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return bufferToHex(sig);
}

/**
 * Constant-time comparison for HMAC digests.
 * Resists timing attacks by XORing all bytes before early return.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function splitName(full: string): { fn: string; ln: string } {
  const parts = (full || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { fn: '', ln: '' };
  if (parts.length === 1) return { fn: parts[0], ln: '' };
  return { fn: parts[0], ln: parts.slice(1).join(' ') };
}

function extractPostal(deliveryJson?: string): string | null {
  if (!deliveryJson) return null;
  try {
    const d = JSON.parse(deliveryJson) as Record<string, unknown>;
    const candidate = d.postcode ?? d.postal_code ?? d.zip;
    return typeof candidate === 'string' && candidate.trim() ? candidate : null;
  } catch {
    return null;
  }
}

function safeEventId(orderNumber: string): string {
  // Drop leading # so the same event_id works for browser (GTM) and server (CAPI).
  // Trim FIRST so leading whitespace cannot protect the `#` from the regex.
  return (orderNumber || '').trim().replace(/^#/, '');
}

function parseEventTime(orderDate: string): number {
  const ts = Date.parse(orderDate);
  if (!Number.isFinite(ts)) {
    return Math.floor(Date.now() / 1000);
  }
  return Math.floor(ts / 1000);
}

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: RESPONSE_HEADERS });
}

function validateEnv(env: Env): string | null {
  if (!env.META_PIXEL_ID) return 'missing_env:META_PIXEL_ID';
  if (!env.META_ADS_TOKEN) return 'missing_env:META_ADS_TOKEN';
  if (!env.IMKER_WEBHOOK_SECRET) return 'missing_env:IMKER_WEBHOOK_SECRET';
  return null;
}

function validatePayload(raw: unknown): ImkerOrderPayload | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.order_number !== 'string' || !p.order_number.trim()) return null;
  if (typeof p.order_date !== 'string' || !p.order_date.trim()) return null;
  if (typeof p.order_total !== 'number' || !Number.isFinite(p.order_total)) return null;
  // products MUST be an array (even if empty) — we rely on .map/.reduce below
  if (!Array.isArray(p.products)) return null;
  return raw as ImkerOrderPayload;
}

async function buildMetaEvent(order: ImkerOrderPayload): Promise<MetaEvent> {
  const { fn, ln } = splitName(order.customer_name || '');

  const em = order.customer_email ? await sha256Hex(order.customer_email) : undefined;
  const phDigits = (order.phone || '').replace(/\D/g, '');
  const ph = phDigits ? await sha256Hex(phDigits) : undefined;
  const fnHashed = fn ? await sha256Hex(fn) : undefined;
  const lnHashed = ln ? await sha256Hex(ln) : undefined;

  const postal = extractPostal(order.delivery_address_json);
  const zp = postal ? await sha256Hex(postal.replace(/\s+/g, '')) : undefined;

  const externalId = order.customer_email ? await sha256Hex(order.customer_email) : undefined;

  const userData: MetaUserData = {};
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fnHashed) userData.fn = [fnHashed];
  if (lnHashed) userData.ln = [lnHashed];
  if (zp) userData.zp = [zp];
  if (externalId) userData.external_id = [externalId];
  if (order.fbp) userData.fbp = order.fbp;
  if (order.fbc) userData.fbc = order.fbc;
  if (order.client_ip) userData.client_ip_address = order.client_ip;
  if (order.client_user_agent) userData.client_user_agent = order.client_user_agent;

  const products: ImkerProduct[] = Array.isArray(order.products) ? order.products : [];
  const contentIds = products.map((prod) => prod.id || prod.name);
  const contents = products.map((prod) => ({
    id: prod.id || prod.name,
    quantity: prod.quantity,
    item_price: prod.price,
  }));
  const numItems = products.reduce((sum, prod) => sum + (Number(prod.quantity) || 0), 0);

  const customData: MetaCustomData = {
    currency: order.currency || 'PLN',
    value: order.order_total,
    content_ids: contentIds,
    content_type: 'product',
    contents,
    num_items: numItems,
    order_id: order.order_number,
  };

  return {
    event_name: 'Purchase',
    event_time: parseEventTime(order.order_date),
    event_id: safeEventId(order.order_number),
    action_source: 'website',
    event_source_url: EVENT_SOURCE_URL,
    user_data: userData,
    custom_data: customData,
  };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const envError = validateEnv(env);
  if (envError) {
    return jsonResponse({ error: envError }, 500);
  }

  // 1) HMAC verify — must run on raw body BEFORE JSON.parse (signed bytes).
  const hmacHeader =
    request.headers.get('X-Imker-Signature') || request.headers.get('X-Hub-Signature-256');
  if (!hmacHeader) {
    return jsonResponse({ error: 'missing_signature' }, 401);
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: 'invalid_body' }, 400);
  }

  const expected = await hmacSha256Hex(env.IMKER_WEBHOOK_SECRET, rawBody);
  const provided = hmacHeader.replace(/^sha256=/, '').trim();
  if (!timingSafeEqual(expected, provided)) {
    return jsonResponse({ error: 'invalid_signature' }, 401);
  }

  // 2) Parse + shape-check payload
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: 'invalid_json' }, 400);
  }

  const order = validatePayload(parsed);
  if (!order) {
    return jsonResponse({ error: 'invalid_payload_schema' }, 400);
  }

  // 3) Build Meta CAPI event (async hashing)
  const event = await buildMetaEvent(order);

  // 4) POST to Meta Graph
  const metaUrl =
    `https://graph.facebook.com/${META_GRAPH_VERSION}/${env.META_PIXEL_ID}/events` +
    `?access_token=${encodeURIComponent(env.META_ADS_TOKEN)}`;

  let metaResp: Response;
  try {
    metaResp = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'fetch_failed';
    console.error('meta-capi-purchase: Meta fetch failed', {
      event_id: event.event_id,
      message: message.substring(0, 500),
    });
    return jsonResponse(
      { ok: false, error: 'meta_unreachable', event_id: event.event_id },
      502,
    );
  }

  const metaBody = await metaResp.text();
  const responseSnippet = metaBody.substring(0, 500);

  console.log(
    'meta-capi-purchase',
    JSON.stringify({
      ok: metaResp.ok,
      meta_status: metaResp.status,
      event_id: event.event_id,
      value: order.order_total,
      meta_response: responseSnippet,
    }),
  );

  return jsonResponse(
    {
      ok: metaResp.ok,
      meta_status: metaResp.status,
      meta_response: responseSnippet,
      event_id: event.event_id,
      value: order.order_total,
    },
    metaResp.ok ? 200 : 502,
  );
};

export const onRequestGet: PagesFunction<Env> = async () => {
  return jsonResponse(
    { error: 'method_not_allowed', hint: 'POST JSON + X-Imker-Signature HMAC' },
    405,
  );
};
