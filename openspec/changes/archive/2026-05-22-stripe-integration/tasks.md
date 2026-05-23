## 1. GET /api/products

- [x] 1.1 Create `src/app/api/products/route.ts` with a `GET` handler
- [x] 1.2 Query Prisma for all `Product` where `active: true`
- [x] 1.3 Return products with local price field (amount, currency, formatted) — no Stripe call needed
- [x] 1.4 Add `.env.example` entries: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_DESTINATION_ACCOUNT`, `STRIPE_PLATFORM_FEE_PERCENT`

## 2. Stripe Connect splits helper

- [x] 2.1 Add `buildPaymentIntentData(amountCentavos: number)` to `src/lib/stripe.ts`
  - Reads `STRIPE_DESTINATION_ACCOUNT` and `STRIPE_PLATFORM_FEE_PERCENT` from `process.env`
  - If destination is unset → returns `undefined`
  - If set → returns `{ transfer_data: { destination }, application_fee_amount }` where fee is clamped to 0–99% of amount

## 3. POST /api/checkout/session

- [x] 3.1 Create `src/app/api/checkout/session/route.ts` with a `POST` handler
- [x] 3.2 Call `auth()`; return `401` if no session
- [x] 3.3 Parse and validate request body with Zod: `{ productId: z.string().min(1) }`; return `400 VALIDATION_ERROR` if invalid
- [x] 3.4 Look up `Product` by `productId` where `active: true`; return `400 VALIDATION_ERROR` if not found
- [x] 3.5 Check for existing `Purchase` with `userId` and `status: COMPLETED`; return `409 ALREADY_PURCHASED` if found
- [x] 3.6 Call `buildPaymentIntentData(product.price)` and include result as `payment_intent_data` in the session (omit key if `undefined`)
- [x] 3.7 Create Stripe Checkout Session: `mode: 'payment'`, `line_items` with `price_data` from `product.price` (local, currency BRL), `success_url`, `cancel_url`, `metadata: { userId, productId }`
- [x] 3.8 Return `{ checkoutUrl: session.url, sessionId: session.id }`

## 4. POST /api/stripe/webhook

- [x] 4.1 Create `src/app/api/stripe/webhook/route.ts` with a `POST` handler
- [x] 4.2 Read raw body: `const rawBody = Buffer.from(await request.arrayBuffer())`
- [x] 4.3 Retrieve `stripe-signature` header; return `400` if absent
- [x] 4.4 Call `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)`; catch and return `400` on signature error
- [x] 4.5 Handle `checkout.session.completed`: validate `metadata.userId` + `metadata.productId` present; upsert `Purchase` (`status: COMPLETED`, `stripeSessionId` as idempotency key)
- [x] 4.6 Handle `charge.refunded`: find `Purchase` by `stripePaymentId`; update `status: REFUNDED`
- [x] 4.7 Return `{ received: true }` for handled events; `200` no-op for unhandled types
