## Context

O `titico-app` tem um `src/app/page.tsx` que é puramente um redirect gate — manda autenticados para `/dashboard` e anônimos para `/login`. Não existe uma landing page pública. A única presença de marketing é um projeto separado (`../titico`) que vende via WhatsApp.

O `titico-app` já possui toda a infraestrutura de venda: Prisma `Product`, Stripe Checkout, webhook, páginas pós-checkout. O gap é a vitrine pública que conecta visitante ao produto.

## Goals / Non-Goals

**Goals:**
- Criar uma homepage pública em `/` que substitui o redirect gate
- Portar a identidade visual do `../titico` (Shaco splash, MatchupGrid interativo, About, VideoSection)
- Incorporar uma seção de pricing inline que exibe produtos do banco e inicia checkout Stripe
- Criar um caminho claro para o visitante: Landing → Pricing → Login → Checkout → Dashboard

**Non-Goals:**
- Não remover `/planos` (mantém como URL direta para compartilhamento)
- Não alterar schema do banco, auth ou dashboard
- Não migrar matchups para o banco de dados — continuam hardcoded em `src/data/matchups.ts`
- Não implementar animações além das já existentes no `../titico`
- Não fazer SSG/ISR na landing por ora (pode ser adicionado depois)

## Decisions

### 1. Placement: `src/app/page.tsx` direto (não route group)

Alternativa: criar `src/app/(public)/page.tsx`. Rejeitada — a homepage é única, não há outras public-only pages que justifiquem o grupo. O `layout.tsx` raiz já é adequado.

### 2. Componentes em `src/components/landing/`

Isolamento de componentes da landing em `/landing/` (vs `/platform/`) evita confusão. Os dois namespaces têm propósitos distintos: marketing vs app autenticado.

### 3. `PricingSection` como Server Component com Prisma direto

Alternativa: `fetch('/api/products')` client-side. Rejeitada — dentro de Server Components, a query Prisma direta é mais simples, sem round-trip HTTP. Mesmo padrão do dashboard e admin.

### 4. Dados de matchups: `src/data/matchups.ts` copiado de `../titico`

Os matchups são conteúdo editorial estático (5 free + 32 locked). Não fazem sentido no banco como `Content` de tipo MATCHUP pois têm campos específicos (estrategia[], dicas[], detalhes[]). Copiamos o arquivo como está.

### 5. CTA de checkout para usuários não autenticados

`/login?callbackUrl=/` — após login, o usuário retorna para a landing. O fluxo de compra continua a partir dos botões de pricing.

Alternativa: `/login?callbackUrl=/planos`. Rejeitada — queremos manter o usuário na experiência da landing, não fragmentar em uma segunda página de planos.

### 6. Modal de matchup locked: scroll para `#pricing`

Em vez de abrir WhatsApp, o botão da caixinha explodida faz `window.location.hash = '#pricing'` e fecha o modal. Mantém o usuário no site e converte para o checkout Stripe.

### 7. Header da landing separado do `Navbar` da plataforma

O `Navbar` do dashboard tem estado de sessão (avatar, nome, badge ADMIN). O `LandingHeader` é estático: logo + nav âncoras + botão "Entrar". A sessão é buscada no Server Component pai (`page.tsx`) para determinar se o botão "Entrar" vira "Ir para a plataforma".

### 8. Layout da seção Pricing: referências Stripe / Linear / Vercel

- Grid 3 colunas no desktop, 1 no mobile
- Card do plano destacado (`POPULAR`) com borda `border-[#e3001b]` e badge
- Features listadas com ícone de check SVG inline (`#4ade80`)
- Preço grande em destaque, cobrança única (não recorrente)
- CTA primário vermelho por card

## Risks / Trade-offs

- **[Dados hardcoded]** Os matchups free não refletem mudanças no banco de conteúdos → Aceitável: são conteúdo editorial; mudanças são raras e intencionais
- **[SSR sem cache]** `PricingSection` faz query Prisma a cada request → Mitigação futura: adicionar `unstable_cache` ou ISR; por ora aceitável dado volume baixo
- **[Modal animado com CSS inline]** O modal da caixinha usa `<style>` injected inline no JSX (copiado do `../titico`) → Risco de conflito de classe mínimo; encapsulado no componente `MatchupGrid`
- **[`/planos` duplica pricing]** Dois lugares exibindo planos pode ficar desincronizado → Mitigação: ambos buscam do mesmo Prisma, sem duplicação de lógica — apenas de markup
