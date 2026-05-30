## 1. Endpoint de Cadastro

- [x] 1.1 Criar `src/app/api/auth/register/route.ts` com handler `POST` que recebe `{ name, email, password }`
- [x] 1.2 Implementar validação server-side: campos obrigatórios, formato de email, senha ≥ 8 caracteres — retornar `400` em caso de falha
- [x] 1.3 Verificar se o email já existe no banco (`prisma.user.findUnique`) e retornar `409` se sim
- [x] 1.4 Fazer hash da senha com `bcrypt.hash(password, 12)` e criar o `User` via `prisma.user.create`
- [x] 1.5 Tratar erro Prisma `P2002` (unique constraint race condition) e retornar `409`
- [x] 1.6 Chamar `sendWelcomeEmail(email, name)` fire-and-forget após criação bem-sucedida
- [x] 1.7 Retornar `201 { id, email, name }` em caso de sucesso

## 2. Página de Cadastro

- [x] 2.1 Criar `src/app/register/page.tsx` como client component com formulário: nome, email, senha, confirmar senha
- [x] 2.2 Implementar validação em tempo real: senhas coincidem, email válido, campos obrigatórios — desabilitar submit enquanto inválido
- [x] 2.3 No submit: chamar `POST /api/auth/register`; em caso de erro exibir mensagem inline (409 → "Email já em uso", 400 → mensagem do servidor)
- [x] 2.4 Em caso de sucesso (201): chamar `signIn("credentials", { email, password, redirect: false })` e redirecionar para `/dashboard`
- [x] 2.5 Aplicar design system Shaco: fundo `#0d0d0d`, card `#161616`, botão primário vermelho, texto branco, inputs com `border-white/10`
- [x] 2.6 Adicionar link "Já tenho conta → Entrar" apontando para `/login`
- [x] 2.7 Redirecionar para `/dashboard` se o usuário já tiver sessão ativa (verificar com `useSession` ou `auth()`)

## 3. Atualizar Página de Login

- [x] 3.1 Adicionar link "Criar conta" → `/register` na página `/login` (`src/app/(auth)/login/page.tsx` ou similar)

## 4. Testes Manuais

- [x] 4.1 Cadastrar usuário novo → verificar redirecionamento para `/dashboard` e sessão ativa
- [x] 4.2 Tentar cadastrar com email já existente → verificar mensagem de erro 409
- [x] 4.3 Tentar cadastrar com senha curta (< 8 chars) → verificar bloqueio client-side e server-side
- [x] 4.4 Tentar cadastrar com senhas diferentes → verificar bloqueio client-side
- [x] 4.5 Após cadastro, verificar que login com as mesmas credenciais funciona normalmente em `/login`
- [x] 4.6 Verificar email de boas-vindas recebido (checar logs do Resend se `RESEND_API_KEY` configurado)
- [x] 4.7 Verificar que usuário autenticado redirecionado de `/register` para `/dashboard`
