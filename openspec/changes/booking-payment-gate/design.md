## Context

Hoje os botões "Agendar" disparam o Cal.com via `data-cal-*` attributes diretamente, sem barreira de pagamento. O `PdfPaymentModal` já resolve o problema equivalente para o PDF — modal com PIX/cartão e ação pós-pagamento. O objetivo é replicar esse padrão para os produtos de agendamento, com a diferença de que a ação pós-pagamento é abrir o Cal.com em vez de exibir um download.

O desafio central é que PIX e Stripe têm fluxos diferentes pós-pagamento:
- **PIX**: tudo acontece na mesma página (polling inline)
- **Stripe**: redirect externo → volta para `/checkout/sucesso`

## Goals / Non-Goals

**Goals:**
- Bloquear o agendamento até o pagamento ser confirmado
- Suportar PIX e cartão para coaching e análise
- Após PIX confirmado, abrir Cal.com inline sem redirect
- Após Stripe confirmado, oferecer botão de agendamento na página de sucesso
- Reutilizar ao máximo a lógica do `PdfPaymentModal`

**Non-Goals:**
- Verificar se o usuário já pagou e tem direito a mais agendamentos (fora de escopo)
- Webhook de cancelamento de agendamento com estorno
- Integração Cal.com ↔ banco de dados local

## Decisions

### 1. Novo componente `BookingPaymentModal` em vez de generalizar o `PdfPaymentModal`

Os dois modais compartilham 80% da lógica (PIX QR code, polling, Stripe redirect), mas a ação pós-pagamento é diferente. Generalizar com props `onSuccess` tornaria o `PdfPaymentModal` mais complexo sem ganho real — é melhor um componente dedicado que pode evoluir independentemente.

**Alternativa descartada:** prop `mode: 'pdf' | 'booking'` no modal existente — aumenta acoplamento e condicionals.

### 2. Abertura Cal.com via `cal('modal', { calLink })` após PIX

A API do Cal.com embed suporta abertura programática via `cal('modal', { calLink: 'slug' })`. Isso permite abrir o calendário inline após o polling detectar `COMPLETED`, sem redirect.

**Alternativa descartada:** redirecionar para `cal.com/slug` — perde o contexto da página e quebra o UX.

### 3. `calSlug` como query param no `success_url` do Stripe

O `success_url` do Stripe aceita parâmetros customizados. Ao criar a sessão Stripe para produtos de agendamento, inclui-se `calSlug=<slug>` na URL de sucesso. A página `/checkout/sucesso` lê o param e renderiza o botão de agendamento condicional.

**Alternativa descartada:** armazenar `calSlug` no metadata da sessão Stripe e buscar via API — desnecessariamente complexo para um param simples de UI.

### 4. Mapeamento productId → calSlug no backend (checkout/session)

O mapeamento `prod_coaching_1x1 → davi-alessandro-fsfg2x/coach-1-1` e `prod_analise_de_partida → <slug>` vive no servidor (route de checkout), não no frontend. Isso evita expor o mapeamento no client bundle e permite mudar o slug sem deploy de frontend.

## Risks / Trade-offs

- **[Slot reservado sem pagamento]** O Cal.com não impede que o usuário agende sem pagar (abrindo diretamente). → Mitigação: a mudança é só no frontend — remover os `data-cal-*` dos botões. Não há proteção server-side no Cal.com.
- **[Double booking]** Usuário paga mas não agenda imediatamente, perde o slot. → Aceitável no MVP; o Titiltei gerencia disponibilidade manualmente.
- **[Stripe redirect interrompe o fluxo]** Usuário fecha a aba após pagar antes de clicar em "Agendar". → A compra fica registrada; Titiltei pode entrar em contato manualmente.

## Migration Plan

1. Criar `BookingPaymentModal` com fluxo PIX completo.
2. Atualizar `ProductsCTA` para usar o modal.
3. Atualizar `checkout/session` para incluir `calSlug` no `success_url`.
4. Atualizar `/checkout/sucesso` para detectar `calSlug` e renderizar botão de agendamento.
5. Sem rollback especial — mudança puramente aditiva no frontend.
