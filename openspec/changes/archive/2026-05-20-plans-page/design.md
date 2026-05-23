## Context

The app has a content gate that blocks PAID content for users without an active `Purchase`, showing a "Comprar acesso" button that currently goes nowhere. The backend routes (`GET /api/products`, `POST /api/checkout/session`) are specced in the `stripe-integration` change but not yet implemented. This design covers only the frontend surface — it assumes those routes will exist.

The page is public (no auth required to view plans) because showing pricing before requiring a login reduces drop-off. Purchase initiation requires a session, handled client-side with a redirect.

## Goals / Non-Goals

**Goals:**
- Public `/planos` page renders products with prices fetched at request time (SSR via Next.js Server Component + Client Component for interaction)
- Unauthenticated users can view plans; clicking "Comprar" redirects to `/login?callbackUrl=/planos`
- Authenticated users without access start checkout and are redirected to Stripe
- Loading and error states are visible in the UI without a full-page reload

**Non-Goals:**
- Managing subscriptions or cancellations (out of scope)
- A/B testing pricing variants
- Coupon/promo code support
- The backend routes themselves (covered by `stripe-integration`)

## Decisions

### Server Component page + Client Component card

`src/app/planos/page.tsx` is a Server Component that fetches `GET /api/products` at render time (no client-side fetch on load). The product list is passed as props to `<PlanCard>` components.

`src/components/platform/PlanCard.tsx` is a Client Component (`'use client'`) because it manages: button loading state, `fetch` call to `/api/checkout/session`, and `window.location.href` redirect.

Alternative considered: full client-side fetch with `useEffect`. Rejected because it causes layout shift on load and is harder to cache.

### Auth check on the client

The page itself is public — Next.js middleware does NOT protect `/planos`. Auth is checked inside `PlanCard` only when the user clicks "Comprar": call `fetch('/api/auth/session')` and redirect to `/login?callbackUrl=/planos` if no session. This avoids a hard dependency on session in a Server Component that must also be publicly accessible.

Alternative considered: pass `session` as a prop from the Server Component. Rejected because it would force the page to opt out of static caching and re-render on every request just to check auth.

### No success/cancel page for now

Stripe `success_url` and `cancel_url` point to `/dashboard` and `/planos` respectively. A dedicated `/planos/sucesso` page is deferred until purchase confirmation emails are validated.

## Risks / Trade-offs

- [Products fetched from Stripe on every SSR render] → Mitigation: `next: { revalidate: 60 }` on the fetch so Next.js caches the product list for 60 seconds
- [Race condition: user buys between page load and button click] → Mitigation: backend returns `409 ALREADY_PURCHASED`; card shows "Você já tem acesso" message and disables the button
- [stripe-integration routes not yet implemented] → This page depends on those routes; display a friendly error state if `GET /api/products` returns non-2xx
