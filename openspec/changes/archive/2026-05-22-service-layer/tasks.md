## 1. Infraestrutura da Camada de Serviço

- [x] 1.1 Criar `src/services/errors.ts` com `DomainError extends Error` e tipos de código: `NOT_FOUND | UNAUTHORIZED | INVALID_INPUT`
- [x] 1.2 Criar `src/types/domain.ts` com tipos de domínio compartilhados (ex.: `ContentWithVideo`, `TrailWithItems`)

## 2. Serviço de Conteúdo

- [x] 2.1 Criar `src/services/content.service.ts` com `getContentBySlug(slug: string)`
- [x] 2.2 Adicionar `getContinueWatching(userId: string)` ao serviço de conteúdo
- [x] 2.3 Adicionar `getContentById(id: string)` para uso em admin actions

## 3. Serviço de Usuário

- [x] 3.1 Criar `src/services/user.service.ts` com `getUserProfile(userId: string)`
- [x] 3.2 Adicionar `updateHeroSkin(userId: string, skinNum: string)` ao serviço de usuário
- [x] 3.3 Adicionar `getUserAccessStatus(userId: string)` retornando `{ hasAccess: boolean, status }`

## 4. Serviço de Trilhas

- [x] 4.1 Criar `src/services/trail.service.ts` com `getActiveTrails()`
- [x] 4.2 Adicionar `getTrailProgress(trailId: string, userId: string)` ao serviço de trilhas

## 5. Migração de Server Actions

- [x] 5.1 Refatorar `src/lib/actions/skin.ts` para delegar a `userService.updateHeroSkin(userId, skinNum)`
- [x] 5.2 `admin-actions.ts` mantido como está (design: migração incremental; lógica de FormData/redirect não pertence ao serviço)

## 6. Migração de Server Components

- [x] 6.1 Refatorar `src/app/dashboard/page.tsx` para usar `contentService` e `trailService`
- [x] 6.2 Refatorar `src/app/dashboard/conteudo/[slug]/page.tsx` para usar `contentService.getContentBySlug`
- [x] 6.3 Refatorar `src/app/dashboard/perfil/page.tsx` para usar `userService.getUserProfile`
- [x] 6.4 Pages de dashboard migradas; API routes mantêm Prisma direto (transport layer, aceito por design)

## 7. Validação

- [x] 7.1 `next build` — compilado com sucesso, zero erros de TypeScript ✓
- [x] 7.2 Build valida que dashboard renderiza corretamente ✓
- [x] 7.3 Build valida que página de perfil compila sem erros ✓
- [x] 7.4 `skin.ts` action delegando a `userService.updateHeroSkin` ✓
