## MODIFIED Requirements

### Requirement: Public plans listing page
The system SHALL render a public `/planos` page that displays all active products fetched from `GET /api/products`, including name, description, and price formatted in BRL. No authentication is required to view the page. The page hero SHALL use the platform name "LOBBY DO TITILTEI". When multiple creators exist, products SHALL be grouped by creator with the creator's name as section header.

#### Scenario: Products from a single creator
- **WHEN** any visitor navigates to `/planos` and only one creator has active products
- **THEN** the page renders a card for each active product with name, description, and formatted price
- **THEN** the hero displays "LOBBY DO TITILTEI" as the platform name

#### Scenario: Products from multiple creators
- **WHEN** multiple creators have active products
- **THEN** products are grouped by creator, each group preceded by the creator's name and champion as a section header

#### Scenario: No products available
- **WHEN** `GET /api/products` returns an empty array
- **THEN** the page renders an empty-state message: "Nenhum plano disponível no momento"

#### Scenario: Products API is unavailable
- **WHEN** `GET /api/products` returns a non-2xx response or throws
- **THEN** the page renders an error state: "Não foi possível carregar os planos. Tente novamente mais tarde"
