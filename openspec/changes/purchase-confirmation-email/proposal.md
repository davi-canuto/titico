## Why

O template de email de confirmação de compra (`purchaseConfirmationEmail`) e a função `sendPurchaseConfirmation` já existem em `src/lib/email/`. Porém nenhum lugar do código as chama — quando um usuário compra acesso, ele não recebe nenhum email de confirmação. Isso é um gap de experiência crítico: o usuário não tem registro da compra além da tela de sucesso.

## What Changes

- Chamar `sendPurchaseConfirmation(email, name, productName)` no webhook do Stripe (`checkout.session.completed`) após upsert da `Purchase` como COMPLETED
- Buscar email e nome do usuário + nome do produto via Prisma para montar o email
- O envio é fire-and-forget (não bloqueia a resposta do webhook)
- Sem mudança no template — já está correto

## Capabilities

### New Capabilities

*(nenhuma — a capacidade de envio já existe; esta change apenas conecta o trigger)*

### Modified Capabilities

- `stripe-webhook`: O handler de `checkout.session.completed` passa a disparar o email de confirmação após o upsert da Purchase. O comportamento do webhook em si (retornar `{ received: true }`) não muda.

## Impact

- `src/app/api/stripe/webhook/route.ts`: adiciona chamada a `sendPurchaseConfirmation` após upsert
- Nenhuma mudança de schema, template ou provider de email
- Depende de `RESEND_API_KEY` já configurado
