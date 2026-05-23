## Why

A landing page pública é a principal superfície de conversão do produto — é onde visitantes orgânicos e tráfego pago chegam antes de assinar. Ela não possui spec formal, o que dificulta evoluir e manter a consistência entre seções. Documentar e especificar a landing existente cria uma base sólida para iterações futuras.

## What Changes

- Criação da spec formal para a capability `landing-page`, cobrindo todas as seções públicas
- Documenta o contrato de comportamento: Hero, VideoSection, MatchupGrid (preview grátis + locked), About, PricingSection e estrutura de navegação (LandingHeader / LandingFooter)
- Nenhuma modificação de comportamento existente — é uma spec descritiva do estado atual

## Capabilities

### New Capabilities

- `landing-page`: Página pública de conversão do Guia do Shaco — cobre header, hero, seções de conteúdo (vídeo, matchups, sobre, planos) e footer

### Modified Capabilities

## Impact

- Arquivos afetados: `src/app/page.tsx`, `src/components/landing/` (todos os 8 componentes)
- Nenhuma dependência nova ou API afetada
- Spec criada em `openspec/specs/landing-page/spec.md`
