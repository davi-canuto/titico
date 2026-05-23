## ADDED Requirements

### Requirement: Automated refund via Stripe API
The system SHALL process refunds programmatically via `stripe.refunds.create` when the user requests a refund within the 7-day window.

#### Scenario: Successful refund within window
- **WHEN** an authenticated user with a `COMPLETED` purchase within 7 days of `createdAt` submits the refund form
- **THEN** the system calls `stripe.refunds.create({ payment_intent })`, updates `Purchase.status` to `REFUNDED`, and re-renders the profile page with updated access status

#### Scenario: Refund requested outside 7-day window
- **WHEN** an authenticated user submits the refund form after 7 days from `createdAt`
- **THEN** the Server Action returns an error and no Stripe API call is made

#### Scenario: Unauthenticated refund attempt
- **WHEN** a request reaches the Server Action without a valid session
- **THEN** the action returns an error and no Stripe API call is made

#### Scenario: Refund for another user's purchase (IDOR attempt)
- **WHEN** a user submits a refund for a `purchaseId` that belongs to a different user
- **THEN** the action returns an error and no Stripe API call is made

#### Scenario: Purchase already refunded
- **WHEN** a user submits a refund for a purchase with `status: REFUNDED`
- **THEN** the action returns an error indicating the purchase was already refunded

#### Scenario: Missing stripePaymentId
- **WHEN** the purchase has `stripePaymentId: null`
- **THEN** the action returns an error; no Stripe call is made
