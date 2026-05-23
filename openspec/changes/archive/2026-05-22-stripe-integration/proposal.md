## Why

The app has Stripe SDK, Prisma models, and specs already in place but no actual API implementation — users cannot purchase access yet. This change wires up the three backend routes that complete the payment flow.

## What Changes

- Implement `GET /api/products` — lists active products with price details fetched from Stripe
- Implement `POST /api/checkout/session` — creates a Stripe Checkout Session for authenticated users and returns the redirect URL
- Implement `POST /api/stripe/webhook` — validates Stripe HMAC signatures and handles `checkout.session.completed` (upsert Purchase as COMPLETED) and `charge.refunded` (update Purchase to REFUNDED)

## Capabilities

### New Capabilities

*(none — all capabilities are already specced; this change implements them)*

### Modified Capabilities

- `checkout`: no requirement changes — implementing what is already specced
- `stripe-webhook`: no requirement changes — implementing what is already specced
- `products`: no requirement changes — implementing what is already specced

## Impact

- **New files**: `src/app/api/products/route.ts`, `src/app/api/checkout/session/route.ts`, `src/app/api/stripe/webhook/route.ts`
- **Dependencies**: `stripe` SDK (already installed), `@auth/core` session (already configured), Prisma client (already configured)
- **Env vars required**: `STRIPE_SECRET_KEY` (existing), `STRIPE_WEBHOOK_SECRET` (must be set before webhook works)
- **next.config.ts**: webhook route needs `bodyParser: false` — raw buffer required for Stripe signature verification
