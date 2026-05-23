## 1. Schema Prisma

- [x] 1.1 Adicionar model `ContentProduct` com campos `contentId`, `productId`, relações para `Content` e `Product`, e `@@id([contentId, productId])`
- [x] 1.2 Remover campo `accessLevel AccessLevel` de `Content`; adicionar relação `products ContentProduct[]`
- [x] 1.3 Remover campo `accessLevel AccessLevel` de `Product`; adicionar relação `contents ContentProduct[]`
- [x] 1.4 Remover campo `accessLevel AccessLevel` de `User`
- [x] 1.5 Remover campo `accessLevel AccessLevel` de `Purchase`; remover `@unique` de `userId`; adicionar `@@unique([userId, productId])`
- [x] 1.6 Remover enum `AccessLevel` do schema
- [x] 1.7 Rodar `npx prisma migrate dev --name add-product-based-access` para gerar a migration

## 2. Lógica de Acesso (`src/lib/access.ts`)

- [x] 2.1 Remover `LEVEL_ORDER`, `canAccess()` e `maxLevel()`
- [x] 2.2 Implementar `userCanAccessContent(userId: string, contentId: string): Promise<boolean>` que retorna `true` se o conteúdo não tem produtos associados, ou se o usuário tem ao menos uma `Purchase` `COMPLETED` para um produto associado ao conteúdo
- [x] 2.3 Implementar `userHasProduct(userId: string, productId: string): Promise<boolean>` para uso no checkout

## 3. Auth e Sessão

- [x] 3.1 Em `src/lib/auth.ts`: remover leitura de `accessLevel` do `dbUser` e remoção da atribuição `token["accessLevel"]`
- [x] 3.2 Em `src/lib/auth.config.ts`: remover `accessLevel` da extensão do tipo `Session` e da callback `session`

## 4. API de Conteúdo

- [x] 4.1 Em `src/app/api/contents/[slug]/route.ts`: substituir `canAccess(userLevel, content.accessLevel)` por `userCanAccessContent(session.user.id, content.id)`; remover leitura de `user.accessLevel` da query
- [x] 4.2 Em `src/app/api/trails/[slug]/route.ts`: calcular `locked` de cada item via `userCanAccessContent` em vez de comparar `accessLevel`
- [x] 4.3 Em `src/app/api/admin/contents/route.ts`: remover campo `accessLevel` do schema Zod; adicionar campo `productIds: z.array(z.string()).optional()`; após criar o `Content`, criar os registros `ContentProduct`
- [x] 4.4 Em `src/app/api/admin/contents/[id]/route.ts`: remover campo `accessLevel` do schema Zod; adicionar `productIds` opcional; ao atualizar, fazer delete-then-insert das relações `ContentProduct`
- [x] 4.5 Em `src/app/api/products/route.ts`: remover `accessLevel` do select e da resposta

## 5. Webhook Stripe

- [x] 5.1 Em `src/app/api/stripe/webhook/route.ts`: remover leitura de `product.accessLevel`; remover atualização de `User.accessLevel` (`prisma.user.update({ data: { accessLevel: ... } })`); manter apenas o upsert de `Purchase` com `status: COMPLETED`

## 6. Checkout

- [x] 6.1 Em `src/app/checkout/sucesso/page.tsx`: remover qualquer referência a `accessLevel`
- [x] 6.2 Atualizar a rota `POST /api/checkout/session` (ou server action correspondente): substituir verificação de "já tem acesso" por `userHasProduct(userId, productId)` em vez de checar `Purchase.findFirst({ where: { userId } })`

## 7. Páginas do Dashboard

- [x] 7.1 Em `src/app/dashboard/explorar/page.tsx`: substituir `LEVEL_ORDER[content.accessLevel] > LEVEL_ORDER[userAccessLevel]` por chamada a `userCanAccessContent`; remover leitura de `user.accessLevel`
- [x] 7.2 Em `src/app/dashboard/conteudo/[slug]/page.tsx`: substituir `canAccess(userLevel, content.accessLevel)` por `userCanAccessContent`; remover referências a `AccessLevel`
- [x] 7.3 Em `src/app/api/user/me/route.ts`: remover `accessLevel` da resposta; derivar `hasAccess` checando se o usuário tem ao menos uma `Purchase` `COMPLETED`

## 8. Admin UI

- [x] 8.1 Em `src/app/dashboard/admin/conteudos/novo/page.tsx`: substituir `<select name="accessLevel">` por lista de checkboxes de produtos ativos (`productIds[]`)
- [x] 8.2 Em `src/app/dashboard/admin/conteudos/[id]/editar/page.tsx`: substituir o `<select name="accessLevel">` por lista de checkboxes, pré-marcando os produtos atualmente associados ao conteúdo
- [x] 8.3 Em `src/lib/admin-actions.ts`: remover `accessLevel` das server actions de criação/edição de conteúdo; adicionar lógica para criar/atualizar relações `ContentProduct`; remover server action `setUserAccessLevel` (ou converter para uso administrativo sem `AccessLevel`)
- [x] 8.4 Em `src/app/dashboard/admin/page.tsx`: remover colunas e controles de `accessLevel` da tabela de usuários e da tabela de conteúdos

## 9. Componentes

- [x] 9.1 Em `src/components/platform/ContentCard.tsx`: remover prop `userAccessLevel?: AccessLevel` e lógica baseada em `LEVEL_ORDER`; receber `locked: boolean` diretamente (já calculado pelo servidor)
- [x] 9.2 Em `src/components/platform/ProgressTracker.tsx`: remover verificação de `content.accessLevel !== AccessLevel.FREE`; usar prop `locked: boolean` passada pelo pai
- [x] 9.3 Em `src/components/platform/PlanCarousel.tsx`: remover prop/campo `accessLevel`
- [x] 9.4 Em `src/components/landing/PricingSection.tsx`: remover referências a `accessLevel` no tipo `Product`
