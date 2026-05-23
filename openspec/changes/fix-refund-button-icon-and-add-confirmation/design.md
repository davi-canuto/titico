## Context

O `RefundButton` é um componente client-side isolado em `src/components/platform/RefundButton.tsx`. Ele recebe `purchaseId` e `daysLeft` como props e chama a server action `requestRefund` diretamente ao clique. O SVG atual é um envelope de email — artefato provavelmente copiado de outro componente. O componente não tem estado de confirmação; a ação é irreversível uma vez disparada.

## Goals / Non-Goals

**Goals:**
- Trocar o ícone SVG por um que represente visualmente "reembolso" (seta de retorno).
- Introduzir um estado intermediário de confirmação inline (sem abrir modal ou redirecionar) antes de executar `requestRefund`.
- Manter o design system Shaco: cores, tipografia e border tokens já usados no componente.

**Non-Goals:**
- Criar um componente de modal genérico reutilizável.
- Alterar a server action `requestRefund` ou qualquer lógica de backend.
- Adicionar animações ou transições além do `transition-colors` já presente.

## Decisions

### Confirmação inline vs. modal
Usar um estado local (`confirming: boolean`) para alternar o botão principal por dois botões ("Confirmar" / "Cancelar") dentro do mesmo container, sem portal ou overlay. Alternativa descartada: modal — adiciona complexidade desnecessária para uma ação de baixa frequência num componente já compacto.

### Ícone de reembolso
SVG inline de seta circular de retorno (undo arrow), mantendo `width="13" height="13"` e os atributos de stroke já usados. Alternativa descartada: bibliotecas de ícones externas — proibidas pelo design system.

### Reset do estado de confirmação
Ao receber resposta com erro, o estado `confirming` volta para `false` automaticamente, para que o usuário possa tentar novamente ou cancelar.

## Risks / Trade-offs

- [UX] Dois cliques para reembolsar podem frustrar usuários avançados → aceitável; reembolso é ação irreversível que justifica fricção.
- [Estado] Se o usuário clicar "Confirmar" e navegar antes da resposta, o estado local é perdido mas a server action ainda executa → sem impacto real, pois o reembolso já foi enviado.
