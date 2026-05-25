## 1. Schema e Migração

- [x] 1.1 Adicionar campos `downloadUrl String?` e `downloadPassword String?` ao modelo `Product` em `prisma/schema.prisma`
- [x] 1.2 Gerar e aplicar a migration: `npx prisma migrate dev --name add-product-download-fields`
- [x] 1.3 Preencher `downloadUrl` e `downloadPassword` no produto PDF via seed ou diretamente no banco em dev

## 2. API — Rota de Status PIX

- [x] 2.1 Atualizar `GET /api/checkout/pix/status` (`src/app/api/checkout/pix/status/route.ts`) para buscar a `Purchase` pelo `correlationID` e incluir `downloadUrl` e `downloadPassword` do produto na resposta quando `status === COMPLETED`

## 3. Frontend — PdfPaymentModal

- [x] 3.1 Adicionar tipo `DeliveryData { downloadUrl: string | null; downloadPassword: string | null }` e estado `deliveryData` ao `PdfPaymentModal`
- [x] 3.2 No polling, ao detectar `COMPLETED`, capturar `downloadUrl` e `downloadPassword` da resposta e armazenar em `deliveryData`
- [x] 3.3 Trocar `router.push('/checkout/sucesso')` por `setView('success')` com os dados de entrega
- [x] 3.4 Implementar a view `success` no modal: link de download clicável e botão de cópia da senha com feedback visual de 2 segundos
- [x] 3.5 Tratar o caso em que `downloadUrl` ou `downloadPassword` são nulos — exibir mensagem de erro orientando contato
