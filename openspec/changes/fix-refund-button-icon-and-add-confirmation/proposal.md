## Why

O botão de reembolso no perfil do usuário exibe um ícone de envelope de email que não representa semanticamente a ação de reembolso, causando confusão visual. Além disso, o clique no botão dispara o reembolso imediatamente sem nenhuma confirmação, expondo o usuário a reembolsos acidentais.

## What Changes

- Substituir o ícone SVG de email no `RefundButton` por um ícone de seta de retorno (undo/refund).
- Adicionar um diálogo de confirmação inline (sem modal externo) que exibe a pergunta "Tem certeza que deseja solicitar o reembolso?" com opções "Confirmar" e "Cancelar" antes de executar a ação.

## Capabilities

### New Capabilities
<!-- nenhuma nova capability -->

### Modified Capabilities
- `user-profile`: O componente de botão de reembolso passa a exigir confirmação explícita do usuário antes de executar a solicitação, e exibe ícone semanticamente correto.

## Impact

- `src/components/platform/RefundButton.tsx`: substituição do SVG e adição do fluxo de confirmação inline.
- Nenhuma alteração em server actions, API, banco de dados ou outros componentes.
