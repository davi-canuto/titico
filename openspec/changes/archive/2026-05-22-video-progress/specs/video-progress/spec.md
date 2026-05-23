## ADDED Requirements

### Requirement: Periodic progress save while playing
The VideoPlayer SHALL save progress every 15 seconds while the video is in PLAYING state. Each save MUST include the cumulative `watchedSeconds` since playback started in this session (not just the delta).

#### Scenario: Video plays continuously for 30 seconds
- **WHEN** the video plays for 30 seconds without pause
- **THEN** two POST requests are made to `/api/contents/[slug]/progress` at ~15s and ~30s marks

#### Scenario: Video is paused before 15 seconds
- **WHEN** the video is paused before the 15-second interval fires
- **THEN** a save is triggered immediately on the PAUSE event (existing behavior preserved)

### Requirement: Resume playback from saved position
The VideoPlayer SHALL start playback at the user's previously saved position when `watchedSeconds > 0`. The position SHALL be passed via the `?start=N` query parameter in the YouTube iframe URL.

#### Scenario: User returns to a partially watched video
- **WHEN** a user opens a content page where their `UserProgress.watchedSeconds > 0`
- **THEN** the YouTube iframe loads with `?start=<watchedSeconds>` in the URL
- **AND** playback begins at approximately that position

#### Scenario: No prior progress
- **WHEN** a user opens a content page with no `UserProgress` record
- **THEN** the iframe loads without a `start` parameter (plays from the beginning)

### Requirement: Automatic completion detection
The system SHALL mark a video as completed when the user has watched ≥ 90% of the total duration. On detection, a POST request SHALL be sent with `completedAt: <ISO timestamp>`.

#### Scenario: User watches 90% or more
- **WHEN** `watchedSeconds >= 0.9 × totalDurationSeconds`
- **THEN** a POST to `/api/contents/[slug]/progress` is made with `completedAt` set to the current timestamp

#### Scenario: User watches less than 90%
- **WHEN** the session ends with `watchedSeconds < 0.9 × totalDurationSeconds`
- **THEN** no `completedAt` is sent — the content remains in progress

### Requirement: GET progress endpoint
The API SHALL expose `GET /api/contents/[slug]/progress` returning the authenticated user's progress for that content, or `null` if no record exists.

#### Scenario: Progress exists
- **WHEN** an authenticated user calls `GET /api/contents/[slug]/progress`
- **THEN** the response includes `{ watchedSeconds, completedAt }` for that content

#### Scenario: No progress yet
- **WHEN** an authenticated user calls `GET /api/contents/[slug]/progress` with no prior progress
- **THEN** the response is `{ watchedSeconds: null, completedAt: null }`

### Requirement: Progress displayed on content page
The content page SHALL display a progress bar and "Concluído" badge when the user has progress on that content.

#### Scenario: Content completed
- **WHEN** `UserProgress.completedAt` is not null
- **THEN** a green "Concluído" badge is shown next to the content title

#### Scenario: Content partially watched
- **WHEN** `UserProgress.watchedSeconds > 0` and `completedAt` is null
- **THEN** a progress bar showing percentage watched is displayed below the video

### Requirement: Manual completion button
The content page SHALL include a "Marcar como concluído" button that allows users to manually mark the content as complete regardless of watch time.

#### Scenario: User clicks "Marcar como concluído"
- **WHEN** a user clicks the button on a video they haven't watched 90%
- **THEN** a POST is made with `completedAt: now` and the UI updates to show the "Concluído" badge
