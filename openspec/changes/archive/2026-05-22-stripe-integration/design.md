## Context

The Stripe SDK (`stripe ^22.1.1`), Prisma models (`Purchase`, `Product`, `AccessLevel`, `PurchaseStatus`), and the initialized client (`src/lib/stripe.ts`) are already in place. The three API route directories exist but contain no implementation. All behavioral requirements are captured in `openspec/specs/{checkout,stripe-webhook,products}/spec.md`.

The main technical constraint is the webhook route: Stripe signature verification requires the **raw request buffer**, which Next.js App Router parses away by default.

## Goals / Non-Goals

**Goals:**
- Implement `GET /api/products` (already done — uses local `price` field, no Stripe call)
- Implement `POST /api/checkout/session` with Stripe Connect splits via `payment_intent_data`
- Implement `POST /api/stripe/webhook` with raw buffer, HMAC validation, Purchase upsert
- Helper `buildPaymentIntentData(amountCentavos)` in `src/lib/stripe.ts` that reads env vars and returns the transfer/fee object conditionally
- Configurable per-environment via `STRIPE_DESTINATION_ACCOUNT` and `STRIPE_PLATFORM_FEE_PERCENT`

**Non-Goals:**
- UI/frontend changes — purely backend
- Seeding products to Stripe — `price` is local; `stripePriceId` is optional for now
- Subscription/recurring billing — one-time payment only
- Webhook retries or idempotency beyond Prisma upsert

## Decisions

### 1. Raw body for webhook — `Request.arrayBuffer()` + `Buffer.from()`
Next.js App Router does not expose a `bodyParser: false` escape hatch like Pages Router. Instead, read the body as `Buffer.from(await request.arrayBuffer())` and pass it directly to `stripe.webhooks.constructEvent`. This avoids any middleware interference and works with the App Router's `Request` API.

*Alternative considered*: Custom middleware to buffer the body — rejected because it adds complexity and couples the webhook to global middleware.

### 2. Auth check in checkout — `auth()` from `src/lib/auth.ts`
Use the existing `auth()` helper (Auth.js v5) to retrieve the session server-side. No middleware changes needed; the route handler calls `auth()` directly and returns 401 if no session.

### 3. Input validation — Zod inline schemas
Both `POST /api/checkout/session` and webhook parsing need validation. Use Zod inline (already a project dependency) for the checkout request body (`{ productId: z.string().min(1) }`). The webhook body is validated by Stripe SDK itself (`constructEvent` throws on any tampering).

### 4. Price in `GET /api/products` — local field, no Stripe call

`Product.price` (Int, centavos) is persisted in the DB and returned directly. `stripePriceId` exists on the model but is optional and not used for display. This avoids Stripe API latency and simplifies the products route (already implemented).

### 5. Configurable splits via Stripe Connect destination charges

Two env vars control the split per environment:

```
STRIPE_DESTINATION_ACCOUNT=acct_xxx   # Stripe connected account ID; absent = no split
STRIPE_PLATFORM_FEE_PERCENT=10        # integer 0–100; absent = 0 (no fee retained)
```

`buildPaymentIntentData(amountCentavos: number)` in `src/lib/stripe.ts`:
- If `STRIPE_DESTINATION_ACCOUNT` is unset → returns `undefined` (no split, payment hits platform account)
- If set → returns `{ transfer_data: { destination }, application_fee_amount }` where `application_fee_amount = Math.round(amount * feePercent / 100)`

The checkout session passes this as `payment_intent_data`. In dev/staging, set `STRIPE_DESTINATION_ACCOUNT` to the developer's own connected account test ID; in production, to the titico account ID. No code change between environments — only env vars differ.

*Alternative considered*: separate Stripe keys per environment — rejected because the split is about revenue routing, not about which Stripe account processes the payment.

### 6. Purchase upsert in webhook — `prisma.purchase.upsert` on `stripeSessionId`
`stripeSessionId` is `@unique` in the schema, making it the natural idempotency key. Upserting ensures duplicate webhook deliveries are safe.

## Risks / Trade-offs

- **`STRIPE_DESTINATION_ACCOUNT` não configurado em prod**: split não acontece, pagamento fica 100% na conta da plataforma → mitigado por `buildPaymentIntentData` retornar `undefined` explicitamente (comportamento seguro), com log de aviso
- **`application_fee_amount` acima do valor total**: Stripe rejeita com erro → mitigado por clampar o fee a no máximo 99% do valor no helper
- **`STRIPE_WEBHOOK_SECRET` não configurado**: handler lança erro → fail loudly no entry, log de erro claro, retorna 500 em vez de silencioso
- **`metadata.userId` / `metadata.productId` ausentes**: pode ocorrer se session foi criada fora do app → validar presença de ambos antes do write; retornar 400 se ausentes

## Migration Plan

1. Set `STRIPE_WEBHOOK_SECRET` in the deployment environment before deploying the webhook route.
2. Register `POST /api/stripe/webhook` as the webhook endpoint in the Stripe dashboard (events: `checkout.session.completed`, `charge.refunded`).
3. Deploy — no DB migration needed (schema already applied).
4. Test with `stripe listen --forward-to localhost:3000/api/stripe/webhook` locally.
