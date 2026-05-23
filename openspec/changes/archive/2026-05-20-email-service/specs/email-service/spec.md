## ADDED Requirements

### Requirement: EmailProvider interface
The system SHALL expose an `EmailProvider` interface with a single `send` method, and a `getEmailProvider()` factory that returns the configured implementation based on `process.env.EMAIL_PROVIDER`.

#### Scenario: Default provider is Resend
- **WHEN** `EMAIL_PROVIDER` is unset or set to `"resend"`
- **THEN** `getEmailProvider()` returns a `ResendEmailProvider` instance

#### Scenario: Provider swap via environment variable
- **WHEN** a new provider is added and `EMAIL_PROVIDER` is set to its key
- **THEN** `getEmailProvider()` returns the new provider without changing call sites

### Requirement: ResendEmailProvider
`ResendEmailProvider` SHALL implement `EmailProvider` using the `resend` npm package and the `RESEND_API_KEY` environment variable.

#### Scenario: Successful send
- **WHEN** `send({ to, subject, html })` is called with valid inputs and `RESEND_API_KEY` is set
- **THEN** the email is dispatched via Resend API and the promise resolves

#### Scenario: Missing API key
- **WHEN** `RESEND_API_KEY` is not set
- **THEN** an error is thrown at instantiation time (fail fast)

### Requirement: Welcome email template
The `welcomeEmail(name: string)` function SHALL return `{ subject, html }` for a welcome message sent after first login.

#### Scenario: Template output
- **WHEN** `welcomeEmail("Davi")` is called
- **THEN** the returned `subject` mentions the platform name and the `html` greets the user by name

### Requirement: Purchase confirmation email template
The `purchaseConfirmationEmail(name: string, productName: string)` function SHALL return `{ subject, html }` confirming a successful purchase.

#### Scenario: Template output
- **WHEN** `purchaseConfirmationEmail("Davi", "Titico Pro")` is called
- **THEN** the returned `subject` confirms the purchase and the `html` includes the product name

### Requirement: Welcome email on first login
Auth.js `signIn` callback SHALL send a welcome email when `isNewUser` is `true`.

#### Scenario: First OAuth login triggers welcome email
- **WHEN** a user completes OAuth for the first time (`isNewUser: true`)
- **THEN** `welcomeEmail` is rendered and sent to the user's email address (fire-and-forget — login is not blocked on email delivery)

#### Scenario: Returning user does not receive welcome email
- **WHEN** a returning user logs in (`isNewUser` is falsy)
- **THEN** no email is sent

### Requirement: Purchase confirmation on checkout
`sendPurchaseConfirmation(email, productName)` SHALL be a ready-to-call helper that renders `purchaseConfirmationEmail` and sends it via `getEmailProvider()`.

#### Scenario: Called from Stripe webhook
- **WHEN** `sendPurchaseConfirmation` is called with a valid email and product name
- **THEN** the confirmation email is dispatched (fire-and-forget)
