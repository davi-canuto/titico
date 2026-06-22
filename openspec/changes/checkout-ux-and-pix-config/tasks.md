## 1. Banco de dados — SiteConfig

- [x] 1.1 Adicionar modelo `SiteConfig` em `prisma/schema.prisma` com campos `id String @id @default("global")` e `pixEnabled Boolean @default(true)`
- [x] 1.2 Gerar e executar migração Prisma (`prisma migrate dev --name add-site-config`)
- [x] 1.3 Adicionar seed/upsert do registro `id = "global"` na migração ou em `prisma/seed.ts`

## 2. API — checkout/session: suporte a force

- [x] 2.1 Atualizar `bodySchema` em `src/app/api/checkout/session/route.ts` para aceitar `force?: boolean`
- [x] 2.2 Condicionar a verificação de `ALREADY_PURCHASED` ao valor de `force` (se `force: true`, pular o check)

## 3. API — checkout/pix: verificar pixEnabled

- [x] 3.1 No início de `POST /api/checkout/pix`, buscar `SiteConfig.pixEnabled` via Prisma
- [x] 3.2 Retornar `503 { error: "PIX_DISABLED" }` quando `pixEnabled = false`

## 4. Server Action — updateSiteConfig

- [x] 4.1 Adicionar função `updateSiteConfig(data: { pixEnabled?: boolean })` em `src/lib/admin-actions.ts` com guard de role ADMIN, `upsert` no banco e `revalidatePath("/")`

## 5. UI — Modal de pagamento

- [x] 5.1 Em `PdfPaymentModal.tsx`, receber prop `pixEnabled: boolean` e ocultar o botão PIX quando `false`
- [x] 5.5 Em `BookingPaymentModal.tsx`, receber prop `pixEnabled: boolean` e ocultar o botão PIX quando `false`
- [x] 5.2 Em `handleCard`, detectar `res.status === 409` (`ALREADY_PURCHASED`) e alternar para uma nova view `'already-purchased'` em vez de exibir erro genérico
- [x] 5.3 Implementar view `'already-purchased'` no modal: mensagem "Você já possui este produto." + botão "Comprar mesmo assim" que chama `handleCard(force=true)`
- [x] 5.4 Atualizar `handleCard` para aceitar `force?: boolean` e incluir `force: true` no body da requisição quando acionado pelo botão de recompra

## 6. UI — Landing page

- [x] 6.1 Em `PricingSection.tsx` (ou componente pai), buscar `SiteConfig.pixEnabled` do banco e passar como prop para o modal e para cards de produto
- [x] 6.2 Ocultar badges/ícones/textos de Pix na `PricingSection` quando `pixEnabled = false`

## 7. Admin UI — configurações do site

- [x] 7.1 Criar página ou seção de configurações em `src/app/admin/` com toggle "Pagamento via Pix" que chama `updateSiteConfig`
- [x] 7.2 Garantir que a página só seja acessível por usuários com `role: ADMIN`
