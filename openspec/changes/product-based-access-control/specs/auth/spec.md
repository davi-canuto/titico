## MODIFIED Requirements

### Requirement: Session validation
The `auth()` helper from Auth.js is used to read the session server-side. The session SHALL NOT include `accessLevel` — this field is removed from the JWT token and from the `Session` type extension. Access checks are always performed via fresh Prisma queries using `userCanAccessContent`.

#### Scenario: Valid session cookie present
- **WHEN** a request arrives with a valid `next-auth.session-token`
- **THEN** `auth()` returns the session object with `user.id`, `user.email`, `user.name`, `user.image`, and `user.role`
- **THEN** `session.user.accessLevel` SHALL NOT exist

#### Scenario: Missing or expired session cookie
- **WHEN** a request arrives without a valid cookie
- **THEN** `auth()` returns `null`

### Requirement: Google OAuth login
Auth.js v5 handles all OAuth flows. The only provider is Google. The custom sign-in page is `/login`.

#### Scenario: Unauthenticated user visits a protected route
- **WHEN** a user without a valid session hits any route matched by the middleware
- **THEN** Auth.js redirects them to `/login`

#### Scenario: User clicks "Login com Google"
- **WHEN** the user triggers the Google OAuth flow from `/login`
- **THEN** Auth.js redirects to Google, handles the callback, creates a session cookie (`next-auth.session-token`), and redirects to `/dashboard`

#### Scenario: User signs out
- **WHEN** `POST /api/auth/signout` is called
- **THEN** the session cookie is invalidated and the user is redirected to `/`
