# plans-page Specification

## Purpose
TBD - created by archiving change plans-page. Update Purpose after archive.
## Requirements
### Requirement: Public plans listing page
The system SHALL render a public `/planos` page that displays all active products fetched from `GET /api/products`, including name, description, and price formatted in BRL. No authentication is required to view the page.

#### Scenario: Products are available
- **WHEN** any visitor navigates to `/planos`
- **THEN** the page renders a card for each active product with name, description, and formatted price (e.g. `R$ 29,90`)

#### Scenario: No products available
- **WHEN** `GET /api/products` returns an empty array
- **THEN** the page renders an empty-state message: "Nenhum plano disponível no momento"

#### Scenario: Products API is unavailable
- **WHEN** `GET /api/products` returns a non-2xx response or throws
- **THEN** the page renders an error state: "Não foi possível carregar os planos. Tente novamente mais tarde"

### Requirement: Checkout initiation for authenticated users
The system SHALL allow authenticated users to start a Stripe Checkout Session directly from the `/planos` page by clicking the "Comprar" button on a product card.

#### Scenario: Authenticated user clicks "Comprar"
- **WHEN** a user with an active session clicks "Comprar" on a product card
- **THEN** the button enters a loading state (disabled, spinner visible)
- **THEN** the client calls `POST /api/checkout/session` with the `productId`
- **THEN** on success (`{ checkoutUrl }`), the browser is redirected to `checkoutUrl`

#### Scenario: API returns an error during checkout
- **WHEN** `POST /api/checkout/session` returns a non-2xx response
- **THEN** the button returns to its default state
- **THEN** an inline error message is displayed below the button: "Erro ao iniciar o pagamento. Tente novamente."

#### Scenario: User already has active access
- **WHEN** `POST /api/checkout/session` returns `409 ALREADY_PURCHASED`
- **THEN** the button is replaced with a disabled "Você já tem acesso" label in green (`#4ade80`)

### Requirement: Redirect unauthenticated users to login
The system SHALL redirect unauthenticated users to `/login` when they attempt to initiate a purchase.

#### Scenario: Unauthenticated user clicks "Comprar"
- **WHEN** a user without a session clicks "Comprar" on any plan card
- **THEN** the browser navigates to `/login?callbackUrl=/planos`
- **THEN** after successful login, the user is returned to `/planos`

### Requirement: Content gate links to plans page
The system SHALL update the "Comprar acesso" CTA on the content gate to point to `/planos`.

#### Scenario: Locked content page
- **WHEN** a user without access views a PAID content page
- **THEN** the "Comprar acesso" button links to `/planos`

