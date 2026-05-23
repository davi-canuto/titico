## 1. Server Action

- [x] 1.1 Criar `src/lib/actions/refund.ts` com a Server Action `requestRefund()`
- [x] 1.2 Implementar validações no servidor: sessão autenticada, ownership do purchase, status COMPLETED, janela de 7 dias, stripePaymentId não nulo
- [x] 1.3 Chamar `stripe.refunds.create({ payment_intent: stripePaymentId })` e tratar erros do Stripe
- [x] 1.4 Atualizar `Purchase.status = REFUNDED` via Prisma após sucesso
- [x] 1.5 Chamar `revalidatePath('/dashboard/perfil')` ao final para forçar re-render

## 2. Client Component do Botão

- [x] 2.1 Criar `src/components/platform/RefundButton.tsx` como Client Component (`'use client'`)
- [x] 2.2 Usar `useTransition` para exibir estado de loading enquanto a action processa
- [x] 2.3 Exibir erro inline (ex: "Reembolso falhou — tente novamente") se a action retornar erro
- [x] 2.4 Passar `daysLeft` como prop para exibir "(X dias restantes)" no botão

## 3. Integração no Perfil

- [x] 3.1 Substituir o `<a href="mailto:...">` em `src/app/dashboard/perfil/page.tsx` pelo `<RefundButton>`
- [x] 3.2 Passar `purchaseId` e `daysLeft` como props para o `RefundButton`
