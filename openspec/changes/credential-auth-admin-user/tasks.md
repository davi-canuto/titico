## 1. Dependências

- [x] 1.1 Instalar `bcryptjs` e `@types/bcryptjs`

## 2. Schema e Migration

- [x] 2.1 Adicionar campo `password String?` ao model `User` em `prisma/schema.prisma`
- [x] 2.2 Gerar migration com `npx prisma migrate dev --name add-user-password`

## 3. Implementação do authorize

- [x] 3.1 Atualizar `src/lib/auth.config.ts`: implementar `authorize()` com busca por email no banco e verificação `bcrypt.compare`
- [x] 3.2 Garantir que `authorize()` retorna `null` se `user.password === null` (usuários OAuth)

## 4. Script de criação do admin

- [x] 4.1 Criar `prisma/create-admin.ts` que gera hash bcrypt da senha e insere o usuário `admin@mail.com.br` com `role = ADMIN` via upsert

## 5. Verificação

- [x] 5.1 Rodar `DATABASE_URL=<prod> npx prisma migrate deploy` para aplicar a migration em produção
- [x] 5.2 Rodar `DATABASE_URL=<prod> tsx prisma/create-admin.ts` para criar o admin em produção
- [x] 5.3 Testar login com `admin@mail.com.br` e a senha gerada no ambiente de produção
