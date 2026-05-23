## Context

A landing page pública (`/`) é a única rota sem autenticação que converte visitantes em assinantes. É composta por 8 componentes React em `src/components/landing/`, orquestrados por `src/app/page.tsx`. O estado de autenticação do usuário é propagado do Server Component raiz para o `LandingHeader`.

A página não possuía spec formal. Este design documenta as decisões de estrutura já implementadas.

## Goals / Non-Goals

**Goals:**
- Formalizar a arquitetura de componentes da landing como especificação versionada
- Servir de baseline para futuras iterações (redesign, novos blocos de copy, A/B tests)
- Documentar o contrato de dados entre `PricingSection` e o banco (produtos via Prisma)

**Non-Goals:**
- Mudanças de comportamento ou visual na landing existente
- Otimização de performance / SEO (escopo separado)
- Internacionalização (i18n)

## Decisions

**Componentes Server vs Client**
A maioria dos componentes é Server Component (`Hero`, `VideoSection`, `About`, `PricingSection`, `LandingHeader` é Client apenas pelo menu mobile, `MatchupGrid` é Client pelo estado de seleção interativo). Essa divisão minimiza o bundle JS enviado ao cliente.

**PricingSection busca do banco**
Produtos são buscados diretamente via Prisma no Server Component. Alternativa (API route + fetch no client) foi descartada — adiciona roundtrip sem benefício para uma página estática/ISR.

**MatchupGrid — locked modal**
O modal de "matchup bloqueado" usa estado local (`useState`) com animação CSS keyframes inline. Alternativa (modal global / portal) foi descartada por complexidade desnecessária para um único caso de uso.

## Risks / Trade-offs

- `PricingSection` faz query ao banco em cada request — se Prisma/DB estiver indisponível, a seção retorna lista vazia silenciosamente (fallback já implementado)
- `LandingHeader` é Client Component por causa do menu mobile; isso inclui os links de redes sociais no bundle JS — impacto negligenciável pelo tamanho
