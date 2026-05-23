## Why

O provider de Credentials no Auth.js está configurado mas retorna `null` sempre, tornando o login por email/senha completamente não funcional. Sem isso, não é possível criar um usuário admin sem uma conta Google, bloqueando o acesso administrativo à plataforma em produção.

## What Changes

- Adicionar campo `password` (nullable, String) ao model `User` no schema Prisma
- Criar migration para produção
- Instalar `bcryptjs` e seus tipos para hashing seguro de senhas
- Implementar `authorize()` no Credentials provider com verificação bcrypt
- Criar script de seed para o usuário admin com email `admin@mail.com.br` e senha hash

## Capabilities

### New Capabilities
- `credential-auth`: Login por email e senha via Credentials provider com bcrypt

### Modified Capabilities
- `auth`: Adição de campo `password` ao modelo User e implementação real do authorize()

## Impact

- **Schema**: model `User` recebe campo `password String?`
- **Migration**: necessária em produção
- **Dependências**: `bcryptjs`, `@types/bcryptjs`
- **Arquivos modificados**: `prisma/schema.prisma`, `src/lib/auth.config.ts`
- **Arquivos novos**: script de seed/admin para criar o usuário admin
