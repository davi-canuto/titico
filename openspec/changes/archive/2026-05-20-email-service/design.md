## Context

O projeto usa Next.js App Router com Server Actions e Route Handlers. O Auth.js v5 já tem callbacks `signIn`/`jwt`. O webhook Stripe ainda não foi implementado (change `stripe-integration` está pendente). A chave Resend vive em variável de ambiente — nunca no código.

## Goals / Non-Goals

**Goals:**
- Interface `EmailProvider` com método `send({ to, subject, html })` — troca de provider requer apenas nova implementação
- Provider `ResendEmailProvider` usando o SDK oficial `resend`
- Templates HTML minimalistas inline (sem framework de templates) para: boas-vindas e confirmação de compra
- Email de boas-vindas disparado no callback `signIn` do Auth.js (somente no primeiro login — detectado por `isNewUser` flag ou ausência de `user.emailVerified`)
- Stub no webhook Stripe para confirmação de compra (o call site já estará pronto quando `stripe-integration` for implementado)

**Non-Goals:**
- Filas de retry, bounce handling, unsubscribe
- Templates em arquivos `.html` externos ou com React Email
- Múltiplos providers ativos simultaneamente
- Email de redefinição de senha (sem fluxo de credentials implementado)

## Decisions

### 1. Interface EmailProvider em vez de chamada direta ao SDK Resend
```ts
interface EmailProvider {
  send(options: { to: string; subject: string; html: string }): Promise<void>
}
```
A factory `getEmailProvider()` lê `process.env.EMAIL_PROVIDER` (default `"resend"`) e retorna a implementação. Trocar de gateway = adicionar novo arquivo em `providers/` e mudar a env var.

### 2. Templates como funções TypeScript puras
Funções em `src/lib/email/templates/` retornam `{ subject: string; html: string }`. HTML inline com estilos embutidos (compatível com clientes de email). Sem dependência de React Email ou MJML para manter o bundle leve.

### 3. Detecção de primeiro login via `isNewUser` no callback `signIn`
Auth.js passa `isNewUser: true` no evento `signIn` quando o adapter criou o usuário naquela request. Usar isso como sinal para enviar boas-vindas — evita query extra ao banco.

### 4. Envio assíncrono fire-and-forget no callback `signIn`
O callback `signIn` do Auth.js não deve bloquear o login se o email falhar. Usar `void emailProvider.send(...)` sem await — erros são logados mas não propagados.

### 5. Stub para confirmação de compra
Exportar `sendPurchaseConfirmation(email: string, productName: string)` já no módulo. O webhook Stripe chamará essa função quando for implementado — o contrato já estará definido.

## Risks / Trade-offs

- **[Fire-and-forget pode perder emails silenciosamente]** → Aceitável para MVP. Logs de erro no servidor detectam falhas. Retry/queue pode ser adicionado depois.
- **[`isNewUser` só funciona com OAuth/adapter]** → Credentials não passa `isNewUser`. Quando o fluxo de credentials for implementado, o email de boas-vindas precisará ser disparado na action de registro.
- **[HTML inline é verboso]** → Aceitável para 2 templates. Se crescer para 10+, migrar para React Email.
