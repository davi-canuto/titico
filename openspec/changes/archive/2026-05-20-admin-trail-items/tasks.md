## 1. Server Actions

- [x] 1.1 Adicionar `addTrailItem(trailId: string, contentId: string)` em `src/lib/admin-actions.ts` — busca o max order atual da trilha, cria TrailItem com `order = max + 1`; captura unique constraint (conteúdo já adicionado) e retorna sem erro; `revalidatePath`
- [x] 1.2 Adicionar `removeTrailItem(itemId: string, trailId: string)` — deleta o TrailItem, depois repacks: busca todos os itens restantes ordenados e atualiza cada `order` para seu índice + 1 num `$transaction`; `revalidatePath`
- [x] 1.3 Adicionar `moveTrailItemUp(itemId: string, trailId: string)` — busca o item e o anterior (order - 1); troca os orders via `$transaction` com valor temporário 9999; `revalidatePath`
- [x] 1.4 Adicionar `moveTrailItemDown(itemId: string, trailId: string)` — busca o item e o próximo (order + 1); troca os orders via `$transaction`; `revalidatePath`

## 2. Página de itens da trilha

- [x] 2.1 Criar `src/app/dashboard/admin/trilhas/[id]/itens/page.tsx` — Server Component; buscar `trail` com `items` ordenados por `order asc` incluindo `content`; chamar `notFound()` se trilha não existir
- [x] 2.2 Header: nome da trilha em `<h1>`, breadcrumb "← Admin / Trilhas / [nome]"; badge com contagem de itens
- [x] 2.3 Lista de itens: para cada TrailItem renderizar uma linha com número de posição, badge de tipo, título do conteúdo, e três ações em form separados: botão ↑ (desabilitado se primeiro), botão ↓ (desabilitado se último), botão "Remover"
- [x] 2.4 Estilo da linha: `flex items-center gap-3 rounded-lg border border-white/5 bg-[#161616] px-4 py-3`; número `w-6 text-center text-xs font-black text-white/30`; tipo badge `text-[10px] uppercase tracking-widest`; título `flex-1 text-sm font-semibold text-white`
- [x] 2.5 Formulários de ação: cada botão ↑/↓/Remover dentro de `<form action={action.bind(null, item.id, trail.id)}>` — botões ↑↓ com SVG chevron inline, "Remover" com texto `text-[#ef4444]`
- [x] 2.6 Empty state: se `trail.items.length === 0`, mostrar card com mensagem "Nenhum conteúdo nesta trilha ainda"

## 3. Formulário de adicionar conteúdo

- [x] 3.1 Na mesma página, abaixo da lista: buscar todos os conteúdos PUBLISHED que ainda não estão na trilha (`where: { status: PUBLISHED, id: { notIn: [...ids já adicionados] } }`)
- [x] 3.2 Se há conteúdos disponíveis: renderizar `<form action={addTrailItem.bind(null, trail.id)}>` com `<select name="contentId">` — cada option mostra `[TIPO] Título`; botão "+ Adicionar" vermelho
- [x] 3.3 Se não há conteúdos disponíveis: mostrar mensagem `text-white/30` "Todos os conteúdos já foram adicionados"
- [x] 3.4 Header da seção de adição: `<h2>` com `border-l-2 border-[#e3001b]` "Adicionar conteúdo"

## 4. Link no painel admin

- [x] 4.1 Em `src/app/dashboard/admin/page.tsx`, na tab Trilhas, adicionar link "Gerenciar itens" em cada linha da tabela de trilhas: `<Link href={`/dashboard/admin/trilhas/${t.id}/itens`}>` com estilo `text-xs text-white/50 hover:text-white`

## 5. Verificação

- [x] 5.1 `npx tsc --noEmit` — sem erros
- [ ] 5.2 Acessar `/dashboard/admin?tab=trilhas` — confirmar link "Gerenciar itens" aparece
- [ ] 5.3 Adicionar conteúdo a uma trilha — confirmar aparece na lista com order correto
- [ ] 5.4 Reordenar itens com ↑/↓ — confirmar ordem muda corretamente
- [ ] 5.5 Remover item — confirmar é removido e orders são recompactados
