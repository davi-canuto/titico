## 1. Página do Dashboard

- [x] 1.1 Criar `src/app/dashboard/page.tsx` como Server Component
- [x] 1.2 Chamar `auth()` e fazer `redirect("/login")` se não houver sessão (fallback de segurança além do middleware)
- [x] 1.3 Exibir nome do usuário (`session.user.name`)
- [x] 1.4 Exibir avatar com `next/image` usando `session.user.image`; renderizar fallback com inicial do nome se `image` for nulo
- [x] 1.5 Adicionar Server Action local que chama `signOut()` com `redirectTo: "/"`
- [x] 1.6 Renderizar botão "Sair" que dispara a Server Action de logout

## 2. Verificação Manual do Fluxo

- [x] 2.1 Testar: `/login` sem sessão → exibe a tela de login com botão Google
- [x] 2.2 Testar: clicar "Entrar com Google" → OAuth flow → redireciona para `/dashboard` com nome e foto
- [x] 2.3 Testar: acesso direto a `/dashboard` sem sessão → redireciona para `/login`
- [x] 2.4 Testar: clicar "Sair" no dashboard → sessão encerrada, redireciona para `/`
