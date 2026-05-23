## MODIFIED Requirements

### Requirement: Product data integrity
Products are seeded/managed via Stripe and synced to the `Product` table. The product catalog SHALL use "Bar do Tititliei" as the platform name in all product names.

#### Scenario: Seed produces correct product names
- **WHEN** the Prisma seed is executed
- **THEN** the product previously named "Acesso ao Sindicato do Titiltei" SHALL be created as "Acesso ao Bar do Tititliei"

#### Scenario: Product not active
- **WHEN** a product has `active: false`
- **THEN** it is excluded from the `GET /api/products` response
