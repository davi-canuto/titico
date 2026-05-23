## MODIFIED Requirements

### Requirement: Refund button UX
O componente `RefundButton` SHALL exibir um ícone de seta de retorno (undo/refund) em vez do ícone de envelope de email, e SHALL exigir confirmação explícita do usuário antes de disparar a solicitação de reembolso.

#### Scenario: Ícone correto exibido
- **WHEN** o componente `RefundButton` é renderizado
- **THEN** o SVG exibido SHALL representar uma seta de retorno/reembolso, não um envelope de email

#### Scenario: Primeiro clique exibe confirmação
- **WHEN** o usuário clica em "Solicitar reembolso"
- **THEN** o componente SHALL substituir o botão original por dois botões inline: "Confirmar reembolso" e "Cancelar"
- **THEN** a server action `requestRefund` NÃO SHALL ser chamada neste momento

#### Scenario: Confirmar reembolso
- **WHEN** o usuário clica em "Confirmar reembolso" após o estado de confirmação aparecer
- **THEN** a server action `requestRefund` SHALL ser invocada com o `purchaseId` correto

#### Scenario: Cancelar reembolso
- **WHEN** o usuário clica em "Cancelar" no estado de confirmação
- **THEN** o componente SHALL retornar ao estado inicial com o botão "Solicitar reembolso"
- **THEN** a server action `requestRefund` NÃO SHALL ser chamada

#### Scenario: Erro retorna ao estado inicial
- **WHEN** a server action `requestRefund` retorna `result.error`
- **THEN** o estado de confirmação SHALL ser resetado para `false`
- **THEN** a mensagem de erro SHALL ser exibida abaixo do botão
