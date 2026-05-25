## MODIFIED Requirements

### Requirement: Botões de agendamento na ProductsCTA
Os botões "Agendar" dos cards de Coaching e Análise de Partida na seção `ProductsCTA` SHALL acionar modais Cal.com in-page em vez de navegar para `/planos`. O card de PDF continua linkando para `/planos`.

#### Scenario: Visitante clica em "Agendar" no card de Coaching
- **WHEN** o visitante clica no botão "Agendar" do card Coaching 1:1
- **THEN** o modal Cal.com de coaching abre sobre a página atual sem navegação

#### Scenario: Visitante clica em "Agendar" no card de Análise
- **WHEN** o visitante clica no botão "Agendar" do card Análise de Partida
- **THEN** o modal Cal.com de análise abre sobre a página atual sem navegação

#### Scenario: Visitante clica em "Comprar" no card de PDF
- **WHEN** o visitante clica no botão "Comprar" do card PDF Guia Shaco AD
- **THEN** o browser navega para `/planos` (comportamento inalterado)
