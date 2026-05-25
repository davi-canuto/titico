## Why

Os botões "Agendar" na seção `ProductsCTA` da landing não fazem nada — são links estáticos para `/planos`. Sem um fluxo real de agendamento, o Titiltei não consegue converter visitantes em clientes de coaching ou análise de partida. A solução precisa ser self-service: o usuário escolhe o horário sem depender de troca de mensagens.

## What Changes

- Os botões "Agendar Coaching" e "Agendar Análise de Partida" passam a abrir um modal do Cal.com inline na landing page
- O modal exibe o calendário do Titiltei com os horários disponíveis para o serviço correspondente
- O usuário preenche nome, email e confirma — Cal.com envia confirmação automática por email
- `ProductsCTA` deixa de ser um Server Component e passa a ter interatividade client-side para abrir o modal
- Nenhum banco de dados customizado: Cal.com gerencia toda a lógica de disponibilidade e confirmações

## Capabilities

### New Capabilities

- `booking`: Integração com Cal.com via `@calcom/embed-react` — modal de agendamento acionado pelos botões da landing, um event type por serviço (coaching e análise)

### Modified Capabilities

- `landing-page`: Os botões de agendamento em `ProductsCTA` passam de links para triggers de modal Cal.com; requer `'use client'`

## Impact

- `src/components/landing/ProductsCTA.tsx`: adicionar `'use client'`, Cal.com modal trigger
- Nova dependência: `@calcom/embed-react`
- Sem mudanças de schema Prisma, sem novas rotas de API
- Requer que o Titiltei configure conta no Cal.com com dois event types antes do deploy
