## Context

O painel admin já possui páginas de criação (`/novo`) para conteúdos e trilhas, Server Actions em `admin-actions.ts`, e componentes reutilizáveis (`TitleSlugFields`, `ConfirmButton`). O schema Prisma suporta update nativo — nenhuma migração de banco é necessária. Os campos específicos de tipo vivem em modelos relacionados (`VideoMeta`, `MatchupMeta`, `BuildMeta`, `ArticleMeta`, `FileMeta`) com relação 1:1 obrigatória.

## Goals / Non-Goals

**Goals:**
- Editar campos comuns de conteúdo (título, slug, thumbnail, accessLevel) e campos específicos por tipo em `/dashboard/admin/conteudos/[id]/editar`
- Editar campos de trilha (título, slug, descrição, thumbnail) em `/dashboard/admin/trilhas/[id]/editar`
- Links "Editar" nas tabelas do painel admin

**Non-Goals:**
- Alterar o tipo de um conteúdo (VIDEO→ARTICLE etc.) — deletar e recriar é o fluxo correto
- Editor rich-text para artigos (textarea é suficiente para MVP)
- Upload de arquivos (URLs externas continuam sendo o modelo)

## Decisions

### 1. Formulários pré-preenchidos via Server Component
A página de edição é um Server Component que busca o conteúdo/trilha pelo ID e passa os valores como `defaultValue` dos inputs. Sem estado client-side — mesma abordagem das páginas de criação.

### 2. `updateContent` usa `upsert` nos modelos filhos
Os modelos `VideoMeta`, `MatchupMeta` etc. têm relação 1:1 obrigatória e já existem quando o conteúdo é editado. Usar `update` direto no modelo filho (ex: `prisma.videoMeta.update({ where: { contentId: id } })`) é mais simples que upsert e é correto porque o meta sempre existe para conteúdos criados pela UI.

### 3. Slug único — redirect com `?error=slug` em conflito
Mesma lógica da criação: verificar `findUnique({ where: { slug } })` antes de atualizar, ignorar o próprio registro (`id: { not: currentId }`). Redirect para `/editar?error=slug` em conflito.

### 4. Formulário de edição de conteúdo não tem type-picker
O tipo é fixo — mostrar apenas os campos do tipo atual do conteúdo. O tipo é passado como hidden input apenas para referência de layout (não mutável).

### 5. Reuso de `TitleSlugFields` com valor inicial
`TitleSlugFields` já é `'use client'` e gera slug do título. Para pré-preencher, aceitar props opcionais `defaultTitle` e `defaultSlug` e usá-los como estado inicial.

## Risks / Trade-offs

- **[Slug collision ao editar]** → Filtrar o próprio ID na checagem unique, como descrito acima.
- **[TitleSlugFields precisa de props extras]** → Pequena mudança no componente existente, sem breaking change — props são opcionais com fallback `""`.
- **[Campos do modelo filho são always-present]** → Se um conteúdo foi criado por migration/seed direto sem meta, o `update` falhará. Aceitável — a UI de criação sempre cria o meta junto.
