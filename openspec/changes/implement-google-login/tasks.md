## 1. Variáveis de Ambiente

- [x] 1.1 Adicionar `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` e `AUTH_SECRET` ao `.env.local` (valores reais do Google Cloud Console)
- [x] 1.2 Adicionar as mesmas chaves ao `.env.example` com valores placeholder

## 2. Route Handler do Auth.js

- [x] 2.1 Criar `src/app/api/auth/[...nextauth]/route.ts` exportando `{ GET, POST }` de `handlers` em `@/lib/auth`

## 3. Middleware — Atualizar Matcher

- [x] 3.1 Atualizar `src/middleware.ts` para adicionar `/dashboard/:path*` ao matcher e remover o padrão `/(protected)/:path*` se não houver rotas nesse grupo

## 4. Página de Login

- [x] 4.1 Criar `src/app/(auth)/login/page.tsx` como Server Component
- [x] 4.2 Na page, chamar `auth()` e fazer `redirect("/dashboard")` se houver sessão ativa
- [x] 4.3 Adicionar Server Action local que chama `signIn("google")` com `redirectTo: "/dashboard"`
- [x] 4.4 Renderizar layout da página: nome do app "Titiltei — Guia do Shaco AD", botão "Entrar com Google" que dispara a Server Action

## 5. Verificação Manual do Fluxo

- [x] 5.1 Testar: acesso a `/dashboard` sem sessão → redireciona para `/login`
- [x] 5.2 Testar: clicar "Entrar com Google" → OAuth flow → retorna para `/dashboard`
- [x] 5.3 Testar: acessar `/login` com sessão ativa → redireciona para `/dashboard`
- [x] 5.4 Testar: `POST /api/auth/signout` → invalida sessão e redireciona para `/`
