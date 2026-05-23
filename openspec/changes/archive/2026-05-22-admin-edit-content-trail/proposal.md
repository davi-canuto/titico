## Why

O painel admin permite criar e deletar conteúdos e trilhas, mas não editá-los. Qualquer correção de título, slug, thumbnail ou campos específicos de tipo exige deletar e recriar o item, perdendo relacionamentos (TrailItems, progresso de usuários).

## What Changes

- Adicionar página de edição de conteúdo em `/dashboard/admin/conteudos/[id]/editar` com formulário pré-preenchido
- Adicionar Server Action `updateContent(id, formData)` em `admin-actions.ts`
- Adicionar página de edição de trilha em `/dashboard/admin/trilhas/[id]/editar` com formulário pré-preenchido
- Adicionar Server Action `updateTrail(id, formData)` em `admin-actions.ts`
- Adicionar links "Editar" nas tabelas de conteúdos e trilhas no painel admin

## Capabilities

### New Capabilities

- `admin-content-edit`: Edição de conteúdo existente via formulário admin — campos comuns (título, slug, thumbnail, accessLevel) e campos específicos por tipo
- `admin-trail-edit`: Edição de trilha existente via formulário admin — título, slug, descrição, thumbnail

### Modified Capabilities

- `content`: Requisito de mutação ampliado — além de criar/deletar, conteúdo pode ser atualizado in-place

## Impact

- `src/lib/admin-actions.ts` — novas Server Actions `updateContent`, `updateTrail`
- `src/app/dashboard/admin/conteudos/[id]/editar/page.tsx` — nova página
- `src/app/dashboard/admin/trilhas/[id]/editar/page.tsx` — nova página
- `src/app/dashboard/admin/page.tsx` — links "Editar" nas tabelas
- Reutiliza componentes existentes: `TitleSlugFields`, `ConfirmButton`
