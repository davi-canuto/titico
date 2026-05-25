## MODIFIED Requirements

### Requirement: Stripe Checkout Session creation
`POST /api/checkout/session` cria uma Stripe Checkout Session para pagamentos com **cartão de crédito** e retorna a URL de redirect. PIX é tratado por `POST /api/checkout/pix` — este endpoint não aceita mais `paymentMethod` como parâmetro.

#### Scenario: Authenticated user without existing access initiates checkout
- **WHEN** a user with `hasAccess: false` sends `POST /api/checkout/session` with a valid `productId`
- **THEN** a Stripe Checkout Session is created with `mode: payment`, `success_url`, `cancel_url`, and `metadata.userId` + `metadata.productId`
- **THEN** the response is `{ checkoutUrl, sessionId }`

#### Scenario: User already has active access
- **WHEN** a user with a `Purchase` of `status: COMPLETED` attempts checkout
- **THEN** the response is `409 ALREADY_PURCHASED`

#### Scenario: Invalid productId
- **WHEN** the `productId` in the request body does not match any active `Product`
- **THEN** the response is `400 VALIDATION_ERROR` with the relevant `issues` array

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid session hits `POST /api/checkout/session`
- **THEN** the middleware returns `401 UNAUTHORIZED`
