## ADDED Requirements

### Requirement: Route protection via Next.js middleware
The Next.js middleware SHALL enforce authentication on all protected routes. Unauthenticated requests to protected routes MUST be redirected to `/login` with a `callbackUrl` query parameter pointing to the originally requested URL.

#### Scenario: Unauthenticated user accesses /dashboard
- **WHEN** a user without a valid session requests any path under `/dashboard`
- **THEN** the middleware redirects them to `/login?callbackUrl=%2Fdashboard`

#### Scenario: Authenticated user accesses /dashboard
- **WHEN** a user with a valid session requests any path under `/dashboard`
- **THEN** the request proceeds normally to the page handler

#### Scenario: Unauthenticated user accesses a protected API route
- **WHEN** a user without a valid session requests `/api/matchups/*`, `/api/videos/*`, `/api/user/*`, or `/api/checkout/*`
- **THEN** the middleware returns a 401 or redirects to `/login`

#### Scenario: Request to a public route
- **WHEN** any request targets `/login`, `/`, or any route not in the matcher
- **THEN** the middleware does not intercept and the request proceeds normally

### Requirement: Middleware matcher configuration
The middleware matcher MUST explicitly enumerate protected route patterns. Only paths listed in the matcher config are intercepted.

#### Scenario: Matcher covers all protected routes
- **WHEN** the middleware is configured
- **THEN** the matcher includes: `/dashboard/:path*`, `/api/matchups/:path*`, `/api/videos/:path*`, `/api/user/:path*`, `/api/checkout/:path*`

#### Scenario: Auth routes excluded from matcher
- **WHEN** a request targets `/api/auth/*`
- **THEN** it is NOT intercepted by the middleware (Auth.js handles its own routing)
