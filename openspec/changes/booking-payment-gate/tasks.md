## 1. BookingPaymentModal

- [x] 1.1 Criar `src/components/landing/BookingPaymentModal.tsx` com as props `open`, `onClose`, `productId`, `calSlug`, `isAuthenticated`
- [x] 1.2 Implementar as views `buttons`, `qr`, `expired` idênticas ao `PdfPaymentModal` (PIX QR code, cópia de código, timeout de 10min)
- [x] 1.3 No polling, ao detectar `COMPLETED`, fechar o modal e abrir Cal.com via `cal('modal', { calLink: calSlug })` usando `getCalApi`
- [x] 1.4 No fluxo Stripe (`handleCard`), passar `calSlug` como parâmetro para a rota de checkout — o `success_url` incluirá o slug

## 2. Rota de Checkout Stripe

- [x] 2.1 Adicionar mapa `CAL_SLUGS: Record<string, string>` em `src/app/api/checkout/session/route.ts` com os mapeamentos `prod_coaching_1x1` e `prod_analise_de_partida` para seus slugs Cal.com
- [x] 2.2 Atualizar o body schema para aceitar `calSlug?: string` opcional
- [x] 2.3 Incluir `calSlug` no `success_url` quando presente: `...?session_id={CHECKOUT_SESSION_ID}&calSlug=<encoded>`

## 3. Página de Sucesso

- [x] 3.1 Ler `calSlug` dos `searchParams` em `src/app/checkout/sucesso/page.tsx`
- [x] 3.2 Quando `calSlug` presente, renderizar mensagem "Pagamento confirmado — clique abaixo para agendar" com botão que leva para `https://cal.com/<calSlug>` (link externo, `target="_blank"`)
- [x] 3.3 Quando `calSlug` ausente, manter o comportamento atual ("Bem-vindo ao Lobby")

## 4. ProductsCTA

- [x] 4.1 Substituir os `data-cal-*` attributes dos botões de Coaching e Análise por `onClick` que abre o `BookingPaymentModal` com o `productId` e `calSlug` corretos
- [x] 4.2 Adicionar estado `bookingModal: { open: boolean; productId: string; calSlug: string } | null` ao componente
- [x] 4.3 Renderizar `BookingPaymentModal` no final do componente (análogo ao `PdfPaymentModal`)
- [x] 4.4 Remover a inicialização do Cal.com via `getCalApi` que não é mais necessária para os botões de agendamento direto
