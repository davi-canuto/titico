## ADDED Requirements

### Requirement: Webhook Cal.com cria Booking automaticamente
A rota `POST /api/cal/webhook` SHALL receber eventos do Cal.com, verificar a assinatura HMAC via `CAL_WEBHOOK_SECRET`, e criar um registro `Booking` ao receber `BOOKING_CREATED`.

#### Scenario: Booking criado com sucesso
- **WHEN** Cal.com envia `BOOKING_CREATED` com payload válido e assinatura correta
- **THEN** um `Booking` é criado com `calBookingId`, `scheduledAt`, `attendeeName`, `attendeeEmail`, `status: PENDING` e associado à `Purchase` mais recente COMPLETED do mesmo email para produtos de agendamento

#### Scenario: Assinatura inválida
- **WHEN** o header `x-cal-signature-256` não corresponde ao HMAC esperado
- **THEN** a rota retorna `401 UNAUTHORIZED` sem processar o payload

#### Scenario: BOOKING_CANCELLED recebido
- **WHEN** Cal.com envia `BOOKING_CANCELLED` para um `calBookingId` existente
- **THEN** o `Booking` correspondente tem seu status atualizado para `POSTPONED`

### Requirement: Página admin lista agendamentos
A página `/dashboard/admin/agendamentos` SHALL ser acessível apenas por usuários com `role: ADMIN` e listar todos os `Booking` em ordem decrescente de `scheduledAt`.

#### Scenario: Admin acessa a página
- **WHEN** um ADMIN acessa `/dashboard/admin/agendamentos`
- **THEN** todos os bookings são listados com: nome do cliente, email, produto, data agendada, status badge e ações

#### Scenario: Não-admin redirecionado
- **WHEN** um usuário com `role: MEMBER` tenta acessar a página
- **THEN** é redirecionado para `/dashboard`

### Requirement: Admin pode marcar booking como concluído ou adiado
O admin SHALL atualizar o status de um `Booking` para `COMPLETED` ou `POSTPONED` via ação inline na listagem, sem confirmação adicional.

#### Scenario: Marcar como concluído
- **WHEN** o admin clica em "Concluído" em um booking com status `PENDING`
- **THEN** o status é atualizado para `COMPLETED` e a listagem é recarregada

#### Scenario: Marcar como adiado
- **WHEN** o admin clica em "Adiado" em um booking com status `PENDING` ou `COMPLETED`
- **THEN** o status é atualizado para `POSTPONED` e a listagem é recarregada

### Requirement: Estorno via Stripe com confirmação obrigatória
O admin SHALL poder estornar o pagamento de um booking via botão "Estornar", que abre um dialog de confirmação antes de executar.

#### Scenario: Admin confirma estorno
- **WHEN** o admin clica em "Estornar", confirma no dialog clicando em "Sim, estornar"
- **THEN** a rota `POST /api/admin/bookings/[id]/refund` é chamada, `stripe.refunds.create` é executado com o `stripePaymentId` da Purchase associada, e o status do Booking é atualizado para `REFUNDED`

#### Scenario: Admin cancela o dialog
- **WHEN** o admin clica em "Estornar" mas clica em "Cancelar" no dialog
- **THEN** nenhuma ação é executada e o dialog fecha

#### Scenario: Purchase sem stripePaymentId
- **WHEN** o booking está associado a uma Purchase sem `stripePaymentId` (ex: pagamento PIX)
- **THEN** a rota retorna erro e o admin vê mensagem "Estorno não disponível para pagamentos PIX — processe manualmente no painel Woovi"
