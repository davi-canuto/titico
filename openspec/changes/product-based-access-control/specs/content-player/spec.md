## MODIFIED Requirements

### Requirement: Content player page
The page at `/dashboard/conteudo/[slug]` SHALL display content detail appropriate to its `ContentType`. Access is determined by `userCanAccessContent(userId, contentId)` — not by comparing `accessLevel` fields. The page is a Server Component that fetches content via Prisma and passes data to type-specific sub-components.

#### Scenario: User visits a VIDEO content page with access
- **WHEN** an authenticated user who has purchased an associated product visits a PUBLISHED VIDEO content page
- **THEN** a YouTube iframe embed is shown using the `video.youtubeId` value

#### Scenario: User visits a free VIDEO content page
- **WHEN** an authenticated user visits a PUBLISHED VIDEO content page that has no associated products
- **THEN** a YouTube iframe embed is shown without any purchase check

#### Scenario: User visits a product-gated content page without access
- **WHEN** an authenticated user without a matching `Purchase` visits a product-gated content page
- **THEN** a locked overlay is shown with a "Comprar acesso" CTA; content title and thumbnail are visible but the content itself is not

#### Scenario: Content not found or not published
- **WHEN** the slug does not match any PUBLISHED active content
- **THEN** Next.js `notFound()` is called and a 404 page is rendered

### Requirement: Per-type content rendering
Each `ContentType` SHALL have a dedicated display:
- `VIDEO`: YouTube iframe embed via `VideoPlayer` client component
- `MATCHUP`: champion name, difficulty badge, tips list, strategy text, item suggestions
- `BUILD`: champion name, items grid, runes list, notes
- `ARTICLE`: full article body rendered as prose
- `PDF`: download/view link with file size if available

#### Scenario: MATCHUP content renders champion info
- **WHEN** a user visits a MATCHUP content page
- **THEN** the champion name, difficulty badge (colored by EASY/MEDIUM/HARD), tips, and strategy are displayed

#### Scenario: BUILD content renders items and runes
- **WHEN** a user visits a BUILD content page
- **THEN** the items list and runes list are displayed with the build notes

### Requirement: Video progress recording
The `VideoPlayer` client component SHALL record watch progress by POSTing to `POST /api/contents/[slug]/progress`.

#### Scenario: Progress recorded on video play
- **WHEN** the user starts playing a video (YouTube `onStateChange` event = PLAYING)
- **THEN** a POST is sent to `/api/contents/[slug]/progress` with `{ watchedSeconds: 0 }` to mark it as started

#### Scenario: Progress updated on page unload
- **WHEN** the user leaves the player page after watching
- **THEN** a POST is sent with the elapsed `watchedSeconds` so "Continue assistindo" reflects the position

### Requirement: Content page breadcrumb / back navigation
The player page SHALL show a back link to `/dashboard` or the referring trail/explorar page.

#### Scenario: Back link is always visible
- **WHEN** a user is on any content player page
- **THEN** a back navigation link is visible at the top of the page
