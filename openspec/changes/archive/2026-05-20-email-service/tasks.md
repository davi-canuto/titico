## 1. Dependência e variáveis de ambiente

- [x] 1.1 Instalar SDK: `npm install resend`
- [x] 1.2 Adicionar ao `.env.local` (se existir) ou documentar no README: `RESEND_API_KEY=<chave>` e `EMAIL_FROM=noreply@seudominio.com`

## 2. Interface e factory

- [x] 2.1 Criar `src/lib/email/index.ts` — exportar interface `EmailProvider { send(opts: { to: string; subject: string; html: string }): Promise<void> }` e factory `getEmailProvider(): EmailProvider` que lê `process.env.EMAIL_PROVIDER` (default `"resend"`) e retorna o provider correto

## 3. Provider Resend

- [x] 3.1 Criar `src/lib/email/providers/resend.ts` — classe `ResendEmailProvider` que implementa `EmailProvider`; no construtor validar que `RESEND_API_KEY` está definido; usar `new Resend(process.env.RESEND_API_KEY)` do SDK; método `send` chama `resend.emails.send({ from: process.env.EMAIL_FROM, to, subject, html })`

## 4. Templates

- [x] 4.1 Criar `src/lib/email/templates/welcome.ts` — função `welcomeEmail(name: string): { subject: string; html: string }` com HTML inline: saudação pelo nome, mensagem de boas-vindas à plataforma, link para `/dashboard`
- [x] 4.2 Criar `src/lib/email/templates/purchase-confirmation.ts` — função `purchaseConfirmationEmail(name: string, productName: string): { subject: string; html: string }` com HTML inline: confirma a compra, exibe nome do produto, link para `/dashboard`

## 5. Helpers de alto nível

- [x] 5.1 Criar `src/lib/email/send.ts` — exportar `sendWelcomeEmail(to: string, name: string): Promise<void>` e `sendPurchaseConfirmation(to: string, name: string, productName: string): Promise<void>`; ambas usam `getEmailProvider()` internamente; erros são capturados e logados (não propagados)

## 6. Integração com Auth.js

- [x] 6.1 Em `src/lib/auth.ts`, adicionar callback `signIn` que verifica `isNewUser === true` e chama `void sendWelcomeEmail(user.email, user.name ?? "")` — fire-and-forget, não bloqueia o login

## 7. Verificação

- [x] 7.1 `npx tsc --noEmit` — sem erros
- [x] 7.2 Fazer login com uma conta nova (ou simular) e verificar no painel do Resend que o email foi enviado
- [x] 7.3 Confirmar que login de conta existente não dispara email
