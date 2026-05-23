## Why

O app não tem nenhum mecanismo de autenticação implementado — rotas protegidas são acessíveis sem sessão. Esta mudança entrega o login com Google via Auth.js v5, o único provedor previsto no projeto.

## What Changes

- Implementação do middleware Next.js que protege rotas autenticadas e redireciona para `/login`
- Criação da página `/login` com o botão "Entrar com Google" e identidade visual do app
- Configuração do Auth.js v5 com o provider Google e callback de sessão
- Redirecionamento automático para `/dashboard` após login bem-sucedido
- Redirecionamento de usuários autenticados que acessam `/login` para `/dashboard`
- Exposição do endpoint `POST /api/auth/signout` para encerrar sessão

## Capabilities

### New Capabilities

- `middleware`: Define quais rotas exigem sessão ativa e como o middleware Next.js as protege

### Modified Capabilities

_(nenhuma alteração de requisitos nos specs existentes)_

## Impact

- **Arquivos novos**: `src/middleware.ts`, `src/app/(auth)/login/page.tsx`, `src/auth.ts` (ou `auth.config.ts`)
- **Arquivos modificados**: `src/app/api/auth/[...nextauth]/route.ts` (route handler do Auth.js)
- **Dependências**: `next-auth@^5`, `@auth/prisma-adapter` (já no scaffold)
- **Variáveis de ambiente necessárias**: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`
- **Banco de dados**: sem migração nova — schema já possui tabelas `Account`, `Session`, `User`
