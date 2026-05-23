## MODIFIED Requirements

### Requirement: Google OAuth login
Auth.js v5 handles all OAuth flows. Os providers são Google e Credentials (email/senha). A custom sign-in page é `/login`.

#### Scenario: Unauthenticated user visits a protected route
- **WHEN** a user without a valid session hits any route matched by the middleware
- **THEN** Auth.js redirects them to `/login`

#### Scenario: User clicks "Login com Google"
- **WHEN** the user triggers the Google OAuth flow from `/login`
- **THEN** Auth.js redirects to Google, handles the callback, creates a session cookie (`next-auth.session-token`), and redirects to `/dashboard`

#### Scenario: User signs out
- **WHEN** `POST /api/auth/signout` is called
- **THEN** the session cookie is invalidated and the user is redirected to `/`

## ADDED Requirements

### Requirement: Campo password no modelo User
O model `User` SHALL ter um campo `password String?` (nullable). Usuários criados via OAuth terão `password = null`. Apenas usuários criados via script admin terão senha definida.

#### Scenario: Usuário OAuth criado
- **WHEN** um usuário se cadastra via Google OAuth
- **THEN** o registro é criado com `password = null`

#### Scenario: Usuário admin criado via script
- **WHEN** o script `prisma/create-admin.ts` é executado
- **THEN** o registro é criado com `password` preenchido com hash bcrypt
