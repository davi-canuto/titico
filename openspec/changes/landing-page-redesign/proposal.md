## Why

A rota `/` do `titico-app` não existe como landing page — a venda acontece em um projeto separado (`../titico`) que usa WhatsApp como único canal de conversão. Isso cria fricção: o usuário precisa sair do fluxo digital para comprar, e não há caminho direto da landing para o checkout Stripe ou para a plataforma. O objetivo é unificar tudo numa única URL pública, com pricing inline e acesso à plataforma a um clique.

## What Changes

- **Nova rota `/`** — página pública que substitui a ausência de homepage; agrega todas as seções da landing do `../titico`
- **Seção Pricing inline** — cards de planos buscados do banco (Prisma), com CTA que inicia checkout Stripe diretamente (ou redireciona para `/login` se não autenticado)
- **Header público** — logo + nav por âncoras + botão "Entrar" → `/login` (sem Navbar do dashboard)
- **MatchupGrid** — modal de conteúdo bloqueado redireciona para `#pricing` na mesma página, não para WhatsApp
- **Remoção dos CTAs de WhatsApp** de compra — substituídos pelo flow Stripe; CTAs de coaching/contato podem manter WhatsApp
- **`/planos`** deixa de ser a única entrada de pricing — o usuário chega lá também pela landing
- Dados de matchups (`src/data/matchups.ts`) migrados do `../titico` para dentro do `titico-app`

## Capabilities

### New Capabilities

- `landing-page`: Página pública `/` com seções Hero, VideoSection, MatchupGrid interativo, About, Pricing e Footer; header com nav âncoras e acesso à plataforma

### Modified Capabilities

- `plans-page`: A lógica de exibição de planos e CTA de checkout agora também é usada inline na landing (componente `PricingSection` reutilizável); `/planos` pode continuar existindo como URL direta

## Impact

- **Nova rota**: `src/app/page.tsx` (ou `src/app/(public)/page.tsx`)
- **Novos componentes**: `src/components/landing/` — `LandingHeader`, `Hero`, `VideoSection`, `MatchupGrid`, `MatchupPanel`, `About`, `PricingSection`, `LandingFooter`
- **Migração de dados**: `src/data/matchups.ts` copiado de `../titico`
- **Dependências existentes**: `src/lib/stripe.ts`, `src/app/api/checkout/session/route.ts`, Prisma `Product` model
- **Sem mudança de schema**: nenhuma migration necessária
- **`/planos`**: pode ser mantida ou redirecionada para `/#pricing`
