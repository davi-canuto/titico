## MODIFIED Requirements

### Requirement: Public products listing
`GET /api/products` lists all active products. No authentication required. The product catalog SHALL consist of the 5 official products: PDF, Módulos, Análise de Gameplay, Coach, e Acesso ao Sindicato do Titiltei.

#### Scenario: Products exist in the database
- **WHEN** any client calls `GET /api/products`
- **THEN** the response is an array of the 5 active products, each containing `id`, `name`, `description`, `accessLevel`, and `price` (amount in centavos, currency `BRL`, formatted string)

#### Scenario: Product not active
- **WHEN** a product has `active: false`
- **THEN** it is excluded from the `GET /api/products` response

### Requirement: Product seed
The `prisma/seed.ts` SHALL delete all existing products and create the 5 official products with the correct `name`, `description`, `price`, and `accessLevel`. Seed is authoritative for dev/staging; production requires a separate data migration.

#### Scenario: Seed runs successfully
- **WHEN** `npx prisma db seed` is executed in a clean dev environment
- **THEN** exactly 5 products exist in the database with the names: PDF, Módulos, Análise de Gameplay, Coach, Acesso ao Sindicato do Titiltei
