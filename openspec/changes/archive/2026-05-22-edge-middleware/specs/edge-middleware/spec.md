## ADDED Requirements

### Requirement: Middleware runs on Edge Runtime
The `middleware.ts` file SHALL declare `export const config = { runtime: 'edge' }` (implicitly via Next.js conventions) and MUST NOT import any Node.js built-ins (`node:crypto`, `fs`, `path`, etc.) or the Prisma client.

#### Scenario: Edge runtime compatibility
- **WHEN** `next build` runs with the updated middleware
- **THEN** no Edge Runtime compatibility errors are thrown

### Requirement: Middleware protects dashboard routes via JWT verification
The middleware SHALL intercept all requests matching `/dashboard/:path*` and verify the presence of a valid Auth.js JWT token. Requests without a valid token MUST be redirected to `/login`.

#### Scenario: Unauthenticated request to protected route
- **WHEN** a user without a session token requests `/dashboard`
- **THEN** they are redirected to `/login`

#### Scenario: Authenticated request passes through
- **WHEN** a user with a valid JWT requests `/dashboard`
- **THEN** the request proceeds to the page handler without redirect

### Requirement: Auth configuration is split for Edge compatibility
The system SHALL maintain two auth configuration files:
- `src/lib/auth.config.ts`: providers and callbacks only, no Prisma imports — safe for Edge
- `src/lib/auth.ts`: extends auth.config, adds Prisma adapter — Node.js only

The middleware MUST import only from `auth.config.ts`.

#### Scenario: Middleware import graph
- **WHEN** the middleware module graph is analyzed
- **THEN** no Prisma-related imports appear in the middleware bundle

### Requirement: Public routes are excluded from middleware
The following routes SHALL NOT be intercepted by the middleware: `/`, `/login`, `/planos`, `/api/auth/:path*`, `/_next/:path*`, static assets.

#### Scenario: Public page accessed without session
- **WHEN** an unauthenticated user requests `/planos`
- **THEN** the page renders normally without redirect
