## 1. Helper Stripe Connect

- [x] 1.1 Adicionar `buildPaymentIntentData(amountCentavos: number)` em `src/lib/stripe.ts` — lê `STRIPE_DESTINATION_ACCOUNT` e `STRIPE_PLATFORM_FEE_PERCENT`; retorna `undefined` se destination ausente; clampea fee a 0–99%

## 2. POST /api/checkout/session

- [x] 2.1 Criar `src/app/api/checkout/session/route.ts` com handler `POST`
- [x] 2.2 Chamar `auth()`; retornar `401` se sem sessão
- [x] 2.3 Validar body com Zod: `{ productId: z.string().min(1) }`; retornar `400 VALIDATION_ERROR` se inválido
- [x] 2.4 Buscar `Product` por `productId` where `active: true`; retornar `400 VALIDATION_ERROR` se não encontrado
- [x] 2.5 Verificar `Purchase` existente com `userId` e `status: COMPLETED`; retornar `409 ALREADY_PURCHASED` se encontrado
- [x] 2.6 Criar Stripe Checkout Session: `mode: 'payment'`, `price_data` com `product.price` em BRL, `success_url: /checkout/sucesso`, `cancel_url: /checkout/cancelado`, `metadata: { userId, productId }`
- [x] 2.7 Incluir `payment_intent_data` via `buildPaymentIntentData(product.price)` se retornar valor (omitir chave se `undefined`)
- [x] 2.8 Retornar `{ checkoutUrl: session.url, sessionId: session.id }`

## 3. POST /api/stripe/webhook

- [x] 3.1 Criar `src/app/api/stripe/webhook/route.ts` com handler `POST`
- [x] 3.2 Ler body raw: `const rawBody = Buffer.from(await request.arrayBuffer())`
- [x] 3.3 Ler header `stripe-signature`; retornar `400` se ausente
- [x] 3.4 Chamar `stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)`; capturar erro e retornar `400` em caso de assinatura inválida
- [x] 3.5 Tratar `checkout.session.completed`: validar `metadata.userId` + `metadata.productId`; upsert `Purchase` com `status: COMPLETED`, `stripeSessionId`, `stripePaymentId`, `userId`, `productId`
- [x] 3.6 Tratar `charge.refunded`: buscar `Purchase` por `stripePaymentId`; atualizar `status: REFUNDED`
- [x] 3.7 Retornar `200 { received: true }` para eventos tratados e não tratados

## 4. Páginas pós-checkout

- [x] 4.1 Criar `src/app/checkout/sucesso/page.tsx` — Server Component com mensagem de sucesso, instrução "acesso liberado em instantes" e link para `/dashboard`
- [x] 4.2 Criar `src/app/checkout/cancelado/page.tsx` — Server Component com mensagem de cancelamento e link para `/planos`
- [x] 4.3 Seguir design system: fundo `#0d0d0d`, tipografia `font-black uppercase`, botão vermelho para CTA principal

## 5. Variáveis de ambiente

- [x] 5.1 Adicionar ao `.env.example`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_DESTINATION_ACCOUNT`, `STRIPE_PLATFORM_FEE_PERCENT`

## 6. Validação

- [x] 6.1 Rodar `next build` sem erros de TypeScript
- [x] 6.2 Testar localmente com `stripe listen --forward-to localhost:3000/api/stripe/webhook` e confirmar que Purchase é criado ao completar checkout de teste
