## Why

O botão "Comprar" do card PDF Guia Shaco AD atualmente é um link estático para `/planos`. O usuário não consegue comprar diretamente pela landing — tem que navegar, encontrar o produto de novo e clicar. Além disso, o checkout atual não oferece escolha de método de pagamento: cai direto no Stripe sem selecionar Cartão ou PIX, que são os dois métodos relevantes para o público brasileiro.

## What Changes

- O card PDF em `ProductsCTA` passa de `<Link href="/planos">` para um botão que abre um modal inline
- O modal exibe duas opções: **Cartão de Crédito** e **PIX**
- Se o usuário não estiver logado, o clique redireciona para `/login` com `callbackUrl` que re-abre o fluxo ao retornar
- Se estiver logado, escolhe o método → `POST /api/checkout/session` com `paymentMethod: 'card' | 'pix'` → redirecionado para Stripe Checkout
- O endpoint `/api/checkout/session` passa a aceitar `paymentMethod` e configura `payment_method_types` no Stripe de acordo

## Capabilities

### New Capabilities

- `pdf-checkout-modal`: Modal de seleção de método de pagamento para o produto PDF, acionado direto da landing page

### Modified Capabilities

- `checkout`: Endpoint `POST /api/checkout/session` passa a aceitar campo opcional `paymentMethod: 'card' | 'pix'` e configura `payment_method_types` correspondente na sessão Stripe
- `landing-page`: Card PDF em `ProductsCTA` abre modal de pagamento em vez de navegar para `/planos`

## Impact

- `src/components/landing/ProductsCTA.tsx`: card PDF vira botão que abre modal
- Novo componente: `src/components/landing/PdfPaymentModal.tsx`
- `src/app/api/checkout/session/route.ts`: aceita `paymentMethod` opcional, define `payment_method_types`
- Requer que o produto PDF exista na tabela `Product` com `active: true`
- Sem mudança de schema Prisma
- PIX requer conta Stripe com PIX habilitado (configuração no Stripe Dashboard)
