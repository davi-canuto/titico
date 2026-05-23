## Context

O admin já tem o padrão de tabs via `?tab=` search param e Server Actions com `requireAdmin()`. A página `/dashboard/admin/page.tsx` busca dados em paralelo com `Promise.all` e renderiza a tab ativa. O mesmo padrão se aplica à aba de Produtos. Edição de produto segue o padrão já existente em `/dashboard/admin/conteudos/[id]/editar`.

## Goals / Non-Goals

**Goals:**
- Listagem de produtos na aba admin com preço formatado em BRL
- Toggle ativo/inativo inline (Server Action, sem JS client-side)
- Formulário de edição de nome, descrição e preço
- Revalidação de `/planos` ao editar ou togglear produto

**Non-Goals:**
- Criar ou deletar produtos pelo admin (feito via seed — produto é configuração, não conteúdo)
- Sincronização com Stripe Prices (fora de escopo desta change)
- Edição de `accessLevel` pelo admin (mudança de modelo, requer análise separada)

## Decisions

### Preço como campo de texto em reais (não centavos)
O formulário exibe e recebe o preço em R$ (ex: "47,00") e a action converte para centavos antes de salvar. Evita confusão do admin digitando 4700 quando quer R$ 47.

### Sem criação/deleção de produto pelo admin
Produtos são entidades de configuração do negócio — criados via seed com IDs previsíveis. Criar pelo admin geraria IDs aleatórios sem controle. Delete é perigoso com Purchases vinculadas.

### `revalidatePath('/planos')` em toda mutação
Toda ação de toggle ou edição chama `revalidatePath('/planos')` para garantir que a página de planos reflete imediatamente a mudança.

## Risks / Trade-offs

- [Preço inválido no formulário] Admin digita texto não numérico → validar com `parseFloat`, retornar erro se NaN ou <= 0
- [Produto com Purchases vinculadas desativado] `active: false` remove da `/planos` mas não cancela compras — comportamento correto, apenas não aparece para novos usuários
