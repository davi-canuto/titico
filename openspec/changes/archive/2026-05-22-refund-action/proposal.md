## Why

O botão de reembolso no perfil abre um `mailto:` que depende do usuário ter cliente de email configurado e de processamento manual pelo admin. Isso cria fricção para o usuário e trabalho operacional desnecessário — o Stripe tem API nativa para reembolso.

## What Changes

- Substituir o link `mailto:` do botão "Solicitar reembolso" por um formulário com Server Action
- Criar Server Action `requestRefund()` que chama `stripe.refunds.create({ payment_intent })` usando o `stripePaymentId` da compra
- Validar no servidor: janela de 7 dias, ownership do purchase, status COMPLETED
- Atualizar o status do Purchase para `REFUNDED` no banco após sucesso
- Exibir feedback inline na UI (estado de carregamento, sucesso, erro)

## Capabilities

### New Capabilities
- `refund-action`: Server Action para processar reembolso via Stripe API com validação de segurança e janela de 7 dias

### Modified Capabilities
- `user-profile`: A seção de status de acesso agora inclui ação de reembolso automático (não mais mailto)

## Impact

- `src/app/dashboard/perfil/page.tsx` — refatorar botão de reembolso para usar o Server Action
- `src/lib/actions/refund.ts` — novo arquivo com a Server Action
- Stripe API: `stripe.refunds.create` (sem nova dependência, já usamos o SDK)
- Prisma: `purchase.update` para `status: REFUNDED`
- Webhook existente (`charge.refunded`) continua funcionando como fallback idempotente
