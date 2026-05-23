## MODIFIED Requirements

### Requirement: Public products listing
`GET /api/products` lists all active products. No authentication required. The `accessLevel` field SHALL NOT be included in the response (field removed from model).

#### Scenario: Products exist in the database
- **WHEN** any client calls `GET /api/products`
- **THEN** the response is an array of products where `active: true`, each containing `id`, `name`, `description`, and `price` (amount in centavos, currency `BRL`, formatted string `R$ X,XX`)

#### Scenario: Price formatting
- **WHEN** a product has `stripePriceId` pointing to a Stripe price
- **THEN** the price `amount`, `currency`, and `formatted` fields are derived from the Stripe price object (via Stripe SDK)

### Requirement: Product data integrity
Products are seeded/managed via Prisma and optionally synced with Stripe. Products SHALL NOT have an `accessLevel` field. Access to content is determined by the `ContentProduct` relation.

#### Scenario: Product not active
- **WHEN** a product has `active: false`
- **THEN** it is excluded from the `GET /api/products` response
