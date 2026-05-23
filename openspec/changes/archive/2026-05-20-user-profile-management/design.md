## Context

A autenticação é via Google OAuth (Auth.js v5) — o usuário não controla e-mail nem senha. Os dados de perfil editáveis são inexistentes; o foco da página é **leitura** de identidade e status de acesso. A compra é registrada em `Purchase` com `status: COMPLETED`.

O avatar e o botão de logout já existem na Navbar, mas dispersos e sem destino claro. A Navbar tem estado `'use client'` e recebe `userName`, `userImage`, `userRole` como props do layout.

## Goals / Non-Goals

**Goals:**
- Página `/dashboard/perfil` como Server Component que lê sessão + Prisma diretamente
- Mostrar identidade (avatar, nome, e-mail), status de acesso e resumo de compra
- Implementar `GET /api/user/me` (já specced, ainda sem route handler)
- Avatar na Navbar vira `<Link>` para `/dashboard/perfil`

**Non-Goals:**
- Edição de nome, e-mail ou avatar (gerenciado pelo Google)
- Cancelamento ou reembolso de compra (sem suporte Stripe ainda)
- Histórico de progresso detalhado (coberto por UserProgress, outra feature)
- Notificações ou preferências

## Decisions

### Server Component puro — sem fetch interno

A page busca dados direto pelo Prisma (mesmo padrão de `dashboard/page.tsx`). Não consome `GET /api/user/me` — a rota API existe para clientes externos e o `PlanCard` client component.

Alternativa considerada: buscar via `fetch('/api/user/me')` no Server Component. Rejeitado — self-fetch em SSR tem os mesmos problemas de URL relativa já encontrados na plans-page.

### Logout permanece na Navbar E na página de perfil

O botão de logout fica nos dois lugares: Navbar (acesso rápido) e perfil (local esperado). Não removemos da Navbar para não quebrar o fluxo atual.

### Avatar como link — sem dropdown

O avatar vira `<Link href="/dashboard/perfil">` diretamente. Um dropdown com "Perfil / Sair" seria mais rico mas adiciona complexidade de client state. Mantemos simples por ora.

## Risks / Trade-offs

- [Foto do Google pode ter domínio bloqueado pelo next/image] → Mitigation: `remotePatterns` para `lh3.googleusercontent.com` já deve estar em `next.config.ts`; verificar durante implementação
- [API route `GET /api/user/me` não tem middleware de proteção explícito] → Mitigation: chamar `auth()` dentro do handler e retornar 401 se sem sessão, conforme spec existente
