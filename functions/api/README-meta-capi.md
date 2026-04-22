# Meta CAPI Purchase endpoint

Self-hosted Meta Conversions API Purchase endpoint running as a Cloudflare
Pages Function at `/api/meta-capi-purchase` on `pozytywniezbudowani.pl`.

Replaces the Social Elite (Stape) Global tenant pipeline that broke during
the SalesCRM migration on 2026-04-12 and that Jan cannot restore (email
thread id=23546).

## Flow

```
Imker paid order (webhook)
  -> POST https://pozytywniezbudowani.pl/api/meta-capi-purchase
       headers: X-Imker-Signature: sha256=<hex>   (HMAC-SHA256 of raw body with IMKER_WEBHOOK_SECRET)
       body:    JSON ImkerOrderPayload
  -> HMAC verify (timing-safe)
  -> SHA-256 hash em/ph/fn/ln/zp/external_id
  -> POST https://graph.facebook.com/v21.0/{META_PIXEL_ID}/events
       event_name=Purchase, event_id=<order_number without #> (dedup key)
  -> Respond 200 (or 502 if Meta failed, 401 on bad signature)
```

The `event_id` is derived from `order_number` (stripped of a leading `#`).
That is the same identifier the browser GTM Purchase tag uses, so Meta
deduplicates browser + server events on the order number.

## Environment variables (Cloudflare Pages dashboard)

Set in **Pages -> Settings -> Environment variables** for both Production
and Preview:

| Name                   | Value                                                           |
|------------------------|-----------------------------------------------------------------|
| `META_PIXEL_ID`        | `9313819978715439`                                              |
| `META_ADS_TOKEN`       | Graph API token with `ads_management` scope (rotated 2026-04-18)|
| `IMKER_WEBHOOK_SECRET` | Shared secret for HMAC signing (sync with Imker panel)          |

Values live in `data/.env` on the AIOS VPS. Never commit them.

## Wire up in Imker

Imker SalesCRM -> Ustawienia -> Webhooks -> add:

- Event: `order.paid`
- URL: `https://pozytywniezbudowani.pl/api/meta-capi-purchase`
- Signing: HMAC-SHA256, header `X-Imker-Signature: sha256=<hex>`
- Secret: paste value of `IMKER_WEBHOOK_SECRET`
- Retries: 3 with exponential backoff (Imker default is fine)
- Payload must include (at minimum): `order_number`, `order_date`,
  `customer_email`, `customer_name`, `phone`, `order_total`, `currency`,
  `products` (array). Optional: `delivery_address_json`, `fbp`, `fbc`,
  `fbclid`, `client_ip`, `client_user_agent`.

## Test curl

Run from a machine that has `openssl` and access to the webhook secret.

```bash
# 1) Prepare the body.
BODY='{"order_number":"#TEST-2026-04-22","order_date":"2026-04-22T20:00:00Z","customer_email":"test@example.com","customer_name":"Jan Testowy","phone":"+48123456789","order_total":119,"currency":"PLN","products":[{"name":"Ksiazka","price":119,"quantity":1}]}'

# 2) Sign it (reuse the secret from Imker/CF env).
SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$IMKER_WEBHOOK_SECRET" -binary | xxd -p | tr -d '\n')

# 3) POST to the endpoint.
curl -sS -X POST "https://pozytywniezbudowani.pl/api/meta-capi-purchase" \
  -H "Content-Type: application/json" \
  -H "X-Imker-Signature: sha256=$SIG" \
  -d "$BODY"
```

Expected response (200):

```json
{
  "ok": true,
  "meta_status": 200,
  "meta_response": "{\"events_received\":1,\"messages\":[],\"fbtrace_id\":\"...\"}",
  "event_id": "TEST-2026-04-22",
  "value": 119
}
```

Bad HMAC returns `401 {"error":"invalid_signature"}`. Missing env vars
return `500 {"error":"missing_env:<NAME>"}`.

## Dedup with browser GTM tag

GTM-KQL4T3DR v13 (published by Wojtek) sends the browser Purchase event
with `eventID = {{order_number}}` (same transformation: strip `#`). Meta
deduplicates within a ~48h window when `event_name`, `event_id`,
`action_source` and `event_time` align, so shipping both browser + server
is safe and actually raises EMQ (server event carries hashed customer
data the browser cannot).

## Observability

Function logs go to `wrangler tail`. A structured entry is emitted for
every request:

```
meta-capi-purchase {"ok":true,"meta_status":200,"event_id":"...","value":119,"meta_response":"..."}
```

On top of that the AIOS cron `automation/meta_purchase_dedup_monitor.py`
(WS D1) correlates Imker API orders with Meta Graph `/stats` Purchase
events every hour and alerts Telegram (Artur bot, `MONITORING` category)
when coverage falls outside the 0.8-1.2 band.

## Deploy

This file lives on branch `debug/meta-capi-purchase-2026-04-22`, **not
merged**. Artur reviews, pushes, opens a PR; CF Pages auto-deploys after
merge to `main`. Env vars must be set BEFORE merge (or the first request
will return `500 missing_env:*`).

## Related

- Plan: `builds/audyty/2026-04-22-purchase-pipeline-forensics.md` (Faza 8)
- Brief: `builds/briefs/2026-04-22-kazik-krok2-purchase-pipeline-fix.md` (WS B2)
- Browser tag: GTM-KQL4T3DR v13 (Wojtek, published 2026-04-22)
- Monitor cron: `automation/meta_purchase_dedup_monitor.py` (AIOS repo)
