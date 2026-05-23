## MODIFIED Requirements

### Requirement: Branding
The login page MUST implement the Shaco Theme visual identity with the following layout:

**Desktop (lg+):** Two-column split layout.
- Left column (50% width): Shaco splash art (`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_0.jpg`) as `object-cover`, with two gradient overlays (right-to-dark and bottom-to-dark). Tagline text anchored to the bottom-left: label "Guia Definitivo" in `#e3001b`, headline "Shaco AD" in white `font-black uppercase`, subtitle in `text-white/60`.
- Right column (flex-1): Vertically centered login card area.

**Mobile (below lg):** Single column. Left panel hidden. Text header ("Titiltei" + "Guia Definitivo" label) shown above the login card.

**Login card** (`bg-[#161616] border border-white/5 rounded-xl`):
- Brand label "Titiltei" in `#e3001b`, heading "Acesse sua conta" in white `font-black uppercase`
- Benefit list: three bullet points with `#e3001b` dot accent
- Google sign-in button: `outline` style (`border border-white/25 hover:border-white/40`), inline Google "G" SVG icon, text "Entrar com Google"
- Footer note: "Ao entrar, você concorda com os termos de uso" in `text-white/30 text-xs`

#### Scenario: Desktop layout renders split panels
- **WHEN** a user visits `/login` on a viewport ≥ 1024px
- **THEN** the left panel with Shaco splash art is visible and the right panel shows the login card

#### Scenario: Mobile layout hides splash panel
- **WHEN** a user visits `/login` on a viewport < 1024px
- **THEN** the splash panel is hidden (`hidden`) and a text header with the brand name is shown above the card

#### Scenario: Design tokens applied correctly
- **WHEN** the page renders
- **THEN** the background is `#0d0d0d`, card is `#161616`, accent color is `#e3001b`, all text uses `text-white` / `text-white/60` / `text-white/30` variants from the Shaco Theme
