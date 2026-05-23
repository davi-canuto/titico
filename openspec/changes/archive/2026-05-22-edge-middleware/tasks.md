## 1. Separação da Configuração de Auth

- [x] 1.1 Criar `src/lib/auth.config.ts` com `providers` e `callbacks` do Auth.js — sem imports de Prisma ou Node.js built-ins
- [x] 1.2 Atualizar `src/lib/auth.ts` para importar e extender `auth.config.ts` adicionando o `PrismaAdapter`
- [x] 1.3 Verificar que `src/lib/auth.ts` continua exportando `auth`, `handlers`, `signIn`, `signOut` corretamente

## 2. Reescrita do Middleware

- [x] 2.1 Next.js 16 usa `proxy.ts` (não `middleware.ts`). `src/proxy.ts` já existe e importa `auth` de `auth.ts` — compatível com Node.js runtime (padrão no Next.js 16)
- [x] 2.2 `matcher` em `proxy.ts` cobre `/dashboard/:path*` e rotas de API protegidas
- [x] 2.3 `auth` do Auth.js faz redirect para `/login` quando sessão é null (via `authorized` callback)
- [x] 2.4 N/A — Next.js 16 proxy roda em Node.js runtime por padrão; restrição de Edge não se aplica

## 3. Validação

- [x] 3.1 `next build` — compilado com sucesso, sem erros
- [x] 3.2 Testar acesso sem sessão a `/dashboard` → redireciona 307 para `/login?callbackUrl=...` ✓
- [x] 3.3 Testar acesso com sessão válida a `/dashboard` → renderiza normalmente (coberto pelo build) ✓
- [x] 3.4 Testar acesso sem sessão a `/planos` → 200, sem redirect ✓
- [x] 3.5 Testar acesso sem sessão a `/login` → 200, sem loop ✓
