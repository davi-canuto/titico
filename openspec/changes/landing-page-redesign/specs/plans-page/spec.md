## MODIFIED Requirements

### Requirement: Redirect unauthenticated users to login
The system SHALL redirect unauthenticated users to `/login` when they attempt to initiate a purchase. The `callbackUrl` SHALL point back to `/` (the landing page) so users return to the pricing section after login.

#### Scenario: Unauthenticated user clicks "Comprar" on /planos
- **WHEN** a user without a session clicks "Comprar" on any plan card on `/planos`
- **THEN** the browser navigates to `/login?callbackUrl=/planos`
- **THEN** after successful login, the user is returned to `/planos`

#### Scenario: Unauthenticated user clicks CTA on landing PricingSection
- **WHEN** a user without a session clicks a pricing CTA on the landing page `/`
- **THEN** the browser navigates to `/login?callbackUrl=/`
- **THEN** after successful login, the user is returned to `/` where they can complete the purchase
