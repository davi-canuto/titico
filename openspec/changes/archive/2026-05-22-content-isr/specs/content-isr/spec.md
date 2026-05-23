## ADDED Requirements

### Requirement: Content pages use Incremental Static Regeneration
Content detail pages (`/dashboard/conteudo/[slug]`) SHALL export `revalidate = 3600` to enable ISR with a 1-hour TTL. The page MUST also export `dynamicParams = true` to serve slugs not pre-generated at build time.

#### Scenario: Cached page served within TTL
- **WHEN** a user requests a content page within 1 hour of last generation
- **THEN** the response is served from CDN cache without hitting the database

#### Scenario: On-demand regeneration for new slugs
- **WHEN** a user requests a content slug that was not pre-generated at build time
- **THEN** the page is generated on-demand and cached for subsequent requests

### Requirement: Static params generated for published content
The page SHALL export `generateStaticParams()` that returns all slugs where `status = PUBLISHED AND active = true`. This pre-generates the most commonly accessed pages at build time.

#### Scenario: Build-time pre-generation
- **WHEN** `next build` runs
- **THEN** all published active content slugs are pre-rendered as static HTML

### Requirement: Admin actions trigger immediate revalidation
When admin saves or publishes content, the system SHALL call `revalidatePath('/dashboard/conteudo/[slug]')` with the affected slug to invalidate the CDN cache immediately, bypassing the 1-hour TTL.

#### Scenario: Content updated by admin
- **WHEN** an admin saves changes to a content item
- **THEN** `revalidatePath` is called with that content's slug
- **AND** the next request serves the updated content

### Requirement: User progress data is not cached
User-specific data (watch progress, completion status) SHALL never be included in the static cache. It MUST be fetched dynamically per request, separate from the static content data.

#### Scenario: Two users access the same content page
- **WHEN** user A and user B both access `/dashboard/conteudo/intro-shaco`
- **THEN** both receive the same static content HTML from cache
- **AND** each receives their own progress data dynamically
