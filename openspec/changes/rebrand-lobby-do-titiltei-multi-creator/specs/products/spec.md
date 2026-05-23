## MODIFIED Requirements

### Requirement: Public products listing
`GET /api/products` lists all active products from active creators. No authentication required. An optional query param `?creatorSlug=<slug>` filters products by creator. Without the param, all active products from all active creators are returned.

#### Scenario: All products returned without filter
- **WHEN** any client calls `GET /api/products` with no query params
- **THEN** the response is an array of all products where `active: true` and `creator.active: true`, each containing `id`, `name`, `description`, `price`, and `creator: { slug, name, champion }`

#### Scenario: Products filtered by creatorSlug
- **WHEN** a client calls `GET /api/products?creatorSlug=titiltei`
- **THEN** only products belonging to the Creator with `slug: "titiltei"` are returned

#### Scenario: Unknown creatorSlug returns empty array
- **WHEN** a client calls `GET /api/products?creatorSlug=unknown`
- **THEN** the response is an empty array (not a 404)

#### Scenario: Price formatting
- **WHEN** a product has `stripePriceId` pointing to a Stripe price
- **THEN** the price `amount`, `currency`, and `formatted` fields are derived from the Stripe price object

### Requirement: Product data integrity
Every `Product` SHALL have a `creatorId` (FK to `Creator`, non-nullable). A product without a creator cannot be created.

#### Scenario: Product not active
- **WHEN** a product has `active: false`
- **THEN** it is excluded from the `GET /api/products` response

#### Scenario: Product from inactive creator
- **WHEN** a product's creator has `active: false`
- **THEN** the product is excluded from the `GET /api/products` response
