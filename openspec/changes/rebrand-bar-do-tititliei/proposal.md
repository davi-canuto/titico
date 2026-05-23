## Why

O nome "Sindicato do Titiltei" foi a primeira marca da plataforma, mas a identidade evoluiu e o nome oficial passa a ser **Bar do Tititliei**. Toda menção ao nome antigo na UI, metadata, emails e banco de dados precisa refletir a nova marca de forma consistente.

## What Changes

- Substituir todas as ocorrências de "Sindicato do Titiltei", "Sindicato" e variantes pelo nome "Bar do Tititliei" / "Bar" nas seguintes superfícies:
  - Metadata SEO (`<title>`, `<description>`, OpenGraph) em `src/app/layout.tsx`
  - Template de email de boas-vindas (`src/lib/email/templates/welcome.ts`)
  - Página de sucesso do checkout (`src/app/checkout/sucesso/page.tsx`)
  - Página de login (`src/app/(auth)/login/page.tsx`)
  - Dashboard home (`src/app/dashboard/page.tsx`)
  - Página de perfil (`src/app/dashboard/perfil/page.tsx`)
  - Página de planos (`src/app/planos/page.tsx`)
  - Componentes da landing: `Hero.tsx`, `LandingHeader.tsx`, `MatchupGrid.tsx`, `PricingSection.tsx`
  - Seed do banco de dados (`prisma/seed.ts`) — nome do produto "Acesso ao Sindicato do Titiltei"

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `email-service`: O subject e corpo do email de boas-vindas passam a usar "Bar do Tititliei" em vez de "Sindicato do Titiltei".
- `plans-page`: O hero e descrições da página de planos passam a usar "Bar do Tititliei".
- `products`: O nome do produto "Acesso ao Sindicato do Titiltei" no seed passa a ser "Acesso ao Bar do Tititliei".
- `dashboard`: O heading principal do dashboard usa "Bar do Tititliei".
- `login-page`: Os textos da página de login usam "Bar do Tititliei".

## Impact

- 12 arquivos de código-fonte alterados (somente strings de texto e metadata).
- Nenhuma alteração de schema, lógica de negócio ou APIs.
- O seed do Prisma precisa ser re-executado em ambientes de desenvolvimento para refletir o novo nome do produto — em produção, uma migration manual de dados pode ser necessária se o produto já existir no banco.
- Registros existentes de `Product` no banco com nome "Acesso ao Sindicato do Titiltei" **não são atualizados automaticamente** pelo seed (upsert por nome).
