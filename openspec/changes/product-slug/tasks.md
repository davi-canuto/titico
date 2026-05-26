## 1. Schema e Migration

- [x] 1.1 Adicionar `slug String @unique` ao model `Product` em `prisma/schema.prisma`
- [x] 1.2 Gerar migration com `TZ="America/Fortaleza" date +"%Y%m%d%H%M%S"` e criar o arquivo SQL com backfill: `UPDATE "Product" SET slug = id WHERE slug = ''`

## 2. Server Actions

- [x] 2.1 Em `createProduct` (`src/lib/admin-actions.ts`), ler `slug` do FormData, validar unicidade e persistir
- [x] 2.2 Em `updateProduct`, ler `slug` do FormData, validar unicidade excluindo o próprio produto, persistir

## 3. Admin — Formulário de Criar Produto

- [x] 3.1 Em `src/app/dashboard/admin/produtos/novo/page.tsx`, adicionar campo `slug` com auto-geração client-side a partir do nome via `oninput`
- [x] 3.2 Exibir mensagem de erro quando `?error=slug` estiver na URL

## 4. Admin — Formulário de Editar Produto

- [x] 4.1 Em `src/app/dashboard/admin/produtos/[id]/editar/page.tsx`, adicionar campo `slug` pré-preenchido com o valor atual
- [x] 4.2 Exibir mensagem de erro quando `?error=slug` estiver na URL

## 5. Landing Page

- [x] 5.1 Na landing page (server component pai de `ProductsCTA`), buscar produto PDF por slug `'guia-shaco-ad'` via `prisma.product.findUnique({ where: { slug, active: true } })`
- [x] 5.2 Passar `pdfProductId: product?.id ?? null` como prop para `ProductsCTA`
- [x] 5.3 Em `ProductsCTA`, substituir a constante `PDF_PRODUCT_ID` hardcoded por prop `pdfProductId: string | null`, desabilitando o botão quando `null`
