## MODIFIED Requirements

### Requirement: Public plans listing page
The system SHALL render a public `/planos` page that displays all active products fetched from `GET /api/products`, including name, description, and price formatted in BRL. No authentication is required to view the page. The page hero SHALL use the platform name "SINDICATO DO TITILTEI" and describe the full product catalog (PDF, módulos, análise, coaching, acesso).

#### Scenario: Products are available
- **WHEN** any visitor navigates to `/planos`
- **THEN** the page renders a card for each active product with name, description, and formatted price (e.g. `R$ 29,90`)
- **THEN** the hero displays "SINDICATO DO TITILTEI" as the platform name

#### Scenario: No products available
- **WHEN** `GET /api/products` returns an empty array
- **THEN** the page renders an empty-state message: "Nenhum plano disponível no momento"

#### Scenario: Products API is unavailable
- **WHEN** `GET /api/products` returns a non-2xx response or throws
- **THEN** the page renders an error state: "Não foi possível carregar os planos. Tente novamente mais tarde"
