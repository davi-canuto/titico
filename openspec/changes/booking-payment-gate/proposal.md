## Why

Os botões "Agendar" de Coaching 1:1 e Análise de Partida abrem o Cal.com diretamente, sem nenhum pagamento na frente. O Titiltei não tem garantia de que o cliente pagou antes de ocupar um slot no calendário. O pagamento precisa ser confirmado antes de liberar o agendamento.

## What Changes

- Os botões "Agendar" em `ProductsCTA` passam a abrir um modal de pagamento (PIX ou cartão) em vez de disparar o Cal.com diretamente.
- Novo componente `BookingPaymentModal` — reutiliza a lógica do `PdfPaymentModal`, mas ao detectar pagamento confirmado abre o Cal.com via `cal('modal', { calLink: slug })` em vez de exibir um download.
- **Fluxo PIX:** modal → QR code → polling detecta `COMPLETED` → abre Cal.com inline.
- **Fluxo Stripe:** modal → redirect Stripe → sucesso redireciona para `/checkout/sucesso?calSlug=<slug>` → página exibe botão "Agendar agora" que abre o Cal.com.
- A página `/checkout/sucesso` passa a detectar o param `calSlug` e renderizar a ação de agendamento em vez da mensagem genérica de acesso à plataforma.
- Os produtos `prod_coaching_1x1` e `prod_analise_de_partida` já existem no banco — nenhuma alteração de schema necessária.

## Capabilities

### New Capabilities

- `booking-payment-gate`: Modal de pagamento obrigatório antes do agendamento — suporta PIX (Woovi) e cartão (Stripe), e ao confirmar abre o Cal.com para o slot correto.

### Modified Capabilities

- `checkout`: A página `/checkout/sucesso` passa a aceitar o query param `calSlug` e exibir ação de agendamento quando presente, em vez da mensagem fixa de "Bem-vindo ao Lobby".
- `landing-page`: Os botões de Coaching e Análise em `ProductsCTA` disparam o `BookingPaymentModal` em vez de abrir o Cal.com diretamente.

## Impact

- **Novo componente:** `src/components/landing/BookingPaymentModal.tsx`
- **Modificado:** `src/components/landing/ProductsCTA.tsx` — troca `data-cal-*` por `onClick` que abre o modal
- **Modificado:** `src/app/checkout/sucesso/page.tsx` — detecta `calSlug` e renderiza botão de agendamento
- **Modificado:** `src/app/api/checkout/session/route.ts` — inclui `calSlug` no `success_url` quando o produto é coaching/análise
- Sem novas rotas de API, sem mudanças de schema
