## Why

O nome "Shaco AD" estava sendo usado como título da plataforma, mas é apenas o campeão ensinado — não o nome do produto. O nome correto da plataforma é **SINDICATO DO TITILTEI**, e toda a UI, metadata e comunicação deve refletir isso. Além disso, o catálogo de produtos precisa ser atualizado para representar a oferta real: não apenas "acesso à plataforma", mas produtos distintos (PDF, módulos, análise, coaching).

## What Changes

- Renomear todas as referências a "Shaco AD" / "Guia do Shaco AD" como nome da plataforma para "SINDICATO DO TITILTEI"
- Atualizar metadata SEO (`layout.tsx`), heading do dashboard, hero da página de planos e template de email de boas-vindas
- Substituir produtos existentes por 5 novos produtos com descrições e preços corretos:
  - **PDF** — material em PDF para consulta offline
  - **Módulos** — videoaulas de jungle (rota, invade, macro)
  - **Análise de Gameplay** — análise personalizada por Titiltei
  - **Coach** — sessão ao vivo com Titiltei
  - **Acesso ao Sindicato do Titiltei** — acesso completo e atualizado à plataforma
- Atualizar `prisma/seed.ts` com os novos produtos

## Capabilities

### New Capabilities

_(nenhuma nova capability — mudanças são de conteúdo/dados, não de comportamento)_

### Modified Capabilities

- `plans-page`: textos do hero e FAQ atualizados para refletir o novo nome e catálogo de produtos
- `products`: catálogo de produtos substituído (novos nomes, descrições, preços e access levels)
- `email-service`: subject e corpo do email de boas-vindas atualizados com o novo nome da plataforma

## Impact

- `src/app/layout.tsx` — metadata title/description/og
- `src/app/dashboard/page.tsx` — heading principal
- `src/app/planos/page.tsx` — hero text e descrição
- `src/lib/email/templates/welcome.ts` — subject e corpo
- `prisma/seed.ts` — seção de produtos (deleteMany + createMany com os 5 novos)
