## Why

O sistema atual de controle de acesso é binário: qualquer compra concluída libera todo o conteúdo não-FREE. Os enum `AccessLevel` (FREE / BASIC / PAID / FULL) existem no schema de Content, Trail e Product mas a hierarquia não é aplicada — `canAccessContent` só verifica se existe uma `Purchase` com status `COMPLETED`.

Isso quebra a proposta de valor dos planos: um usuário que comprou o PDF (BASIC) acessa os mesmos conteúdos de quem comprou o plano completo (FULL).

## What Changes

O access level é um sistema de configuração controlado pelo admin — o Stripe é apenas o mecanismo de pagamento, não a fonte de verdade do acesso.

**Admin controla os dois lados:**
- Cada **produto** tem um `accessLevel` configurável (qual nível ele concede ao comprador)
- Cada **conteúdo/trilha** tem um `accessLevel` configurável (qual nível mínimo é necessário para acessar)

**Fluxo de acesso:**
1. Admin define `Product.accessLevel = PAID` para um plano
2. Admin define `Content.accessLevel = PAID` para um vídeo premium
3. Usuário compra o produto → Stripe webhook atribui `User.accessLevel = PAID`
4. Usuário tenta acessar o conteúdo → `canAccess(PAID, PAID)` → liberado
5. Usuário BASIC tenta acessar → `canAccess(BASIC, PAID)` → bloqueado

**Hierarquia:** `FREE < BASIC < PAID < FULL`

**O que é implementado:**
- `User.accessLevel` armazenado no banco (padrão FREE, atualizado via webhook para o nível do produto comprado — sempre o maior entre o atual e o novo)
- `canAccess(userLevel, contentLevel)` com comparação hierárquica substitui a lógica binária atual
- Content player mostra overlay de bloqueio com CTA para `/planos` (sem expor URL do vídeo/PDF)
- Cards no Explorar indicam visualmente o conteúdo bloqueado
- Admin pode sobrescrever `User.accessLevel` manualmente (para suporte/casos especiais)

## Capabilities

### New Capabilities
- `access-control`: Controle hierárquico de acesso a conteúdos e trilhas por nível configurável pelo admin (FREE < BASIC < PAID < FULL)

### Modified Capabilities
- `content-player`: Gate de acesso usa nível do usuário vs nível do conteúdo
- `admin-content-management`: Admin edita `accessLevel` de produtos, conteúdos e usuários — tudo na mesma interface existente

## Impact

- `prisma/schema.prisma`: `User.accessLevel AccessLevel @default(FREE)`
- Nova migration Prisma
- `src/lib/access.ts`: hierarquia tipada + `canAccess` + `maxLevel`
- `src/lib/auth.config.ts`: expor `accessLevel` na session/JWT
- `src/app/api/stripe/webhook/route.ts`: `user.update({ accessLevel: maxLevel(...) })` após compra
- `src/app/dashboard/conteudo/[slug]/page.tsx`: gate + overlay de bloqueio
- `src/app/dashboard/explorar/page.tsx` + `ContentCard.tsx`: badge de conteúdo bloqueado
- `src/lib/admin-actions.ts`: `setUserAccessLevel(userId, level)`
