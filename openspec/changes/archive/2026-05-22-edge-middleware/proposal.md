## Why

O middleware atual de autenticação (`middleware.ts`) roda no Node.js runtime, adicionando latência de cold-start e consumindo recursos de serverless para cada request protegida. Mover para o Edge Runtime elimina o cold-start, reduz latência de proteção de rotas e habilita respostas de redirect antes de qualquer função serverless ser invocada.

## What Changes

- Reescrever `middleware.ts` para usar apenas APIs compatíveis com Edge Runtime (sem `node:*`, `fs`, `crypto` nativo)
- Usar `auth()` do Auth.js em modo Edge (JWT strategy, sem chamada ao banco)
- Definir `matcher` explícito cobrindo `/dashboard/:path*`, `/admin/:path*` e rotas da API autenticadas
- Remover lógica de sessão pesada do middleware — apenas verificar presença e validade do JWT
- Garantir que o `authConfig` usado pelo middleware não importe adaptadores Prisma (edge-incompatível)

## Capabilities

### New Capabilities

- `edge-middleware`: Define o contrato do middleware de autenticação no Edge Runtime — quais rotas são protegidas, qual informação é verificada (JWT apenas), e como redirects são tratados.

### Modified Capabilities

- `auth`: O fluxo de autenticação ganha uma camada edge que verifica o token antes de chegar ao Node.js runtime; o comportamento externo (redirect para `/login`) permanece o mesmo.

## Impact

- `middleware.ts`: reescrito para Edge Runtime
- `src/lib/auth.ts`: separar `authConfig` (edge-safe) de `auth` (Node.js com Prisma adapter)
- `src/lib/auth-edge.ts` (novo): exporta apenas `auth` configurado para Edge
- `package.json`: nenhuma dependência nova; Auth.js já suporta Edge
- **BREAKING**: qualquer código no middleware que use `prisma` diretamente precisa ser removido
