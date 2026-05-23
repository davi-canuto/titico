## 1. Schema & Migration

- [x] 1.1 Adicionar `accessLevel AccessLevel @default(FREE)` no model `User` em `prisma/schema.prisma`
- [x] 1.2 Rodar `npx prisma migrate dev --name add_user_access_level` para gerar e aplicar a migration

## 2. Lógica de Acesso

- [x] 2.1 Reescrever `src/lib/access.ts`: adicionar `LEVEL_ORDER`, `canAccess(userLevel, contentLevel)` e `maxLevel(a, b)`
- [x] 2.2 Remover `canAccessContent` (ou renomear para `canAccess`) e atualizar todos os imports que usavam a função antiga

## 3. Session com accessLevel

- [x] 3.1 Em `src/lib/auth.config.ts`, adicionar `accessLevel` no callback `jwt` (ler do DB na primeira vez) e expor no callback `session`
- [x] 3.2 Atualizar `src/types/` ou declaração de tipos do Auth.js para incluir `accessLevel: AccessLevel` no `Session.user`

## 4. Webhook — atualizar User após compra

- [x] 4.1 Em `src/app/api/stripe/webhook/route.ts`, após upsert da `Purchase`, buscar o produto comprado, e fazer `prisma.user.update` com `maxLevel(user.accessLevel, product.accessLevel)`

## 5. Gate no Content Player

- [x] 5.1 Em `src/app/dashboard/conteudo/[slug]/page.tsx`, ler `session.user.accessLevel` e chamar `canAccess(userLevel, content.accessLevel)`
- [x] 5.2 Se bloqueado: renderizar overlay com ícone de cadeado, título "Conteúdo bloqueado" e botão "Ver planos" → `/planos` (não expor URL do vídeo)
- [x] 5.3 Se liberado: renderizar o conteúdo normalmente

## 6. Indicador Visual no Explorar

- [x] 6.1 Em `src/app/dashboard/explorar/page.tsx`, passar `userAccessLevel` para os cards
- [x] 6.2 Em `src/components/platform/ContentCard.tsx`, exibir badge "BLOQUEADO" quando `LEVEL_ORDER[card.accessLevel] > LEVEL_ORDER[userAccessLevel]`

## 7. Admin — editar accessLevel de usuário

- [x] 7.1 Em `src/lib/admin-actions.ts`, adicionar `setUserAccessLevel(userId, level)` com `requireAdmin()` guard
- [x] 7.2 Na aba de pagamentos/usuários do admin (`/dashboard/admin`), listar usuários com seu `accessLevel` atual e permitir edição via select

## 8. Validação

- [x] 8.1 Rodar `next build` sem erros de TypeScript
