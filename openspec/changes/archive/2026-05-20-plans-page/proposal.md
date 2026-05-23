## Why

Users who hit the content gate ("Conteúdo exclusivo para assinantes") have no destination to go and purchase access — there is no public-facing page listing plans and prices. Without it, the payment flow is broken end-to-end regardless of the backend being in place.

## What Changes

- Add a public route `/planos` (no auth required) that fetches and displays active products from `GET /api/products`
- Each product card shows name, description, and price formatted in BRL
- A "Comprar" button triggers `POST /api/checkout/session` and redirects to the Stripe Checkout URL
- Unauthenticated users who click "Comprar" are redirected to `/login?callbackUrl=/planos`
- The button enters a loading state during the API call and shows an inline error on failure
- The "Comprar acesso" CTA on content gate links to `/planos`

## Capabilities

### New Capabilities

- `plans-page`: Public page that displays active products with Stripe prices and initiates the checkout flow

### Modified Capabilities

*(none — products and checkout backend specs are unchanged; only a new frontend consumer is added)*

## Impact

- **New files**: `src/app/planos/page.tsx`, `src/components/platform/PlanCard.tsx`
- **Modified files**: content gate in `src/app/dashboard/conteudo/[slug]/page.tsx` — update CTA href to `/planos`
- **Dependencies**: `GET /api/products` (stripe-integration change, not yet implemented), `POST /api/checkout/session` (stripe-integration change, not yet implemented)
- **No new env vars** — relies on vars already documented in `stripe-integration`
