## Context

`middleware.ts` atual usa `auth()` do Auth.js que internamente pode tentar usar o adaptador Prisma — incompatível com Edge Runtime. O middleware precisa apenas verificar se existe um token JWT válido e redirecionar para `/login` se ausente. Não precisa buscar dados do usuário no banco nesta camada.

## Goals / Non-Goals

**Goals:**
- Middleware rodando no Edge Runtime sem dependências Node.js
- Verificação de token JWT apenas (sem query ao banco)
- `matcher` explícito cobrindo rotas protegidas
- Separação de `authConfig` edge-safe de `auth` full (com Prisma adapter)

**Non-Goals:**
- Lógica de autorização por role no middleware (ADMIN vs USER) — isso fica nas páginas/Server Actions
- Rate limiting no middleware nesta iteração
- Geolocalização ou personalização por região

## Decisions

### Separar authConfig em arquivo dedicado

`src/lib/auth.config.ts` exporta apenas a configuração Auth.js sem imports de Prisma. O middleware importa deste arquivo. `src/lib/auth.ts` continua importando o adapter Prisma para uso nos Server Components.

*Alternativa considerada*: Usar `import { auth } from 'next-auth'` com `runtime = 'edge'` global — descartado porque `PrismaAdapter` usa `node:crypto` e falha no Edge.

### JWT strategy no middleware

O middleware valida apenas a presença e assinatura do JWT (`NEXTAUTH_SECRET`). Dados do usuário (role, id) são lidos a partir do token sem roundtrip ao banco.

### matcher pattern explícito

```ts
matcher: ['/dashboard/:path*', '/dashboard/admin/:path*']
```

Rotas públicas (`/`, `/login`, `/planos`, `/api/auth/:path*`) não entram no matcher.

## Risks / Trade-offs

[Token revogado ainda passa] JWT expirado é bloqueado, mas token de sessão invalidado manualmente (ex.: ban de usuário) ainda é válido até expirar → aceito para MVP; solução completa exige token blacklist

[Divergência de runtime] Se `auth.config.ts` importar algo incompatível com Edge acidentalmente, build falha com mensagem obscura → mitigado por teste de build explícito após a mudança

[Dados de sessão desatualizados no token] Role do usuário no JWT pode ficar stale após mudança manual no banco → aceito; requer re-login para atualizar

## Migration Plan

1. Criar `src/lib/auth.config.ts` com providers e callbacks, sem Prisma
2. Reescrever `middleware.ts` importando `auth` from `src/lib/auth.config.ts`
3. Atualizar `src/lib/auth.ts` para extender `auth.config.ts` com o adapter Prisma
4. Rodar `next build` — verificar ausência de erros de Edge runtime
5. Testar redirecionamento para `/login` sem sessão e acesso normal com sessão válida
6. Rollback: restaurar `middleware.ts` anterior — nenhuma mudança de banco
