## ADDED Requirements

### Requirement: Protected dashboard routes
All routes under `/(protected)` require an active session. The middleware enforces this.

#### Scenario: Unauthenticated user hits /dashboard
- **WHEN** a user without a session navigates to `/dashboard` (or any sub-route)
- **THEN** the middleware redirects them to `/login`

### Requirement: Dashboard home
`/dashboard` is the main landing page after login. It shows the user's access status and the primary CTA.

#### Scenario: User without purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: false` visits `/dashboard`
- **THEN** they see a "Comprar acesso" CTA that links to the checkout flow

#### Scenario: User with purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: true` visits `/dashboard`
- **THEN** they see navigation to matchups and videos sections

### Requirement: Matchups dashboard page
`/dashboard/matchups` renders the matchup list (free or full, depending on access).

#### Scenario: Matchup detail
- **WHEN** the user navigates to `/dashboard/matchups/{champion}`
- **THEN** the matchup detail view is shown (fetches from `GET /api/matchups/{champion}`)

### Requirement: Videos dashboard page
`/dashboard/videos` renders the full video library. Requires active purchase.

#### Scenario: User without purchase tries to access /dashboard/videos
- **WHEN** an authenticated user with `hasAccess: false` visits `/dashboard/videos`
- **THEN** they are redirected to `/dashboard` with a "compre o acesso" message
