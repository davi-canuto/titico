## Why

O app ainda não tem rotas de pagamento implementadas — usuários não conseguem comprar acesso. Além da integração básica, cada ambiente precisa rotear os pagamentos para uma conta Stripe diferente (titico em produção, conta do desenvolvedor em staging/dev), tornando o split de receita obrigatório desde o início para evitar retrabalho.

## What Changes

- Implementar `GET /api/products` — lista produtos ativos com preço local (sem chamada ao Stripe, usando `product.price` em centavos)
- Implementar `POST /api/checkout/session` — cria Stripe Checkout Session com `transfer_data.destination` (conta conectada configurada por env var) e `application_fee_amount` (percentual da plataforma configurável por env)
- Implementar `POST /api/stripe/webhook` — valida assinatura HMAC e trata `checkout.session.completed` (upsert Purchase) e `charge.refunded` (update Purchase)
- Adicionar `src/lib/stripe.ts` — cliente Stripe singleton e helpers de config de split
- Documentar variáveis de ambiente necessárias em `.env.example`

## Capabilities

### New Capabilities

- `stripe-connect-splits`: Define o contrato de roteamento de pagamentos por ambiente — como `STRIPE_DESTINATION_ACCOUNT` e `STRIPE_PLATFORM_FEE_PERCENT` são lidos e aplicados na criação da checkout session.

### Modified Capabilities

- `checkout`: O requisito de criação da Checkout Session passa a exigir `transfer_data.destination` (conta conectada) e `application_fee_amount` quando `STRIPE_DESTINATION_ACCOUNT` está configurado. O comportamento de redirect e metadata não muda.
- `products`: Com `price` local no banco, o preço não vem mais do Stripe SDK — `GET /api/products` retorna o campo `price` do Prisma diretamente, sem chamada à API Stripe.

## Impact

- `src/lib/stripe.ts` (novo): singleton Stripe + função `buildTransferData()` que lê env vars
- `src/app/api/products/route.ts` (novo): GET handler usando Prisma local
- `src/app/api/checkout/session/route.ts` (novo): POST handler com Stripe Connect
- `src/app/api/stripe/webhook/route.ts` (novo): POST handler para webhooks
- `.env.example`: adiciona `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_DESTINATION_ACCOUNT`, `STRIPE_PLATFORM_FEE_PERCENT`
- `prisma/schema.prisma`: sem mudanças (schema já está correto)
