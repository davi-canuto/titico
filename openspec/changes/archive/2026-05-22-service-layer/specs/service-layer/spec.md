## ADDED Requirements

### Requirement: Service functions receive explicit userId
All service functions that operate on user-specific data SHALL receive `userId: string` as an explicit parameter. Service functions MUST NOT call `auth()` internally — authentication is the responsibility of the caller (Server Action or Server Component).

#### Scenario: Service called from Server Action
- **WHEN** a Server Action calls `contentService.getContent(slug, userId)`
- **THEN** the service returns the correct data for that user without performing its own auth check

#### Scenario: Service called with invalid userId
- **WHEN** a service function receives a `userId` that does not exist in the database
- **THEN** it throws a `DomainError` with code `NOT_FOUND`

### Requirement: DomainError for business rule violations
The system SHALL export a `DomainError` class from `src/services/errors.ts` with typed error codes. Server Actions MUST catch `DomainError` and return structured error responses; other errors are treated as unexpected and re-thrown.

#### Scenario: Unauthorized access attempt
- **WHEN** a service function detects that the userId lacks permission for the requested operation
- **THEN** it throws `new DomainError('UNAUTHORIZED', '...')`

#### Scenario: Unknown error propagation
- **WHEN** a service function encounters a Prisma connection error
- **THEN** the error propagates unmodified (not wrapped in DomainError)

### Requirement: Server Actions are thin transport wrappers
Server Actions in `src/lib/actions/` SHALL contain only: `auth()` call, `userId` extraction, one service call, and return statement. Business logic (validation, authorization rules, DB queries) MUST live in the service layer, not in the action.

#### Scenario: Server Action structure
- **WHEN** a Server Action is invoked
- **THEN** it calls `auth()`, extracts `userId`, calls exactly one service function, and returns the result

### Requirement: Server Components use services, not Prisma directly
Server Components that fetch data SHALL import from `src/services/` instead of importing `prisma` directly. Direct Prisma imports in page components are not permitted after migration.

#### Scenario: Dashboard page data fetching
- **WHEN** the dashboard page renders
- **THEN** it imports `trailService.getActiveTrails()` and `contentService.getContinueWatching(userId)` rather than calling Prisma directly
