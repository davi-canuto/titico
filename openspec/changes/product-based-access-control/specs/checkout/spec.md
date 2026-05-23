## MODIFIED Requirements

### Requirement: Stripe Checkout Session creation
`POST /api/checkout/session` creates a Stripe Checkout Session and returns the redirect URL.

#### Scenario: Authenticated user without existing access initiates checkout
- **WHEN** a user sends `POST /api/checkout/session` with a valid `productId` and has no `Purchase` with `status: COMPLETED` for that product
- **THEN** a Stripe Checkout Session is created with `mode: payment`, `success_url`, `cancel_url`, and `metadata.userId` + `metadata.productId`
- **THEN** the response is `{ checkoutUrl, sessionId }`

#### Scenario: User already purchased this specific product
- **WHEN** a user has a `Purchase` with `status: COMPLETED` for the given `productId`
- **THEN** the response is `409 ALREADY_PURCHASED`

#### Scenario: Invalid productId
- **WHEN** the `productId` in the request body does not match any active `Product`
- **THEN** the response is `400 VALIDATION_ERROR` with the relevant `issues` array

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid session hits `POST /api/checkout/session`
- **THEN** the middleware returns `401 UNAUTHORIZED`

### Requirement: Purchase model supports multiple purchases per user
A `User` MAY have multiple `Purchase` records, one per product purchased. The `Purchase` model SHALL enforce `@@unique([userId, productId])` to prevent duplicate purchases of the same product. `Purchase.userId` SHALL NOT be `@unique` at the field level.

#### Scenario: User purchases a second product
- **WHEN** a user who already has a `COMPLETED` purchase for product A initiates checkout for product B
- **THEN** a new `Purchase` record is created for product B without affecting the existing one

#### Scenario: Duplicate purchase attempt is rejected at DB level
- **WHEN** a race condition causes two checkout completions for the same `(userId, productId)` pair
- **THEN** the database constraint `@@unique([userId, productId])` prevents a duplicate `Purchase` record
