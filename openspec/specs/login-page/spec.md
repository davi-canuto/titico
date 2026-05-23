## ADDED Requirements

### Requirement: Login page at /login
The `/login` page is the Auth.js custom sign-in page. It renders a single "Entrar com Google" button.

#### Scenario: Unauthenticated user is redirected here
- **WHEN** the middleware redirects to `/login`
- **THEN** the user sees the login page with the Google sign-in button

#### Scenario: User clicks "Entrar com Google"
- **WHEN** the button is clicked
- **THEN** `signIn("google")` from Auth.js is called, initiating the OAuth flow

#### Scenario: Already authenticated user visits /login
- **WHEN** a user with an active session navigates to `/login`
- **THEN** they are redirected to `/dashboard`

### Requirement: Branding
The login page must show the app name/logo ("Titiltei — Guia do Shaco AD") and match the app's visual identity.
