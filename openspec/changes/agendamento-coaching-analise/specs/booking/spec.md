## ADDED Requirements

### Requirement: Modal de agendamento Cal.com para Coaching
O botão "Agendar" do card de Coaching 1:1 SHALL abrir um modal Cal.com para o event type configurado em `NEXT_PUBLIC_CAL_COACHING_SLUG`, permitindo ao visitante escolher data/hora e confirmar o agendamento sem sair da página.

#### Scenario: Visitante clica em "Agendar" no card de Coaching
- **WHEN** qualquer visitante (autenticado ou não) clica no botão "Agendar" do card de Coaching 1:1
- **THEN** um modal Cal.com abre in-page exibindo o calendário com os horários disponíveis do event type de coaching

#### Scenario: Visitante conclui o agendamento de Coaching
- **WHEN** o visitante seleciona um horário e preenche nome e email no formulário Cal.com
- **THEN** o Cal.com registra o agendamento, envia email de confirmação para o visitante e para o Titiltei, e exibe mensagem de sucesso no modal

#### Scenario: Env var de coaching não configurada
- **WHEN** `NEXT_PUBLIC_CAL_COACHING_SLUG` está vazio ou ausente
- **THEN** o botão não abre modal; em ambiente de desenvolvimento um warning é logado no console

### Requirement: Modal de agendamento Cal.com para Análise de Partida
O botão "Agendar" do card de Análise de Partida SHALL abrir um modal Cal.com para o event type configurado em `NEXT_PUBLIC_CAL_ANALISE_SLUG`, com campo personalizado para o usuário informar a partida.

#### Scenario: Visitante clica em "Agendar" no card de Análise de Partida
- **WHEN** qualquer visitante clica no botão "Agendar" do card de Análise de Partida
- **THEN** um modal Cal.com abre in-page com o formulário do event type de análise, que inclui campo para ID/link da partida configurado no painel Cal.com

#### Scenario: Visitante conclui o agendamento de Análise
- **WHEN** o visitante preenche os dados e confirma
- **THEN** o Cal.com registra o agendamento com os dados da partida e envia confirmações por email

### Requirement: Configuração via variáveis de ambiente
Os slugs dos event types Cal.com SHALL ser configurados via `NEXT_PUBLIC_CAL_COACHING_SLUG` e `NEXT_PUBLIC_CAL_ANALISE_SLUG`, não hardcoded no código-fonte.

#### Scenario: Slugs configurados corretamente
- **WHEN** as variáveis estão definidas com o formato `username/event-slug`
- **THEN** os modais abrem para os event types correspondentes

### Requirement: Pré-requisito operacional — event types no Cal.com
O Titiltei SHALL criar dois event types no Cal.com antes do deploy desta feature: um para Coaching 1:1 (slug: coaching-1x1) e um para Análise de Partida (slug: analise-de-partida), com campos e durações adequadas.

#### Scenario: Event type de Análise com campo de partida
- **WHEN** o event type de análise está configurado no Cal.com
- **THEN** o formulário de agendamento inclui um campo obrigatório para o visitante informar o ID ou link da partida a ser analisada
