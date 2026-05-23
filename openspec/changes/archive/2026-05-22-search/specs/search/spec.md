## ADDED Requirements

### Requirement: Search API endpoint
The system SHALL expose `GET /api/search` accepting query parameters `q` (search string), `type` (ContentType enum), and `difficulty` (Difficulty enum). Authentication is NOT required. Only `status: PUBLISHED` and `active: true` content is returned. Results are limited to 50 items.

#### Scenario: Search by title
- **WHEN** `GET /api/search?q=zed` is called
- **THEN** all published active contents whose `title` contains "zed" (case-insensitive) are returned

#### Scenario: Search by champion name
- **WHEN** `GET /api/search?q=rengar` is called
- **THEN** matchup and build contents whose `champion` field contains "rengar" (case-insensitive) are included

#### Scenario: Filter by type
- **WHEN** `GET /api/search?q=&type=MATCHUP` is called
- **THEN** only `ContentType.MATCHUP` results are returned

#### Scenario: Filter by difficulty
- **WHEN** `GET /api/search?q=&difficulty=HARD` is called
- **THEN** only matchup contents with `difficulty: HARD` are returned

#### Scenario: Empty query with no filters
- **WHEN** `GET /api/search?q=` is called with no filters
- **THEN** all published active contents are returned (up to 50)

### Requirement: Search page
The system SHALL provide a page at `/dashboard/buscar` with a text input, filter chips (type, difficulty), and a results grid. The page is a Client Component that fetches results from `GET /api/search` with a 300ms debounce.

#### Scenario: User types a search query
- **WHEN** the user types in the search input
- **THEN** after 300ms of inactivity, a fetch is made to `/api/search?q=<query>`
- **AND** results are rendered as ContentCard components in a responsive grid

#### Scenario: No results
- **WHEN** the search returns an empty array
- **THEN** an empty state message is shown ("Nenhum resultado para...")

#### Scenario: Loading state
- **WHEN** a fetch is in progress
- **THEN** a loading indicator is shown and previous results remain visible until new results arrive

### Requirement: Navbar search triggers navigation
The "Buscar..." element in the Navbar SHALL become a clickable link that navigates to `/dashboard/buscar`. The search input on that page SHALL receive `autoFocus` on mount.

#### Scenario: User clicks Buscar in navbar
- **WHEN** the user clicks the "Buscar..." element in the navbar
- **THEN** they are navigated to `/dashboard/buscar` with the input focused
