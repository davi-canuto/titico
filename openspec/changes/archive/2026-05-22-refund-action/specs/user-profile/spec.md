## MODIFIED Requirements

### Requirement: Authenticated user profile endpoint
`GET /api/user/me` returns the authenticated user's data plus their purchase/access status.

#### Scenario: Authenticated user with active purchase
- **WHEN** an authenticated user with a `Purchase` of `status: COMPLETED` calls `GET /api/user/me`
- **THEN** the response includes `hasAccess: true` and the full `PurchaseSummary` object

#### Scenario: Authenticated user without purchase
- **WHEN** an authenticated user with no `Purchase` record calls `GET /api/user/me`
- **THEN** the response includes `hasAccess: false` and `purchase: null`

#### Scenario: Unauthenticated request
- **WHEN** a request without a valid session hits `GET /api/user/me`
- **THEN** the middleware blocks it and returns `401 UNAUTHORIZED` before reaching the handler

## ADDED Requirements

### Requirement: Refund action button on profile
The profile page SHALL display an interactive refund button (not a mailto link) that submits a Server Action.

#### Scenario: Button shown within refund window
- **WHEN** the user's purchase `createdAt` is within 7 days
- **THEN** the profile shows an active "Solicitar reembolso (X dias restantes)" button

#### Scenario: Button disabled after refund window
- **WHEN** the user's purchase `createdAt` is more than 7 days ago
- **THEN** the profile shows a disabled "Prazo de reembolso encerrado" indicator

#### Scenario: Loading state during refund submission
- **WHEN** the user clicks the refund button
- **THEN** the button shows a loading indicator while the Server Action is processing

#### Scenario: Success state after refund
- **WHEN** the Server Action completes successfully
- **THEN** the profile page re-renders showing `status: REFUNDED` and no active access
