## MODIFIED Requirements

### Requirement: Stripe Checkout Session creation
`POST /api/checkout/session` creates a Stripe Checkout Session e retorna a URL de redirect. O preço é lido do campo local `Product.price` (centavos) e passado via `price_data` inline — sem Stripe Price objects. Quando `STRIPE_DESTINATION_ACCOUNT` está configurado, a sessão inclui `payment_intent_data` com Stripe Connect split.

#### Scenario: Authenticated user without existing access initiates checkout
- **WHEN** a user with `hasAccess: false` sends `POST /api/checkout/session` with a valid `productId`
- **THEN** a Stripe Checkout Session is created with `mode: payment`, `price_data` using `product.price` in BRL, `success_url: /checkout/sucesso`, `cancel_url: /checkout/cancelado`, and `metadata: { userId, productId }`
- **THEN** the response is `{ checkoutUrl, sessionId }`

#### Scenario: Stripe Connect split is active
- **WHEN** `STRIPE_DESTINATION_ACCOUNT` env var is set
- **THEN** the checkout session includes `payment_intent_data.transfer_data.destination` and `payment_intent_data.application_fee_amount` (calculated from `STRIPE_PLATFORM_FEE_PERCENT`, clamped to 0–99%)

#### Scenario: No Stripe Connect configured
- **WHEN** `STRIPE_DESTINATION_ACCOUNT` is not set
- **THEN** the checkout session is created without `payment_intent_data` — payment goes to the platform account

#### Scenario: User already has active access
- **WHEN** a user with a `Purchase` of `status: COMPLETED` attempts checkout
- **THEN** the response is `409 ALREADY_PURCHASED`

#### Scenario: Invalid productId
- **WHEN** the `productId` in the request body does not match any active `Product`
- **THEN** the response is `400 VALIDATION_ERROR`

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid session hits `POST /api/checkout/session`
- **THEN** the response is `401 UNAUTHORIZED`

## ADDED Requirements

### Requirement: Checkout success page
`/checkout/sucesso` SHALL display a confirmation to the user after Stripe redirects them post-payment.

#### Scenario: User lands on success page
- **WHEN** Stripe redirects to `/checkout/sucesso` after payment
- **THEN** the page displays a success message and instructs the user to access the dashboard
- **THEN** the page provides a link back to `/dashboard`

### Requirement: Checkout cancel page
`/checkout/cancelado` SHALL display a message when the user abandons the checkout flow.

#### Scenario: User lands on cancel page
- **WHEN** the user clicks "back" or cancels in the Stripe Checkout
- **THEN** the page displays a cancellation message and a link back to `/planos`
