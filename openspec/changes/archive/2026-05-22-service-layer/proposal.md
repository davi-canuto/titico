## Why

Atualmente, Server Actions em `src/lib/admin-actions.ts` e `src/lib/actions/skin.ts` misturam lógica de negócio (validação, autorização, acesso ao banco) com a camada de transporte (Next.js `'use server'`). Isso dificulta testes, reuso e manutenção. Separar a lógica de negócio em uma camada de serviço pura (`src/services/`) desacopla as regras de negócio do framework.

## What Changes

- Criar `src/services/` com módulos por domínio: `content.service.ts`, `user.service.ts`, `trail.service.ts`
- Cada serviço exporta funções puras que recebem `userId` explícito (sem chamar `auth()` internamente) e retornam dados ou lançam erros de domínio
- Server Actions ficam como thin wrappers: chamam `auth()`, extraem `userId`, delegam ao serviço
- Queries de páginas (Server Components) também passam a usar os serviços em vez de chamar Prisma diretamente
- Tipos de domínio compartilhados extraídos para `src/types/`

## Capabilities

### New Capabilities

- `service-layer`: Define o contrato da camada de serviço — responsabilidades, convenções de erros de domínio, separação entre serviço (lógica) e action (transporte), e regras de teste.

### Modified Capabilities

- `content`: As queries de dados de conteúdo (page queries e mutações) passam a ser feitas via `content.service.ts` em vez de Prisma direto nas páginas/actions.
- `user-profile`: As mutações de perfil (skin, preferências) passam a ser orquestradas por `user.service.ts`.

## Impact

- `src/services/` (novo): `content.service.ts`, `user.service.ts`, `trail.service.ts`
- `src/types/` (novo): tipos de domínio compartilhados
- `src/lib/admin-actions.ts`: refatorado para delegar ao serviço
- `src/lib/actions/skin.ts`: refatorado para delegar ao serviço
- `src/app/dashboard/page.tsx` e demais pages: passam a usar serviços
- Nenhuma mudança de schema Prisma ou API externa
