## 1. Componente TitleSlugFields

- [x] 1.1 Adicionar props opcionais `defaultTitle?: string` e `defaultSlug?: string` ao componente `src/components/admin/TitleSlugFields.tsx` — usar como estado inicial do `useState`

## 2. Server Actions

- [x] 2.1 Adicionar `updateContent(id: string, formData: FormData)` em `src/lib/admin-actions.ts` — verificar slug único (excluindo o próprio id), atualizar `content` com campos comuns, atualizar o modelo meta do tipo (`videoMeta`, `matchupMeta`, `buildMeta`, `articleMeta`, `fileMeta`) via `prisma.<model>.update({ where: { contentId: id } })`; redirecionar para `/dashboard/admin?tab=conteudos` ou `/dashboard/admin/conteudos/${id}/editar?error=slug`
- [x] 2.2 Adicionar `updateTrail(id: string, formData: FormData)` em `src/lib/admin-actions.ts` — verificar slug único (excluindo o próprio id), atualizar `trail` com title, slug, description, thumbnail; redirecionar para `/dashboard/admin?tab=trilhas` ou `/dashboard/admin/trilhas/${id}/editar?error=slug`

## 3. Página de edição de conteúdo

- [x] 3.1 Criar `src/app/dashboard/admin/conteudos/[id]/editar/page.tsx` — Server Component; buscar conteúdo com include do meta do tipo por `id`; `notFound()` se não encontrar; guard de ADMIN
- [x] 3.2 Header com breadcrumb "Admin / Conteúdos / [título] / Editar" e `<h1>` com nome do conteúdo
- [x] 3.3 Banner `?error=slug` igual ao da página de criação
- [x] 3.4 Formulário `<form action={updateContent.bind(null, content.id)}>` com campos comuns pré-preenchidos: `TitleSlugFields` com `defaultTitle` e `defaultSlug`, thumbnail URL, accessLevel
- [x] 3.5 Campos específicos do tipo pré-preenchidos com `defaultValue` dos dados do meta — VIDEO: youtubeId + duration; MATCHUP: champion + difficulty + strategy + tips (join `\n`) + itemSuggestion; BUILD: champion + items (join `\n`) + runes (join `\n`) + notes; ARTICLE: body; PDF: url + sizeBytes
- [x] 3.6 Botão "Salvar alterações" e link "Cancelar" → `/dashboard/admin`

## 4. Página de edição de trilha

- [x] 4.1 Criar `src/app/dashboard/admin/trilhas/[id]/editar/page.tsx` — Server Component; buscar trilha por `id`; `notFound()` se não encontrar; guard de ADMIN
- [x] 4.2 Header com breadcrumb "Admin / Trilhas / [título] / Editar" e `<h1>`
- [x] 4.3 Banner `?error=slug`
- [x] 4.4 Formulário `<form action={updateTrail.bind(null, trail.id)}>` com campos pré-preenchidos: `TitleSlugFields` com `defaultTitle` e `defaultSlug`, description (textarea), thumbnail URL
- [x] 4.5 Botão "Salvar alterações" e link "Cancelar" → `/dashboard/admin?tab=trilhas`

## 5. Links no painel admin

- [x] 5.1 Em `src/app/dashboard/admin/page.tsx`, tabela de conteúdos: adicionar `<Link href="/dashboard/admin/conteudos/${c.id}/editar">` com `text-xs text-white/50 hover:text-white` antes das ações existentes
- [x] 5.2 Em `src/app/dashboard/admin/page.tsx`, tabela de trilhas: adicionar `<Link href="/dashboard/admin/trilhas/${t.id}/editar">` com `text-xs text-white/50 hover:text-white` ao lado do link "Gerenciar itens"

## 6. Verificação

- [x] 6.1 `npx tsc --noEmit` — sem erros
- [x] 6.2 Editar um conteúdo de cada tipo — confirmar campos pré-preenchidos e salvamento correto
- [x] 6.3 Testar conflito de slug em conteúdo — confirmar banner de erro
- [x] 6.4 Editar uma trilha — confirmar campos pré-preenchidos e salvamento
- [x] 6.5 Testar conflito de slug em trilha — confirmar banner de erro
