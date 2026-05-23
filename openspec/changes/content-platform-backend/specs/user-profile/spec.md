## MODIFIED Requirements

### Requirement: Authenticated user profile endpoint
`GET /api/user/me` returns the authenticated user's data plus their purchase/access status and role.

#### Scenario: Authenticated user with active purchase
- **WHEN** an authenticated user with a `Purchase` of `status: COMPLETED` calls `GET /api/user/me`
- **THEN** the response includes `hasAccess: true`, the full `PurchaseSummary` object, and `role: "ADMIN"` or `role: "MEMBER"`

#### Scenario: Authenticated user without purchase
- **WHEN** an authenticated user with no `Purchase` record calls `GET /api/user/me`
- **THEN** the response includes `hasAccess: false`, `purchase: null`, and `role: "MEMBER"`

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid session hits `GET /api/user/me`
- **THEN** the middleware blocks it and returns `401 UNAUTHORIZED` before reaching the handler
