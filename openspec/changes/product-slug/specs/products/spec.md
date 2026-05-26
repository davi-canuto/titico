## MODIFIED Requirements

### Requirement: Product data integrity
Products are managed via the admin panel and synced to the `Product` table. Each product SHALL have a unique `slug` field set at creation time.

#### Scenario: Product not active
- **WHEN** a product has `active: false`
- **THEN** it is excluded from the `GET /api/products` response

#### Scenario: Product created with slug
- **WHEN** an admin creates a product via the admin form
- **THEN** the product is stored with the provided `slug`, which must be unique across all products

#### Scenario: Product slug conflict
- **WHEN** an admin attempts to create or update a product with a slug already used by another product
- **THEN** the operation is rejected and the admin is shown an error
