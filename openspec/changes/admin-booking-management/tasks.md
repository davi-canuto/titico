## 1. Schema Prisma

- [x] 1.1 Adicionar enum `BookingStatus` (`PENDING`, `COMPLETED`, `POSTPONED`, `REFUNDED`) ao `prisma/schema.prisma`
- [x] 1.2 Adicionar model `Booking` com campos: `id`, `purchaseId String? @unique`, `calBookingId String @unique`, `scheduledAt DateTime`, `attendeeName String`, `attendeeEmail String`, `status BookingStatus @default(PENDING)`, `notes String?`, `createdAt`, `updatedAt`; relações com `Purchase`
- [x] 1.3 Adicionar campo `calSlug String?` ao model `Product`
- [x] 1.4 Gerar e aplicar migration: `npx prisma migrate dev --name add-booking-model`
- [x] 1.5 Atualizar seed para incluir `calSlug` nos produtos `prod_coaching_1x1` (`davi-alessandro-fsfg2x/coach-1-1`) e `prod_analise_de_partida` (vazio por ora)

## 2. Webhook Cal.com

- [x] 2.1 Criar `src/app/api/cal/webhook/route.ts` com verificação HMAC via `CAL_WEBHOOK_SECRET` (header `x-cal-signature-256`)
- [x] 2.2 Ao receber `BOOKING_CREATED`: buscar a `Purchase` mais recente COMPLETED com o email do attendee para produtos com `calSlug` não nulo, criar `Booking` associado
- [x] 2.3 Ao receber `BOOKING_CANCELLED`: atualizar `Booking` com `calBookingId` correspondente para `status: POSTPONED`
- [x] 2.4 Adicionar `CAL_WEBHOOK_SECRET` ao `.env.local` (valor do painel Cal.com)

## 3. Rotas Admin

- [x] 3.1 Criar `src/app/api/admin/bookings/[id]/route.ts` com `PATCH` para atualizar status (`COMPLETED` ou `POSTPONED`) — protegido por `role: ADMIN`
- [x] 3.2 Criar `src/app/api/admin/bookings/[id]/refund/route.ts` com `POST` que busca `stripePaymentId` via `Purchase`, chama `stripe.refunds.create`, e atualiza `Booking.status` para `REFUNDED`
- [x] 3.3 Na rota de refund, retornar erro claro quando `stripePaymentId` for nulo (pagamento PIX)

## 4. Componente BookingActions

- [x] 4.1 Criar `src/components/admin/BookingActions.tsx` como client component com botões "Concluído", "Adiado" e "Estornar"
- [x] 4.2 Implementar dialog de confirmação de estorno inline (overlay + mensagem + botões "Sim, estornar" e "Cancelar") seguindo o padrão visual do projeto
- [x] 4.3 Ao confirmar estorno, fazer `fetch POST /api/admin/bookings/[id]/refund`, exibir erro se PIX, chamar `router.refresh()` ao sucesso
- [x] 4.4 Botões "Concluído" e "Adiado" fazem `fetch PATCH /api/admin/bookings/[id]` e chamam `router.refresh()` ao sucesso

## 5. Página Admin de Agendamentos

- [x] 5.1 Criar `src/app/dashboard/admin/agendamentos/page.tsx` com `force-dynamic`, autenticação `role: ADMIN` e query Prisma de todos os `Booking` ordenados por `scheduledAt desc` incluindo `Purchase.product`
- [x] 5.2 Implementar tabela com colunas: cliente (nome + email), produto, data agendada, status badge, ações (`BookingActions`)
- [x] 5.3 Implementar badges de status: PENDING → amarelo, COMPLETED → verde, POSTPONED → azul, REFUNDED → vermelho
- [x] 5.4 Adicionar link "Agendamentos" ao menu admin (sidebar ou header) ao lado de "Pagamentos"

## 6. Migrar calSlug do código para o banco

- [x] 6.1 Remover o mapa `CAL_SLUGS` hardcoded de `src/app/api/checkout/session/route.ts` e buscar `calSlug` do `Product` no banco
- [x] 6.2 Atualizar `src/components/landing/ProductsCTA.tsx` para buscar os produtos via API e usar o `calSlug` do banco em vez das constantes hardcoded `COACHING_SLUG` e `ANALISE_SLUG`
