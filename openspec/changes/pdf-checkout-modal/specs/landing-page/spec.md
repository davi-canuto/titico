## MODIFIED Requirements

### Requirement: Botões de agendamento na ProductsCTA
Os botões "Agendar" dos cards de Coaching e Análise de Partida acionam modais Cal.com. O botão "Comprar" do card PDF abre o modal `PdfPaymentModal` em vez de navegar para `/planos`. Se `NEXT_PUBLIC_PDF_PRODUCT_ID` não estiver configurado, o botão "Comprar" é exibido desabilitado.

#### Scenario: Visitante clica em "Agendar" no card de Coaching
- **WHEN** o visitante clica no botão "Agendar" do card Coaching 1:1
- **THEN** o modal Cal.com de coaching abre sobre a página atual sem navegação

#### Scenario: Visitante clica em "Agendar" no card de Análise
- **WHEN** o visitante clica no botão "Agendar" do card Análise de Partida
- **THEN** o modal Cal.com de análise abre sobre a página atual sem navegação

#### Scenario: Visitante clica em "Comprar" no card de PDF
- **WHEN** o visitante clica no botão "Comprar" do card PDF Guia Shaco AD e `NEXT_PUBLIC_PDF_PRODUCT_ID` está configurado
- **THEN** o modal `PdfPaymentModal` abre com opções de pagamento (Cartão de Crédito e PIX)

#### Scenario: Botão Comprar desabilitado sem env var
- **WHEN** `NEXT_PUBLIC_PDF_PRODUCT_ID` não está configurado
- **THEN** o botão "Comprar" aparece desabilitado (opacity reduzida, cursor not-allowed)
