## ADDED Requirements

### Requirement: Concurrent Stripe price fetching
The `GET /api/products` handler SHALL fetch Stripe prices for all active products concurrently to minimize response latency.

#### Scenario: Multiple active products
- **WHEN** there are N active products in the database
- **THEN** the handler calls `stripe.prices.retrieve` for all N products via `Promise.all` (not sequentially)
- **THEN** the total Stripe API time is bounded by the slowest single call, not N × call time
