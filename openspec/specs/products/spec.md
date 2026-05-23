## ADDED Requirements

### Requirement: Public products listing
`GET /api/products` lists all active products. No authentication required.

#### Scenario: Products exist in the database
- **WHEN** any client calls `GET /api/products`
- **THEN** the response is an array of products where `active: true`, each containing `id`, `name`, `description`, `accessLevel`, and `price` (amount in centavos, currency `BRL`, formatted string `R$ X,XX`)

#### Scenario: Price formatting
- **WHEN** a product has `stripePriceId` pointing to a Stripe price
- **THEN** the price `amount`, `currency`, and `formatted` fields are derived from the Stripe price object (via Stripe SDK)

### Requirement: Product data integrity
Products are seeded/managed via Stripe and synced to the `Product` table.

#### Scenario: Product not active
- **WHEN** a product has `active: false`
- **THEN** it is excluded from the `GET /api/products` response
