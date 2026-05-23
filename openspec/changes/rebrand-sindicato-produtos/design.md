## Context

A plataforma foi construída inicialmente com o nome "Shaco AD" em textos de UI, metadata e emails, mas o nome correto do produto é **SINDICATO DO TITILTEI**. Os produtos no banco também refletem um catálogo antigo/placeholder. Ambas as mudanças são de dados e texto — sem alteração de schema ou lógica de negócio.

## Goals / Non-Goals

**Goals:**
- Substituir todas as ocorrências de "Shaco AD" / "Guia do Shaco AD" como nome da plataforma
- Atualizar seed com os 5 produtos corretos (deleteMany + createMany)
- Manter coerência de branding em todos os pontos de contato do usuário

**Non-Goals:**
- Alterar o schema do Prisma (modelo `Product` não muda)
- Criar lógica de acesso diferenciada por produto (access levels existentes são reaproveitados)
- Atualizar conteúdos do banco (vídeos, matchups, builds) — apenas produtos

## Decisions

### deleteMany + createMany no seed
O seed é o source of truth para produtos em dev/staging. Em vez de upsert por nome (sem unique constraint), fazemos `deleteMany()` seguido de `createMany()`. Em produção, a atualização dos produtos deve ser feita manualmente via admin ou migration de dados separada.

### Access levels dos novos produtos
Mapeamento usando os enums existentes:
- PDF → `BASIC` (acesso a conteúdo básico)
- Módulos → `PAID` (acesso a vídeos pagos)
- Análise de Gameplay → `FULL`
- Coach → `FULL`
- Acesso ao Sindicato → `FULL`

### Preços placeholder
Preços definidos como placeholder (R$ 29,90 / 67 / 97 / 197 / 47) — devem ser ajustados via seed ou admin antes de ir a produção.

## Risks / Trade-offs

[Produtos em produção] O `deleteMany` no seed apaga produtos existentes — se já houver `Purchase` referenciando um produto deletado, a FK vai falhar. → O seed só deve ser rodado em dev/staging; produção requer migration de dados separada.

[Textos hardcoded] Se houver outras ocorrências de "Shaco AD" em arquivos não cobertos pelas tasks, passarão despercebidas. → Rodar `grep -r "Shaco AD" src/` após implementação para garantir cobertura.
