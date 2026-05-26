## MODIFIED Requirements

### Requirement: Stripe Checkout Session creation
`POST /api/checkout/session` creates a Stripe Checkout Session and returns the redirect URL.

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

## ADDED Requirements

### Requirement: Success page PDF confirmation message
When the purchased product has a `downloadUrl`, the `/checkout/sucesso` page SHALL display a confirmation that the PDF was sent by email, without showing the download link or password directly.

#### Scenario: PDF product — show email confirmation
- **WHEN** the `session_id` resolves to a product with `downloadUrl` set
- **THEN** the success page shows a message indicating the PDF was sent to the buyer's email
- **THEN** the `downloadUrl` and `downloadPassword` are NOT rendered in the page HTML

#### Scenario: Non-PDF product — existing behavior unchanged
- **WHEN** the `session_id` resolves to a product without `downloadUrl` (coaching or membership)
- **THEN** the success page shows the existing CTA (schedule or dashboard link)
