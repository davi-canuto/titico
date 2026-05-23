## MODIFIED Requirements

### Requirement: Dashboard home
`/dashboard` é a página de destino principal após o login. Exibe as informações da sessão do usuário (nome e foto) e um botão de logout. Futuramente exibirá o status de acesso e o CTA principal.

#### Scenario: User without purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: false` visits `/dashboard`
- **THEN** they see their name and avatar, and a "Comprar acesso" CTA that links to the checkout flow

#### Scenario: User with purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: true` visits `/dashboard`
- **THEN** they see their name and avatar, and navigation to matchups and videos sections

#### Scenario: Logout
- **WHEN** an authenticated user clicks the logout button on `/dashboard`
- **THEN** the session is invalidated and the user is redirected to `/`
