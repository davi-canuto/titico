## ADDED Requirements

### Requirement: Checkout request body validation
The `POST /api/checkout/session` handler SHALL validate the request body with Zod before touching Stripe or the database.

#### Scenario: Missing productId field
- **WHEN** the request body omits `productId` or passes an empty string
- **THEN** the response is `400 VALIDATION_ERROR` with a `issues` array describing the missing field

#### Scenario: Valid productId type
- **WHEN** the request body contains `productId` as a non-empty string
- **THEN** validation passes and the handler proceeds to look up the product
