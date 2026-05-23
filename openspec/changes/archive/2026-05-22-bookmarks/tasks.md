## 1. Schema

- [x] 1.1 Adicionar model `Bookmark` ao `prisma/schema.prisma` com `userId`, `contentId`, `createdAt`, relações e `@@unique([userId, contentId])`
- [x] 1.2 Adicionar relação `bookmarks Bookmark[]` ao model `User` e `Content`
- [x] 1.3 Rodar `npx prisma migrate dev --name add-bookmarks`

## 2. API Routes

- [x] 2.1 Criar `src/app/api/bookmarks/route.ts` com `GET` (lista bookmarks do usuário com content+video) e `POST` (cria bookmark, idempotente via upsert)
- [x] 2.2 Criar `src/app/api/bookmarks/[contentId]/route.ts` com `DELETE` (remove bookmark, idempotente)

## 3. BookmarkButton Component

- [x] 3.1 Criar `src/components/platform/BookmarkButton.tsx` — client component com estado otimista, debounce de 300ms, `e.stopPropagation()` no clique
- [x] 3.2 Receber props: `contentId: string`, `initialBookmarked: boolean`
- [x] 3.3 Toggle imediato + POST/DELETE em background + revert em caso de erro

## 4. Integração nas páginas

- [x] 4.1 Atualizar `src/app/dashboard/perfil/page.tsx` para buscar bookmarks do usuário e exibir seção "Salvos" com grid de `ContentCard`

## 5. Validação

- [x] 5.1 Rodar `next build` sem erros de TypeScript
