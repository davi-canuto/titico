## ADDED Requirements

### Requirement: QueryProvider wraps the app
The app SHALL provide a `QueryClient` instance to all client components via a `QueryClientProvider` mounted in the root layout. The `QueryClient` MUST be instantiated per-component-tree (not as a module-level singleton) to avoid state sharing between SSR requests.

#### Scenario: Client component accesses query cache
- **WHEN** a client component calls `useQueryClient()`
- **THEN** it receives a valid `QueryClient` instance without throwing

#### Scenario: Multiple concurrent SSR requests
- **WHEN** the server renders two requests simultaneously
- **THEN** each request has an independent `QueryClient` with no shared state

### Requirement: Typed query hooks for user data
The system SHALL expose typed React Query hooks in `src/hooks/` for client-side data that requires caching or invalidation. Each hook MUST define a stable `queryKey` array and a typed return type.

#### Scenario: useUserProgress hook
- **WHEN** a component calls `useUserProgress()`
- **THEN** it receives the user's in-progress content items, cached for `staleTime: 60000`

#### Scenario: Cache invalidation after mutation
- **WHEN** a Server Action completes successfully and the client calls `invalidateQueries`
- **THEN** affected queries re-fetch in the background without a full page reload

### Requirement: React Query Devtools in development
The system SHALL render `ReactQueryDevtools` only when `process.env.NODE_ENV === 'development'`, with no bundle impact in production.

#### Scenario: Development environment
- **WHEN** the app runs in development mode
- **THEN** the React Query Devtools panel is accessible in the browser

#### Scenario: Production environment
- **WHEN** the app runs in production mode
- **THEN** no devtools code is included in the bundle
