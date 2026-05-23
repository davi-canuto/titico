## 1. Corrigir ícone do botão de reembolso

- [x] 1.1 Em `src/components/platform/RefundButton.tsx`, substituir o SVG de envelope de email pelo SVG de seta de retorno (undo arrow) com os mesmos atributos `width="13" height="13"`, `stroke="currentColor"`, `strokeWidth="2"`, `strokeLinecap="round"` e `strokeLinejoin="round"`

## 2. Adicionar estado de confirmação inline

- [x] 2.1 Adicionar estado local `confirming` (`useState<boolean>(false)`) ao componente
- [x] 2.2 Alterar o `handleRefund` para: se `!confirming`, apenas setar `confirming(true)` sem chamar a server action
- [x] 2.3 Criar função `handleConfirm` que chama a server action `requestRefund` via `startTransition` e reseta `confirming` para `false` em caso de erro
- [x] 2.4 Criar função `handleCancel` que reseta `confirming` para `false`
- [x] 2.5 No JSX, quando `confirming === true`, renderizar dois botões inline ("Confirmar reembolso" e "Cancelar") com estilo do design system Shaco no lugar do botão principal
- [x] 2.6 Garantir que o estado `confirming` é resetado para `false` quando `result.error` é recebido
