## Context

O middleware do Auth.js já protege `/dashboard/:path*`. Após login com Google o usuário é redirecionado para `/dashboard`, mas a rota não existe. A sessão está disponível via `auth()` (Server Component) sem fetch adicional.

## Goals / Non-Goals

**Goals:**
- Página `/dashboard` funcional que valida o fluxo de auth de ponta a ponta
- Exibir nome e avatar do usuário logado
- Logout funcional via Server Action

**Non-Goals:**
- Design final do dashboard
- Qualquer conteúdo de produto (matchups, vídeos, etc.)

## Decisions

**Server Component + Server Action para logout**
`auth()` é um Server Component API — não precisa de `useSession` ou Client Component. O logout usa `signOut()` em Server Action, evitando expor endpoint REST customizado.

**Sem layout próprio por enquanto**
O `app/layout.tsx` raiz já cobre o necessário para uma página de verificação. Um layout de dashboard dedicado virá quando houver navegação real.

## Risks / Trade-offs

- [Avatar pode ser `null`] → Renderizar um fallback com inicial do nome se `image` for nulo
