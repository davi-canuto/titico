## ADDED Requirements

### Requirement: Raw buffer reading in App Router
The webhook route SHALL read the raw request body as a `Buffer` (not parsed JSON) to satisfy Stripe signature verification.

#### Scenario: Body read as raw buffer
- **WHEN** the route handler receives a POST request
- **THEN** it reads the body via `Buffer.from(await request.arrayBuffer())` before calling `stripe.webhooks.constructEvent`

### Requirement: Required metadata fields validation
The webhook handler SHALL validate that `metadata.userId` and `metadata.productId` are present in `checkout.session.completed` events before writing to the database.

#### Scenario: Missing metadata fields
- **WHEN** a `checkout.session.completed` event arrives but `metadata.userId` or `metadata.productId` is absent
- **THEN** the handler returns `400` and makes no database changes
