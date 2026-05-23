## Context

O cliente Stripe singleton já existe em `src/lib/stripe.ts`. Os modelos `Purchase` e `Product` estão no schema com `stripeSessionId @unique` como chave de idempotência. O `PlanCard` já chama `POST /api/checkout/session` e trata `{ checkoutUrl }` na resposta. A restrição principal do webhook é que o Next.js App Router consome o body como stream — a verificação de assinatura HMAC do Stripe precisa do buffer raw.

## Goals / Non-Goals

**Goals:**
- `POST /api/checkout/session` funcional com Stripe Checkout
- `POST /api/stripe/webhook` funcional com validação HMAC e upsert de Purchase
- Stripe Connect splits configuráveis por env var (zero config = sem split)
- Páginas de sucesso e cancelamento pós-checkout
- Fluxo testável localmente com `stripe listen`

**Non-Goals:**
- Criação de Stripe Products/Prices via API (preço fica no campo local `Product.price`)
- Subscription/recorrência — apenas `mode: 'payment'` (pagamento único)
- Emails pós-compra nesta change (coberto por `purchase-confirmation-email`)
- Painel de gestão de pagamentos (coberto por `stripe-webhook-ui`)

## Decisions

### Raw body para webhook — `Buffer.from(await request.arrayBuffer())`
O App Router não expõe `bodyParser: false`. Lemos o body como ArrayBuffer e convertemos para Buffer antes de passar ao `stripe.webhooks.constructEvent`. Sem middleware intermediário.

### `price_data` inline — sem Stripe Price objects
O checkout usa `price_data: { currency: 'brl', unit_amount: product.price, product_data: { name } }` em vez de um `price` (ID de Stripe Price). Elimina a necessidade de sincronizar produtos ao Stripe — o campo `stripePriceId` no schema existe mas não é usado nesta change.

### Stripe Connect — env vars, zero-config safe
```
STRIPE_DESTINATION_ACCOUNT=acct_xxx   # ausente = sem split
STRIPE_PLATFORM_FEE_PERCENT=10        # ausente = 0%
```
`buildPaymentIntentData(amount)` retorna `undefined` quando destination está ausente — checkout funciona normalmente sem configurar nada em dev. Fee é clamped a 99% para evitar erro do Stripe.

### Idempotência do webhook — upsert em `stripeSessionId`
`Purchase.stripeSessionId` é `@unique`. Webhook duplicado faz upsert silencioso sem criar registro extra.

### Páginas de checkout — Server Components simples
`/checkout/sucesso` e `/checkout/cancelado` são Server Components estáticos que exibem o status ao usuário. A confirmação real vem do webhook (não da `success_url`), então a página de sucesso apenas orienta o usuário a verificar o acesso no dashboard.

## Risks / Trade-offs

- [Webhook antes do redirect] O Stripe pode entregar `checkout.session.completed` antes do usuário chegar em `/checkout/sucesso` — a página não precisa checar o acesso em tempo real, apenas instrui o usuário → mitigado pela mensagem "Seu acesso será liberado em instantes"
- [`STRIPE_WEBHOOK_SECRET` ausente] Handler lança erro, retorna 500 → fail loud, fácil de identificar em logs
- [Race condition: compra duplicada] Dois tabs simultâneos podem criar duas sessões para o mesmo produto → o upsert no webhook garante um único `Purchase` por `stripeSessionId`; a checagem de `ALREADY_PURCHASED` em `/api/checkout/session` previne a segunda sessão se a primeira já completou
