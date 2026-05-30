## Why

A rota `/preview/[contentId]` existe mas não tem nenhuma entrada orgânica — visitantes da landing não sabem que podem ver amostras reais antes de comprar. Sem isso, o preview não converte ninguém.

## What Changes

- Nova seção "Veja antes de assinar" na landing page, posicionada após `PricingSection` e antes do footer
- A seção busca server-side até 4 conteúdos publicados e exibe cards com thumbnail, título, tipo e dificuldade (matchups)
- Cada card tem link "Ver amostra gratuita →" apontando para `/preview/[contentId]`
- A query é feita diretamente no Server Component da landing (`src/app/page.tsx`) via Prisma — sem nova rota de API

## Capabilities

### New Capabilities

- `landing-content-samples`: Seção de amostras de conteúdo na landing com links para o preview público

### Modified Capabilities

(nenhuma)

## Impact

- **Modificado:** `src/app/page.tsx` — adiciona query de conteúdos e passa dados para novo componente
- **Novo:** `src/components/landing/ContentSamplesSection.tsx` — seção com grid de cards
- **Nenhuma mudança de schema** — usa model `Content` existente com `status`, `thumbnail`, `type`, `matchup`
