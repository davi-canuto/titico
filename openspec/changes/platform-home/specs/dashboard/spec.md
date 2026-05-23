## MODIFIED Requirements

### Requirement: Dashboard home
`/dashboard` is the main landing page after login. It shows the platform home with content sections.

#### Scenario: User without purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: false` visits `/dashboard`
- **THEN** they see the hero banner and a "Comprar acesso" CTA; trail sections are hidden or show locked state

#### Scenario: User with purchase visits /dashboard
- **WHEN** an authenticated user with `hasAccess: true` visits `/dashboard`
- **THEN** they see: hero banner, "Continue assistindo" section (if any UserProgress exists), and one horizontal scroll row per active trail with PUBLISHED content

#### Scenario: Navbar visible on all dashboard routes
- **WHEN** any authenticated user is on any `/dashboard/*` route
- **THEN** the persistent navbar is rendered with logo, nav links, search bar, and user avatar

#### Scenario: ADMIN badge in navbar
- **WHEN** the authenticated user has `role: ADMIN`
- **THEN** the navbar avatar area shows a red "ADMIN" badge

## ADDED Requirements

### Requirement: Platform navbar
The navbar SHALL be rendered via `src/app/dashboard/layout.tsx` on all `/dashboard/*` routes.

#### Scenario: Navbar structure
- **WHEN** any dashboard page renders
- **THEN** the navbar shows: "Titiltei" logo (left), nav links "Início · Explorar · Comunidade" (center/left), search bar placeholder (right), user avatar with name (right)

### Requirement: Content card component
`ContentCard` SHALL display a content item with thumbnail, title, type badge, and access indicator.

#### Scenario: FREE content card
- **WHEN** a `ContentCard` renders a FREE content item
- **THEN** it shows a green "GRÁTIS" pill badge

#### Scenario: PAID content card without access
- **WHEN** a `ContentCard` renders a PAID item for a user without purchase
- **THEN** it shows a lock icon overlay on the thumbnail

### Requirement: Trail row component
`TrailRow` SHALL render a section title with red left accent and a horizontally scrollable row of `ContentCard` items.

#### Scenario: Trail row with items
- **WHEN** a trail has at least one PUBLISHED active content item
- **THEN** `TrailRow` renders the trail title and all items in a horizontally scrollable container with left/right arrow buttons on desktop
