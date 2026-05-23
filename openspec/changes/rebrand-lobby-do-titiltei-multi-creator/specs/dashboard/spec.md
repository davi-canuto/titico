## MODIFIED Requirements

### Requirement: Dashboard home
`/dashboard` is the main landing page after login. It shows the user's access status, displays "Lobby do Titiltei" as the platform heading, and the primary CTA.

#### Scenario: User without purchase visits /dashboard
- **WHEN** an authenticated user with no active purchases visits `/dashboard`
- **THEN** they see a "Comprar acesso" CTA that links to `/planos`
- **THEN** the heading references "Lobby do Titiltei"

#### Scenario: User with purchase visits /dashboard
- **WHEN** an authenticated user with at least one active purchase visits `/dashboard`
- **THEN** they see navigation to matchups and videos sections
- **THEN** the heading references "Lobby do Titiltei"
