## ADDED Requirements

### Requirement: Community page resolves without 404
The route `/dashboard/comunidade` SHALL render a page. An unauthenticated request SHALL redirect to `/login` (consistent with all dashboard routes protected by middleware).

#### Scenario: Authenticated user visits /dashboard/comunidade
- **WHEN** an authenticated user navigates to `/dashboard/comunidade`
- **THEN** the page renders without error

### Requirement: Primary Discord channel section
The page SHALL feature a prominent Discord section as the primary call-to-action. It SHALL include the server invite link, a brief description, and a "Entrar no servidor" button styled as the primary CTA.

#### Scenario: Discord link opens in new tab
- **WHEN** the user clicks "Entrar no servidor"
- **THEN** the Discord invite URL opens in a new browser tab with `rel="noopener noreferrer"`

### Requirement: Secondary channels section
The page SHALL list secondary community channels (YouTube, WhatsApp, etc.) in a grid. Each channel card SHALL include: icon, name, description, and a link button.

#### Scenario: External links open safely
- **WHEN** the user clicks any external channel link
- **THEN** it opens in a new tab with `rel="noopener noreferrer"`

### Requirement: Channel data is configurable via code constants
All channel URLs, names, descriptions, and member counts SHALL be defined in a `CHANNELS` constant at the top of the page file. No database or API is required.

#### Scenario: Developer updates a channel link
- **WHEN** a developer changes a URL in the `CHANNELS` constant and deploys
- **THEN** the updated link is reflected on the page
