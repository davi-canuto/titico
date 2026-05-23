## Context

O scaffold já possui `src/lib/auth.ts` (Auth.js v5 com Google provider e PrismaAdapter) e `src/middleware.ts` (exporta `auth as middleware` com matcher explícito). O que falta é: a rota de callback do Auth.js (`/api/auth/[...nextauth]`), a página `/login` com UI, e o redirecionamento pós-login para `/dashboard`.

Auth.js v5 beta usa `next-auth@^5.0.0-beta.31`. A API é estável o suficiente para os casos de uso aqui.

## Goals / Non-Goals

**Goals:**
- Entregar o fluxo completo de login Google → callback → `/dashboard`
- Proteger `/dashboard` e APIs sensíveis via middleware
- Redirecionar usuários autenticados que acessam `/login` para `/dashboard`
- Página `/login` com identidade visual mínima do app

**Non-Goals:**
- Email/password ou outros providers OAuth
- Lógica de roles/permissões (além de "autenticado vs não")
- Tela de onboarding pós-cadastro
- Testes automatizados (fora do escopo desta mudança)

## Decisions

### 1. Rota de callback via Route Handler

`src/app/api/auth/[...nextauth]/route.ts` exporta `{ GET, POST }` do `handlers` do Auth.js. Isso é obrigatório para o OAuth callback funcionar.

**Alternativa descartada**: usando o `auth.ts` como middleware puro sem route handler — não funciona, o callback OAuth precisa de um endpoint HTTP.

### 2. Login page como Server Component com Server Action

O botão "Entrar com Google" chama a Server Action que invoca `signIn("google")` do Auth.js. Não há JavaScript no cliente para o disparo do OAuth.

**Alternativa descartada**: Client Component com `signIn` do `next-auth/react` — adiciona bundle desnecessário; o Server Action é suficiente e mais simples.

### 3. Redirecionamento para /dashboard via `callbacks.redirect`

O Auth.js `authorized` callback já rejeita requisições sem sessão. Para redirecionar pós-login para `/dashboard`, aproveitamos o `callbackUrl` padrão do Auth.js — o middleware redireciona para `/login?callbackUrl=/dashboard` quando o usuário tenta acessar `/dashboard` sem sessão; após login, o Auth.js honra o `callbackUrl`.

**Alternativa descartada**: hardcodar `/dashboard` no `callbacks.redirect` — menos flexível e desnecessário dado o comportamento padrão do Auth.js.

### 4. /login redireciona autenticados via `auth()` server-side

Na page `/login`, chamamos `auth()` no Server Component; se houver sessão, fazemos `redirect("/dashboard")` do Next.js. Sem JavaScript extra no cliente.

### 5. Middleware matcher inclui /dashboard

O matcher atual protege `/(protected)/:path*` e APIs. Adicionamos `/dashboard/:path*` ao matcher para que o middleware bloqueie acesso direto sem sessão.

## Risks / Trade-offs

- **Auth.js v5 ainda em beta** → a API é estável nos endpoints que usamos, mas pode mudar em minor releases. Mitigação: pinamos a versão no `package.json`.
- **Sem HTTPS em dev** → o cookie `next-auth.session-token` não é `Secure` em localhost. Sem risco em produção se deployado com HTTPS.
- **Variáveis de ambiente ausentes** → se `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` / `AUTH_SECRET` não estiverem configuradas, o OAuth vai falhar silenciosamente em runtime. Mitigação: documentar no `.env.example` e validar na task de setup.

## Open Questions

- O `/dashboard` precisa de uma rota group `(protected)` ou um matcher direto é suficiente? → Optamos por matcher direto (`/dashboard/:path*`) por simplicidade.
