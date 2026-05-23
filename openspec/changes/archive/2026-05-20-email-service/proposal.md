## Why

A plataforma não envia nenhum email transacional hoje — usuários que se registram não recebem boas-vindas e quem compra não recebe confirmação. Com o Resend disponível como gateway, é o momento certo para construir essa camada de forma que permita trocar o provider no futuro sem alterar os call sites.

## What Changes

- Adicionar `src/lib/email/index.ts` — interface `EmailProvider` e factory `getEmailProvider()` que retorna a implementação configurada
- Adicionar `src/lib/email/providers/resend.ts` — implementação `ResendEmailProvider` usando o SDK `resend`
- Adicionar templates de email em `src/lib/email/templates/` — funções que retornam `{ subject, html }` para cada caso de uso
- Disparar email de boas-vindas no callback `signIn` do Auth.js (primeiro login)
- Disparar email de confirmação de compra no webhook do Stripe (evento `checkout.session.completed`)
- Variável de ambiente `RESEND_API_KEY` e `EMAIL_FROM` (endereço remetente)

## Capabilities

### New Capabilities

- `email-service`: Camada de envio de email com interface agnóstica de provider e implementação Resend

### Modified Capabilities

- `auth`: Disparo de email de boas-vindas no primeiro login
- `stripe-webhook`: Disparo de email de confirmação de compra após checkout completado

## Impact

- `src/lib/email/` — novo módulo (interface, providers, templates)
- `src/lib/auth.ts` — callback `signIn` para detectar primeiro login e enviar boas-vindas
- `src/app/api/stripe/webhook/route.ts` — envio de email após `checkout.session.completed`
- `package.json` — nova dependência `resend`
- `.env.local` — `RESEND_API_KEY`, `EMAIL_FROM`
