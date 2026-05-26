## Why

O model `Product` não tem um identificador legível por humanos — apenas um `id` gerado (cuid). Isso força o código frontend a hardcodar IDs opacos (ex: `'prod_pdf_guia_shaco_ad'`) que não existem no banco, quebrando silenciosamente o vínculo entre UI e produto real. Um campo `slug` único resolve isso: o admin define o slug ao cadastrar o produto, e o frontend referencia produtos por slug de forma estável e legível.

## What Changes

- Adicionar coluna `slug String @unique` ao model `Product` no schema Prisma
- Gerar migration com valor padrão para produtos existentes (sem quebrar dados)
- Formulários de criar e editar produto no admin passam a incluir campo `slug` (auto-gerado a partir do nome, editável)
- Server actions `createProduct` e `updateProduct` passam a ler e persistir o `slug`
- `ProductsCTA` deixa de usar ID hardcoded — passa a receber o slug do produto PDF via prop, buscado server-side por slug
- A landing page busca o produto PDF por slug e passa o `id` real para o modal de pagamento

## Capabilities

### New Capabilities

- `product-slug`: Campo slug único no Product, geração automática no admin, e lookup por slug na landing page

### Modified Capabilities

- `products`: Requisito de integridade de dados muda — produto agora tem slug obrigatório e único

## Impact

- `prisma/schema.prisma` — novo campo `slug` em `Product`
- Migration Prisma com backfill de slugs para produtos existentes
- `src/lib/admin-actions.ts` — `createProduct` e `updateProduct` leem `slug` do FormData
- Páginas de admin de produto (criar/editar) — campo slug com geração automática
- `src/components/landing/ProductsCTA.tsx` — recebe `pdfProductId` como prop
- Landing page (server component) — busca produto PDF por slug, passa `id` para `ProductsCTA`
