## Why

Após o pagamento de coaching ou análise de partida ser confirmado, não há nenhuma forma do Titiltei gerenciar o ciclo de vida desses agendamentos — se a sessão foi realizada, se precisa ser adiada, ou se deve ser estornada. Tudo está invisível no sistema. É necessária uma tela de admin dedicada para acompanhar e agir sobre cada agendamento.

## What Changes

- Novo model `Booking` no Prisma: ligado à `Purchase`, com `status` enum (`PENDING`, `COMPLETED`, `POSTPONED`, `REFUNDED`), campos `scheduledAt`, `calBookingId`, `attendeeName`, `attendeeEmail` e `notes`.
- Webhook `POST /api/cal/webhook` que recebe eventos do Cal.com (`BOOKING_CREATED`, `BOOKING_CANCELLED`) e cria/atualiza registros `Booking` automaticamente.
- Página `/dashboard/admin/agendamentos` listando todos os bookings com ações inline: marcar como concluído, marcar como adiado, e estornar.
- Rota `PATCH /api/admin/bookings/[id]` para atualizar o status de um booking.
- Rota `POST /api/admin/bookings/[id]/refund` que executa o estorno via Stripe API e atualiza o status para `REFUNDED`.
- Dialog de confirmação no frontend antes de executar o estorno ("Tem certeza que deseja estornar este pagamento? Esta ação não pode ser desfeita.").

## Capabilities

### New Capabilities

- `booking-management`: CRUD de agendamentos — model Booking, webhook Cal.com, página admin com ações de status e estorno.

### Modified Capabilities

- `checkout`: O model `Purchase` passa a ter uma relação opcional com `Booking` (sem mudança de comportamento existente).

## Impact

- **Schema Prisma**: novo model `Booking`, enum `BookingStatus`, relação `Purchase → Booking`
- **Nova rota API**: `POST /api/cal/webhook`
- **Nova rota API**: `PATCH /api/admin/bookings/[id]`
- **Nova rota API**: `POST /api/admin/bookings/[id]/refund`
- **Nova página**: `src/app/dashboard/admin/agendamentos/page.tsx`
- **Novo componente client**: `src/components/admin/BookingActions.tsx` (ações inline + dialog de confirmação)
- Dependência Cal.com: secret de webhook para verificar assinatura dos eventos
