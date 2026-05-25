## MODIFIED Requirements

### Requirement: Login page at /login
The `/login` page is the Auth.js custom sign-in page. It renders a "Entrar com Google" button, um formulário de email/senha e um link para `/register`.

#### Scenario: Unauthenticated user is redirected here
- **WHEN** the middleware redirects to `/login`
- **THEN** the user sees the login page with the Google sign-in button, the email/password form, and a "Criar conta" link pointing to `/register`

#### Scenario: User clicks "Entrar com Google"
- **WHEN** the button is clicked
- **THEN** `signIn("google")` from Auth.js is called, initiating the OAuth flow

#### Scenario: Already authenticated user visits /login
- **WHEN** a user with an active session navigates to `/login`
- **THEN** they are redirected to `/dashboard`

#### Scenario: User clicks "Criar conta"
- **WHEN** the "Criar conta" link is clicked
- **THEN** the browser navigates to `/register`
