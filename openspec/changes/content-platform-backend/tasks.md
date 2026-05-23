## 1. Prisma Schema

- [x] 1.1 Adicionar enums ao `prisma/schema.prisma`: `ContentType`, `ContentStatus`, `Difficulty`, `UserRole`
- [x] 1.2 Adicionar valor `FREE` ao enum `AccessLevel` existente
- [x] 1.3 Adicionar campo `role UserRole @default(MEMBER)` e relação `progress UserProgress[]` ao modelo `User`
- [x] 1.4 Adicionar modelo `Content` com todos os campos e relações
- [x] 1.5 Adicionar modelos de meta: `VideoMeta`, `MatchupMeta`, `BuildMeta`, `ArticleMeta`, `FileMeta` (cada um com `contentId @unique` e `onDelete: Cascade`)
- [x] 1.6 Adicionar modelo `Trail` com campos `title`, `slug @unique`, `description?`, `thumbnail?`, `active`
- [x] 1.7 Adicionar modelo `TrailItem` com `@@unique([trailId, contentId])` e `@@unique([trailId, order])`
- [x] 1.8 Adicionar modelo `UserProgress` com `@@unique([userId, contentId])` e `onDelete: Cascade`
- [x] 1.9 Rodar `npx prisma migrate dev --name content-platform` — banco local `titico_dev` em sync

## 2. Helpers de acesso

- [x] 2.1 Criar `src/lib/access.ts` com função `canAccessContent(purchase, accessLevel): boolean`
- [x] 2.2 Criar `src/lib/admin.ts` com helper `requireAdmin()` — verifica `role === ADMIN`, retorna 403 se não

## 3. API — Member endpoints

- [x] 3.1 Criar `src/app/api/contents/[slug]/route.ts`
- [x] 3.2 Criar `src/app/api/contents/[slug]/progress/route.ts`
- [x] 3.3 Criar `src/app/api/trails/route.ts`
- [x] 3.4 Criar `src/app/api/trails/[slug]/route.ts`

## 4. API — Admin endpoints (role: ADMIN)

- [x] 4.1 Criar `src/app/api/admin/contents/route.ts`
- [x] 4.2 Criar `src/app/api/admin/contents/[id]/route.ts`
- [x] 4.3 Criar `src/app/api/admin/trails/route.ts`
- [x] 4.4 Criar `src/app/api/admin/trails/[id]/route.ts`
- [x] 4.5 Criar `src/app/api/admin/trails/[id]/items/route.ts`

## 5. Atualizar user-profile

- [x] 5.1 Criar `src/app/api/user/me/route.ts` com `role` incluído na resposta

## 6. Verificação

- [x] 6.1 Auth guard em todos os endpoints — `auth()` retorna 401 se sem sessão ✓
- [x] 6.2 Admin guard via `requireAdmin()` retorna 403 para MEMBER ✓
- [x] 6.3 `canAccessContent` retorna 403 para PAID sem purchase COMPLETED ✓
- [x] 6.4 DRAFT retorna 404 via `status !== PUBLISHED` check ✓
- [x] 6.5 Upsert de progresso via `@@unique([userId, contentId])` ✓
- [ ] 6.6 Testes manuais aguardando configuração do banco (task 1.9)
