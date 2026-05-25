## Context

Após o pagamento de coaching/análise ser confirmado (via PIX ou Stripe), o usuário agenda no Cal.com. O Cal.com dispara webhooks para eventos de booking. No admin, existe já a página `/dashboard/admin/pagamentos` como referência de padrão visual e de acesso. O model `Purchase` já existe com `stripePaymentId` necessário para o estorno.

## Goals / Non-Goals

**Goals:**
- Capturar agendamentos via webhook Cal.com e persistir no banco
- Tela admin para visualizar e agir sobre cada agendamento
- Estorno automático via Stripe com confirmação explícita no frontend
- Proteção do webhook Cal.com por verificação de assinatura HMAC

**Non-Goals:**
- Reagendamento automático — o admin marca "adiado" manualmente, o recontato é fora do sistema
- Notificações por email ao marcar status (pode ser adicionado depois)
- Paginação na tela de agendamentos (volume baixo no MVP)
- Integração bidirecional com Cal.com (cancelar via sistema cancela no Cal.com)

## Decisions

### 1. Model `Booking` separado de `Purchase`

`Booking` é ligado a `Purchase` via relação 1-to-1 opcional. `Purchase` representa o ato de pagar; `Booking` representa o ato de agendar. Separá-los permite que uma `Purchase` exista sem `Booking` (ex: PDF) e que um `Booking` seja cancelado independentemente do pagamento.

**Alternativa descartada:** adicionar campos de booking diretamente em `Purchase` — mistura conceitos e polui o model com campos nulos para produtos sem agendamento.

### 2. Webhook Cal.com com verificação HMAC

O Cal.com assina os webhooks com um secret configurável. A rota `POST /api/cal/webhook` verifica a assinatura via `x-cal-signature-256` antes de processar. Padrão idêntico ao webhook Woovi já implementado.

**Secret**: configurado via env var `CAL_WEBHOOK_SECRET`.

### 3. Estorno via `POST /api/admin/bookings/[id]/refund` — rota dedicada

O estorno é uma ação destrutiva e irreversível. Rota separada de `PATCH /status` evita que uma atualização de status acidental acione o estorno. A rota busca o `stripePaymentId` via `Purchase` ligada ao `Booking` e chama `stripe.refunds.create`.

**Alternativa descartada:** `PATCH` com `status: REFUNDED` acionando o estorno — mistura atualização de estado com efeito colateral financeiro.

### 4. Dialog de confirmação client-side com `useState`

`BookingActions.tsx` é um client component que gerencia o estado do dialog de confirmação localmente. Ao confirmar, faz `fetch` para a rota de refund e revalida a página via `router.refresh()`. Sem biblioteca de dialog — implementado com overlay e botões, seguindo o padrão do `PdfPaymentModal`.

### 5. Associação Booking ↔ Purchase via `correlationID`/`calBookingId`

O Cal.com envia `bookingId` no payload do webhook. O `Booking` armazena `calBookingId`. A associação com `Purchase` é feita pelo `attendeeEmail` + `productId` inferido do event type slug — ou diretamente se o `calBookingUid` for passado como metadata no momento do agendamento.

Para MVP: ao receber o webhook, busca a `Purchase` mais recente `COMPLETED` do attendee email para os produtos de agendamento (`prod_coaching_1x1`, `prod_analise_de_partida`) que ainda não tem `Booking` associado.

## Risks / Trade-offs

- **[Associação heurística Purchase ↔ Booking]** → Busca pela purchase mais recente pode associar errado se o cliente tiver duas compras. Mitigação: volume baixo no MVP, o admin pode corrigir manualmente via notas.
- **[Estorno parcial não suportado]** → `stripe.refunds.create` sem `amount` faz refund total. Aceitável para o MVP.
- **[Webhook Cal.com pode chegar antes da Purchase ser criada]** → Race condition entre confirmação Stripe/Woovi e agendamento Cal.com. Mitigação: criar `Booking` sem `purchaseId` se não encontrar purchase, o admin associa manualmente.
