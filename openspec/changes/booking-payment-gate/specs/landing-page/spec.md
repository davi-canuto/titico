## MODIFIED Requirements

### Requirement: Botões de agendamento disparam modal de pagamento
Os botões "Agendar" dos cards Coaching 1:1 e Análise de Partida em `ProductsCTA` SHALL abrir o `BookingPaymentModal` em vez de disparar o Cal.com diretamente via `data-cal-*`.

#### Scenario: Clique em Agendar Coaching
- **WHEN** o usuário clica em "Agendar" no card Coaching 1:1
- **THEN** o `BookingPaymentModal` abre com o produto `prod_coaching_1x1` e o calSlug do coaching

#### Scenario: Clique em Agendar Análise
- **WHEN** o usuário clica em "Agendar" no card Análise de Partida
- **THEN** o `BookingPaymentModal` abre com o produto `prod_analise_de_partida` e o calSlug da análise

#### Scenario: Análise sem slug configurado
- **WHEN** `ANALISE_SLUG` está vazio
- **THEN** o botão de Análise permanece desabilitado
