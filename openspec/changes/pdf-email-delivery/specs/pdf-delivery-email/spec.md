## ADDED Requirements

### Requirement: PDF delivery email template
The `pdfDeliveryEmail(downloadUrl: string, downloadPassword?: string)` function SHALL return `{ subject, html }` for the PDF delivery message sent after a confirmed purchase.

#### Scenario: Template with password
- **WHEN** `pdfDeliveryEmail("https://...", "senha123")` is called
- **THEN** the returned `html` includes the download link and the password displayed prominently

#### Scenario: Template without password
- **WHEN** `pdfDeliveryEmail("https://...")` is called with no password
- **THEN** the returned `html` includes the download link and omits any password section

### Requirement: sendPdfDelivery helper
The `sendPdfDelivery(email: string, downloadUrl: string, downloadPassword?: string)` function SHALL render `pdfDeliveryEmail` and send it via `getEmailProvider()` (fire-and-forget — caller is not blocked on delivery).

#### Scenario: Successful dispatch
- **WHEN** called with a valid email and downloadUrl
- **THEN** the email is sent via the configured provider and the promise resolves

#### Scenario: Provider error is logged, not rethrown
- **WHEN** the email provider throws
- **THEN** the error is logged to console and the function resolves without rethrowing
