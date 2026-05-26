## MODIFIED Requirements

### Requirement: Stripe webhook signature validation
`POST /api/stripe/webhook` must validate the `stripe-signature` header before processing any event.

#### Scenario: Valid signature — checkout.session.completed for non-PDF product
- **WHEN** Stripe sends `checkout.session.completed` with a valid HMAC signature and the product has no `downloadUrl`
- **THEN** a `Purchase` record is upserted with `status: COMPLETED`, `stripeSessionId`, `stripePaymentId`, `userId` (from `metadata.userId`), `productId` (from `metadata.productId`)
- **THEN** the response is `{ received: true }`
- **THEN** no email is sent

#### Scenario: Valid signature — checkout.session.completed for PDF product
- **WHEN** Stripe sends `checkout.session.completed` with a valid HMAC signature and the product has `downloadUrl` set
- **THEN** a `Purchase` record is upserted with `status: COMPLETED`
- **THEN** the buyer's email is resolved (from `metadata.userId` → User record, or from `session.customer_details.email` for guest)
- **THEN** `sendPdfDelivery` is called with the buyer's email, `downloadUrl`, and `downloadPassword` (if set)
- **THEN** the response is `{ received: true }`

#### Scenario: Valid signature — charge.refunded
- **WHEN** Stripe sends `charge.refunded` with a valid HMAC signature
- **THEN** the matching `Purchase` is updated to `status: REFUNDED`
- **THEN** the response is `{ received: true }`

#### Scenario: Invalid or missing stripe-signature
- **WHEN** the `stripe-signature` header is absent or tampered
- **THEN** the response is `400` — no database changes are made

#### Scenario: Raw body requirement
- **WHEN** the webhook handler reads the request body
- **THEN** it reads the **raw** buffer (not parsed JSON) to allow Stripe signature verification

#### Scenario: Email delivery failure does not affect webhook response
- **WHEN** `sendPdfDelivery` throws an error
- **THEN** the error is logged but the webhook still responds `{ received: true }` with status `200`

### Requirement: Security
The `STRIPE_WEBHOOK_SECRET` env var must be set. The handler must never trust the payload without a valid signature.
