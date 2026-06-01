## Why

A plataforma só permite entrar via Google OAuth ou login por credenciais — mas não existe nenhum fluxo de auto-cadastro. Usuários que preferem não usar conta Google ficam sem opção, e qualquer usuário credential tem que ser criado manualmente por admin. Isso é um bloqueio de aquisição.

## What Changes

- Nova rota pública `/register` com formulário de cadastro (nome, email, senha, confirmação de senha)
- Endpoint `POST /api/auth/register` que valida unicidade de email, faz hash bcrypt (salt=12) e cria o `User` no banco
- Após cadastro bem-sucedido, autenticar o usuário via `signIn("credentials", ...)` e redirecionar para `/dashboard`
- Enviar email de boas-vindas (`welcomeEmail`) após criação da conta (fire-and-forget)
- Validação client-side e server-side: email válido, senha mínimo 8 caracteres, senhas coincidem, email único

## Capabilities

### New Capabilities

- `user-registration`: Fluxo de auto-cadastro via email e senha — página `/register`, endpoint de criação de conta, validação e integração com Auth.js

### Modified Capabilities

- `login-page`: Adicionar link "Criar conta" → `/register` na página de login

## Impact

- `src/app/register/page.tsx`: nova página pública (client component para form)
- `src/app/api/auth/register/route.ts`: endpoint POST de criação de usuário
- `src/auth.ts`: nenhuma mudança necessária (Credentials provider já aceita qualquer user com `password`)
- `src/app/(auth)/login/page.tsx`: adicionar link para `/register`
- Depende de `RESEND_API_KEY` para o email de boas-vindas (já configurado)
- Sem mudança de schema Prisma — `User.password` já existe e é nullable
