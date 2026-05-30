## 1. Schema e Migration

- [x] 1.1 Adicionar campo `pixKey String?` ao model `Creator` em `prisma/schema.prisma`
- [x] 1.2 Gerar migration com `prisma migrate dev --name add-creator-pix-key`

## 2. Woovi Client

- [x] 2.1 Adicionar tipo `WooviSplit` em `src/lib/woovi.ts`: `{ pixAlias: { key: string }; value: number }`
- [x] 2.2 Adicionar parâmetro opcional `splits?: WooviSplit[]` à função `createCharge` e incluí-lo no body da requisição quando presente

## 3. Endpoint de Checkout Pix

- [x] 3.1 Em `src/app/api/checkout/pix/route.ts`, buscar o creator do produto com `include: { creator: { select: { pixKey: true } } }`
- [x] 3.2 Montar o array `splits` quando `creator.pixKey` não for nulo: `[{ pixAlias: { key: creator.pixKey }, value: Math.floor(product.price * 0.8) }]`
- [x] 3.3 Passar `splits` para `createCharge` (omitir o campo quando não houver pixKey)

## 4. Admin UI — Creators

- [x] 4.1 Adicionar campo `pixKey` no formulário de criação de creator em `src/app/dashboard/admin/page.tsx`
- [x] 4.2 Atualizar a server action `createCreator` em `src/lib/admin-actions.ts` para ler e salvar o campo `pixKey`
- [x] 4.3 Adicionar exibição e edição de `pixKey` para creators existentes na listagem do admin (inline ou via form separado)
