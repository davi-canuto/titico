## Why

O catálogo de produtos foi atualizado para 5 itens distintos (PDF, Módulos, Análise de Gameplay, Coach, Acesso ao Sindicato do Titiltei), mas nenhuma rota de checkout está implementada — o botão "Garantir acesso" no `PlanCard` chama `POST /api/checkout/session` que retorna 404. As changes `stripe-integration` e `stripe-connect` planejaram essa implementação mas ficaram pendentes. Esta change consolida e implementa o fluxo completo.

## What Changes

- Implementar `POST /api/checkout/session` — cria Stripe Checkout Session usando `price_data` local, com Stripe Connect splits configuráveis por env var
- Implementar `POST /api/stripe/webhook` — valida assinatura HMAC, trata `checkout.session.completed` (upsert Purchase com `status: COMPLETED`) e `charge.refunded` (update `status: REFUNDED`)
- Adicionar helper `buildPaymentIntentData(amountCentavos)` em `src/lib/stripe.ts` — lê `STRIPE_DESTINATION_ACCOUNT` e `STRIPE_PLATFORM_FEE_PERCENT` e retorna `payment_intent_data` condicionalmente
- Criar página de sucesso `src/app/checkout/sucesso/page.tsx` — exibida após pagamento confirmado pelo Stripe
- Criar página de cancelamento `src/app/checkout/cancelado/page.tsx` — exibida quando usuário abandona o checkout
- Documentar todas as variáveis de ambiente em `.env.example`

## Capabilities

### New Capabilities

_(nenhuma nova capability — implementação das capabilities já especificadas em `checkout` e `stripe-webhook`)_

### Modified Capabilities

- `checkout`: Implementar `POST /api/checkout/session` com Stripe Connect split e `price_data` local; adicionar `success_url` e `cancel_url` apontando para as novas páginas `/checkout/sucesso` e `/checkout/cancelado`
- `stripe-webhook`: Implementar `POST /api/stripe/webhook` com validação de assinatura HMAC via `stripe.webhooks.constructEvent` usando raw body (`Buffer.from(await request.arrayBuffer())`)

## Impact

- `src/lib/stripe.ts` — adicionar `buildPaymentIntentData()`
- `src/app/api/checkout/session/route.ts` — novo POST handler
- `src/app/api/stripe/webhook/route.ts` — novo POST handler
- `src/app/checkout/sucesso/page.tsx` — nova página
- `src/app/checkout/cancelado/page.tsx` — nova página
- `.env.example` — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_DESTINATION_ACCOUNT`, `STRIPE_PLATFORM_FEE_PERCENT`
- **Depreca as changes `stripe-integration` e `stripe-connect`** (tarefas pendentes delas são cobertas aqui)
