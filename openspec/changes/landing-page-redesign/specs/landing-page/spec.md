## ADDED Requirements

### Requirement: Public homepage replaces redirect gate
The system SHALL render a full marketing landing page at `/` instead of redirecting visitors to `/login`. Unauthenticated visitors SHALL see the full landing page. Authenticated users SHALL also see the landing page (not be redirected to `/dashboard`).

#### Scenario: Unauthenticated visitor hits /
- **WHEN** an unauthenticated user navigates to `/`
- **THEN** the landing page renders with all sections visible: Header, Hero, VideoSection, MatchupGrid, About, PricingSection, Footer

#### Scenario: Authenticated user hits /
- **WHEN** an authenticated user navigates to `/`
- **THEN** the landing page renders normally
- **THEN** the LandingHeader shows "Ir para a plataforma" button linking to `/dashboard` instead of "Entrar"

---

### Requirement: LandingHeader navigation
The system SHALL render a fixed top header on `/` with: logo "TITILTEI", anchor nav links (Matchups → `#matchups`, Sobre → `#sobre`, Planos → `#pricing`), social icon links, and a session-aware CTA button.

#### Scenario: No active session
- **WHEN** the header renders with no authenticated session
- **THEN** the CTA button reads "Entrar" and links to `/login`

#### Scenario: Active session present
- **WHEN** the header renders with an authenticated session
- **THEN** the CTA button reads "Ir para a plataforma" and links to `/dashboard`

---

### Requirement: Hero section
The system SHALL render a hero section with: Shaco splash art background (ddragon CDN), animated title "GUIA DO SHACO", rank badges, primary CTA "Ver Planos" scrolling to `#pricing`, secondary CTA "Ver Matchups Grátis" scrolling to `#matchups`, and a preview grid of matchup champion icons.

#### Scenario: Hero renders
- **WHEN** the page loads
- **THEN** the hero occupies full viewport height with Shaco splash background at reduced opacity
- **THEN** the preview grid shows 5 unlocked champion icons (ring vermelho) and 7 locked (grayscale + cadeado)

---

### Requirement: Interactive MatchupGrid with locked modal
The system SHALL render an interactive grid of all matchups (free + locked). Free matchups SHALL display a detail panel on click. Locked matchups SHALL show an animated modal with the Shaco box on click.

#### Scenario: User clicks a free matchup
- **WHEN** the user clicks a free matchup champion icon
- **THEN** a detail panel expands below the grid with: difficulty badge, estratégia list, dicas list, detalhes list

#### Scenario: User clicks a locked matchup
- **WHEN** the user clicks any locked matchup champion icon
- **THEN** a fullscreen overlay appears with the animated Shaco box (drop + shake animation)

#### Scenario: User clicks the locked modal CTA
- **WHEN** the user clicks the Shaco box inside the locked modal
- **THEN** the modal closes
- **THEN** the page scrolls smoothly to `#pricing`

---

### Requirement: Inline PricingSection
The system SHALL render a pricing section anchored at `id="pricing"` that displays all active products fetched from Prisma. Products SHALL be displayed as cards in a responsive grid (3 columns desktop, 1 column mobile). The most expensive active product SHALL receive a "POPULAR" badge and highlighted border.

#### Scenario: Products are available
- **WHEN** the PricingSection renders with active products in the database
- **THEN** each product card shows: name, description, formatted price (R$ X,XX), feature list, and CTA button
- **THEN** the highest-priced product card has a `border-[#e3001b]` border and a "POPULAR" badge

#### Scenario: No active products
- **WHEN** the database has no active products
- **THEN** the PricingSection renders an empty-state message: "Planos em breve"

---

### Requirement: PricingSection checkout CTA
The system SHALL provide a CTA button per product card that initiates the checkout flow.

#### Scenario: Unauthenticated user clicks CTA
- **WHEN** a user without a session clicks "Começar agora" on any plan card
- **THEN** the browser navigates to `/login?callbackUrl=/`

#### Scenario: Authenticated user clicks CTA
- **WHEN** a user with an active session clicks "Começar agora"
- **THEN** the button enters loading state (disabled + spinner)
- **THEN** the client calls `POST /api/checkout/session` with the `productId`
- **THEN** on success, the browser redirects to the Stripe `checkoutUrl`

#### Scenario: User already has access
- **WHEN** `POST /api/checkout/session` returns `409 ALREADY_PURCHASED`
- **THEN** the button is replaced with "Você já tem acesso" label
- **THEN** a link to `/dashboard` appears below

---

### Requirement: VideoSection and About sections
The system SHALL render a VideoSection with a YouTube iframe embed and an About section with Titiltei's bio, photo, and rank badges.

#### Scenario: VideoSection renders
- **WHEN** the page loads
- **THEN** the VideoSection renders a 16:9 iframe with the Titiltei YouTube video

#### Scenario: About renders
- **WHEN** the page loads
- **THEN** the About section shows the `/titico.jpeg` photo (from public/), bio text, and rank achievement badges

---

### Requirement: LandingFooter
The system SHALL render a footer with: logo, tagline, social links (Instagram, YouTube, TikTok, Twitch), contact email, and copyright notice.

#### Scenario: Footer renders
- **WHEN** the page loads
- **THEN** all social links open in `target="_blank" rel="noopener noreferrer"`
