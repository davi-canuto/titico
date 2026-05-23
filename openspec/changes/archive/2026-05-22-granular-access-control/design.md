## Context

O schema Prisma já define `AccessLevel { FREE, BASIC, PAID, FULL }` usado em `Content.accessLevel`, `Trail.accessLevel` e `Product.accessLevel`. A função `canAccessContent` em `src/lib/access.ts` ignora a hierarquia — só checa `purchase?.status === COMPLETED`.

O `User` não tem campo `accessLevel`. O nível do usuário precisa ser armazenado para evitar recalcular a partir de todas as purchases a cada request.

## Goals / Non-Goals

**Goals:**
- Definir hierarquia explícita: FREE < BASIC < PAID < FULL
- `User.accessLevel` reflete o maior nível já comprado (atualizado via webhook)
- `canAccessContent(userLevel, contentLevel)` usa comparação hierárquica
- Conteúdo bloqueado mostra estado de lock com CTA para `/planos`
- Admin pode sobrescrever `User.accessLevel` manualmente

**Non-Goals:**
- Downgrade de acesso por reembolso (fica para fase futura)
- Expiração de acesso (modelo é vitalício)
- Múltiplos produtos simultâneos com diferentes níveis (pega o mais alto)

## Decisions

**Hierarquia como constante tipada:**
```ts
// src/lib/access.ts
const LEVEL_ORDER: Record<AccessLevel, number> = {
  FREE: 0,
  BASIC: 1,
  PAID: 2,
  FULL: 3,
}

export function canAccess(userLevel: AccessLevel, contentLevel: AccessLevel): boolean {
  return LEVEL_ORDER[userLevel] >= LEVEL_ORDER[contentLevel]
}

export function maxLevel(a: AccessLevel, b: AccessLevel): AccessLevel {
  return LEVEL_ORDER[a] >= LEVEL_ORDER[b] ? a : b
}
```

**User.accessLevel atualizado no webhook:**
```ts
// após upsert da Purchase
await prisma.user.update({
  where: { id: userId },
  data: {
    accessLevel: maxLevel(user.accessLevel, product.accessLevel),
  },
})
```

**Server Components leem `user.accessLevel` direto da session ou DB:**
- A session do Auth.js já retorna o `User` — adicionar `accessLevel` no token JWT via `callbacks.jwt` e `callbacks.session` em `auth.config.ts`
- Pages de conteúdo recebem o `accessLevel` da session sem query extra

**Estado locked no content player:**
- Se `!canAccess(session.user.accessLevel, content.accessLevel)`: renderiza overlay com cadeado e botão "Ver planos"
- O vídeo/conteúdo não é carregado (nem URL exposta) quando bloqueado

**ContentCard no explorar:**
- Badge "BLOQUEADO" em vermelho quando o nível do card supera o do usuário
- Card clicável normalmente (leva para a página que mostra o lock)

## Risks / Trade-offs

- **Session stale**: se `accessLevel` for cacheado no JWT, um comprador precisará fazer re-login para ver o acesso liberado. Mitigação: após compra bem-sucedida (`/checkout/sucesso`), forçar refresh da session via `update()` do Auth.js ou redirecionar para `/api/auth/session?update`.
- **Admin override**: dar ao admin poder de setar qualquer `accessLevel` é um vetor de abuso — mitigar com `requireAdmin()` guard já existente.
