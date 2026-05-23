## Why

Usuários que navegam por muitos conteúdos não têm como salvar os que querem ver depois. Sem bookmarks, dependem de memória ou de rolar manualmente pelas trilhas para encontrar algo que viram antes. É uma funcionalidade de retenção: usuário que salva conteúdo tem mais razão para voltar.

## What Changes

- Novo modelo `Bookmark` no Prisma: `userId`, `contentId`, timestamps, unique `[userId, contentId]`
- `POST /api/bookmarks` — adiciona bookmark para o conteúdo autenticado
- `DELETE /api/bookmarks/[contentId]` — remove bookmark
- `GET /api/bookmarks` — lista conteúdos salvos do usuário (com dados de conteúdo e progresso)
- Botão de bookmark (ícone de marcador) no `ContentCard` e na página de conteúdo
- Seção "Salvos" na página de perfil (`/dashboard/perfil`) listando conteúdos bookmarkados

## Capabilities

### New Capabilities

- `bookmarks`: Define o contrato de criação, remoção e listagem de bookmarks — autenticação obrigatória, idempotência (adicionar duas vezes não duplica), e o que é retornado na listagem.

### Modified Capabilities

- `content`: O `ContentCard` e a página de conteúdo passam a exibir um botão de toggle de bookmark com estado otimista.
- `user-profile`: A página de perfil ganha uma seção "Salvos" com os conteúdos bookmarkados.

## Impact

- `prisma/schema.prisma`: novo model `Bookmark`
- `prisma/migrations/`: nova migration `add-bookmarks`
- `src/app/api/bookmarks/route.ts` (novo): `GET` e `POST`
- `src/app/api/bookmarks/[contentId]/route.ts` (novo): `DELETE`
- `src/components/platform/BookmarkButton.tsx` (novo): botão client-side com estado otimista
- `src/components/platform/ContentCard.tsx`: adiciona `BookmarkButton`
- `src/app/dashboard/perfil/page.tsx`: adiciona seção "Salvos"
