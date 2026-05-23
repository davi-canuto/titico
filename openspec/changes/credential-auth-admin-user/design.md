## Context

O Auth.js v5 já tem um Credentials provider registrado em `src/lib/auth.config.ts`, mas o `authorize()` retorna `null` incondicionalmente — o login por senha nunca funciona. O schema Prisma não tem campo `password` no model `User`. Precisamos de um caminho de acesso admin que não dependa de conta Google.

## Goals / Non-Goals

**Goals:**
- Implementar `authorize()` com verificação bcrypt real
- Adicionar campo `password String?` ao model `User` (nullable para não quebrar usuários OAuth existentes)
- Criar script one-shot para inserir o usuário admin no banco de produção com senha hash

**Non-Goals:**
- UI de cadastro/registro por senha para usuários comuns
- Reset de senha por email
- Migração de usuários OAuth existentes para senha

## Decisions

**bcryptjs sobre argon2**
bcryptjs é pure-JS, zero dependências nativas — funciona em qualquer ambiente de deploy (incluindo Edge-adjacent). Argon2 exige binários nativos e complica o build no Vercel.

**Campo `password` nullable**
Usuários Google não terão `password`. O `authorize()` deve rejeitar login com senha se `password === null`, mantendo compatibilidade total com o fluxo OAuth existente.

**Script de seed separado (`prisma/create-admin.ts`)**
Não alterar o `seed.ts` existente, que é voltado para dados de desenvolvimento. O script admin é one-shot de produção e deve ser executado manualmente via `DATABASE_URL=<prod> tsx prisma/create-admin.ts`.

**Senha gerada e exibida uma única vez**
O script gera a senha, exibe no console e armazena apenas o hash. Após rodar, a senha não é recuperável — reforça boas práticas de segurança.

## Risks / Trade-offs

[Senha em texto plano no momento de criação] → Exibida apenas no terminal durante execução do script, nunca persistida  
[Campo nullable pode ser bypassado] → `authorize()` verifica explicitamente `if (!user.password) return null` antes do bcrypt  
[Migration em produção] → Campo nullable não tem default value e não afeta linhas existentes — migration segura sem downtime  

## Migration Plan

1. Instalar `bcryptjs` e `@types/bcryptjs`
2. Adicionar `password String?` ao schema Prisma e gerar migration
3. Implementar `authorize()` em `auth.config.ts`
4. Rodar `DATABASE_URL=<prod> npx prisma migrate deploy` em produção
5. Rodar `DATABASE_URL=<prod> tsx prisma/create-admin.ts` para criar o admin
6. Verificar login no ambiente de produção

## Open Questions

- Nenhuma. Escopo fechado e decisões tomadas.
