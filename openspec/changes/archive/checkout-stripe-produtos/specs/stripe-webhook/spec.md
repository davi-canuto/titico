## MODIFIED Requirements

### Requirement: Stripe webhook signature validation
`POST /api/stripe/webhook` deve validar o header `stripe-signature` antes de processar qualquer evento. O body deve ser lido como buffer raw via `Buffer.from(await request.arrayBuffer())` — nunca como JSON parsed — para que `stripe.webhooks.constructEvent` funcione corretamente.

#### Scenario: Valid signature — checkout.session.completed
- **WHEN** Stripe sends `checkout.session.completed` with valid HMAC signature
- **THEN** `metadata.userId` and `metadata.productId` are validated to be present; if absent, return `400`
- **THEN** a `Purchase` is upserted with `status: COMPLETED`, `stripeSessionId` (idempotency key), `stripePaymentId` (from `payment_intent`), `userId`, `productId`
- **THEN** the response is `200 { received: true }`

#### Scenario: Valid signature — charge.refunded
- **WHEN** Stripe sends `charge.refunded` with valid HMAC signature
- **THEN** the matching `Purchase` (by `stripePaymentId`) is updated to `status: REFUNDED`
- **THEN** the response is `200 { received: true }`

#### Scenario: Unhandled event type
- **WHEN** Stripe sends any other event type
- **THEN** the response is `200 { received: true }` — no database changes

#### Scenario: Invalid or missing stripe-signature
- **WHEN** the `stripe-signature` header is absent or tampered
- **THEN** the response is `400` — no database changes are made

#### Scenario: Raw body requirement
- **WHEN** the webhook handler reads the request body
- **THEN** it reads the raw buffer (not parsed JSON) before calling `stripe.webhooks.constructEvent`

### Requirement: Security
O `STRIPE_WEBHOOK_SECRET` env var deve estar configurado. O handler MUST retornar 500 com log de erro claro se a variável estiver ausente em runtime.
