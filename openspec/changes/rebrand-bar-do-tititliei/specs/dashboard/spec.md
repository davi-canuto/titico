## MODIFIED Requirements

### Requirement: Dashboard home
`/dashboard` is the main landing page after login. It shows the user's access status, displays "Bar do Tititliei" as the platform heading, and the primary CTA.

#### Scenario: User without purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: false` visits `/dashboard`
- **THEN** they see a "Comprar acesso" CTA that links to the checkout flow
- **THEN** the heading references "Bar do Tititliei"

#### Scenario: User with purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: true` visits `/dashboard`
- **THEN** they see navigation to matchups and videos sections
- **THEN** the heading references "Bar do Tititliei"
