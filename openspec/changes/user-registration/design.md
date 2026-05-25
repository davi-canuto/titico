## Context

A plataforma já suporta login por credenciais (email + senha bcrypt) via Auth.js Credentials provider, mas só há um caminho para criar usuários com senha: o script admin manual `prisma/create-admin.ts`. Usuários comuns só entram via Google OAuth.

O schema Prisma (`User`) já tem campo `password String?` nullable. O Credentials provider já valida qualquer usuário com `password` preenchido. Ou seja, o lado de _login_ já está pronto — falta apenas o fluxo de _cadastro_.

## Goals / Non-Goals

**Goals:**
- Permitir que qualquer visitante crie uma conta com nome, email e senha
- Redirecionar automaticamente para `/dashboard` após cadastro (sem segundo login)
- Enviar email de boas-vindas após criação (fire-and-forget)
- Linkagem bidirecional entre `/login` e `/register`

**Non-Goals:**
- Verificação de email (magic link, código OTP) — fora de escopo desta change
- Login social para usuários recém-cadastrados (Google já funciona separadamente)
- Campos além de nome, email e senha (avatar, username, etc.)
- Rate limiting no endpoint de registro (tratado pela spec `api-rate-limiting` existente)

## Decisions

### D1: Endpoint server-side `POST /api/auth/register`

O cadastro ocorre via Route Handler (Next.js App Router), não via Server Action. Motivo: respostas HTTP explícitas (status 409 para email duplicado, 400 para validação) são mais fáceis de tratar no client component sem depender de `useFormState`.

**Alternativa considerada:** Server Action com `useFormState` — descartado por acoplamento ao React 19 `useActionState` e maior dificuldade de retornar status codes semânticos.

### D2: `signIn("credentials")` chamado client-side após sucesso do registro

Após `POST /api/auth/register` retornar 201, o client chama `signIn("credentials", { email, password, redirect: false })` e então `router.push("/dashboard")`. Isso evita duplicar a lógica de criação de sessão no endpoint de registro.

**Alternativa considerada:** Registrar e criar sessão direto no Route Handler via `auth()` / cookies — a API interna de criação de sessão do Auth.js v5 não é pública e pode quebrar entre minor versions.

### D3: Validação duplicada (client + server)

Client: validação em tempo real no formulário (React state). Server: revalidação completa no Route Handler antes de qualquer operação no banco. A validação server é a fonte de verdade — a client é apenas UX.

### D4: Email de boas-vindas fire-and-forget

`sendWelcomeEmail` é chamado após o upsert do usuário sem `await` no caminho crítico. Falha de email não impede o cadastro.

## Risks / Trade-offs

- [Race condition de email duplicado] → Prisma lança `P2002` (unique constraint) se dois cadastros simultâneos passarem pela verificação prévia. Mitigação: tratar `P2002` no catch e retornar 409.
- [Usuário cadastra com email já usado via Google] → O campo `email` é unique no banco. Retornar 409 com mensagem "Email já em uso — tente fazer login com Google" cobre este caso.
- [Senha fraca] → Validação mínima de 8 caracteres. Não implementamos política complexa nesta change.
