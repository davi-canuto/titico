## MODIFIED Requirements

### Requirement: Dashboard home
`/dashboard` is the main landing page after login. It shows the user's access status and the primary CTA.

#### Scenario: User without purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: false` visits `/dashboard`
- **THEN** they see a "Comprar acesso" CTA that links to the checkout flow

#### Scenario: User with purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: true` visits `/dashboard`
- **THEN** they see the content platform home: active trails and recent published content fetched from `GET /api/trails` and `GET /api/contents`
