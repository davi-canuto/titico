## MODIFIED Requirements

### Requirement: Content access control
Members MAY access content based on their `accessLevel`. Admin bypasses all access checks. Unauthenticated users MAY access truncated previews via `/preview/[contentId]` without bypassing this requirement — the preview endpoint is a separate surface that intentionally withholds full content.

#### Scenario: FREE content — any authenticated member
- **WHEN** an authenticated user requests a `Content` with `accessLevel: FREE`
- **THEN** the full content and meta are returned regardless of purchase status

#### Scenario: PAID content — member without active purchase
- **WHEN** an authenticated user without a `Purchase` of `status: COMPLETED` requests a `Content` with `accessLevel: PAID`
- **THEN** the response is `403 FORBIDDEN` with `{ code: "ACCESS_DENIED" }`

#### Scenario: PAID content — member with active purchase
- **WHEN** an authenticated user with `Purchase.status: COMPLETED` requests any `Content`
- **THEN** the full content and meta are returned

#### Scenario: DRAFT content hidden from members
- **WHEN** a member requests a `Content` with `status: DRAFT`
- **THEN** the response is `404 NOT_FOUND`

#### Scenario: Unauthenticated request to /api/contents/[slug]
- **WHEN** an unauthenticated request hits `GET /api/contents/[slug]`
- **THEN** the response is `401 UNAUTHORIZED` (unchanged behavior — preview uses Server Component, not this endpoint)
