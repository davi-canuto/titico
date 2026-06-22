## Why

O fluxo de checkout tem dois problemas: (1) quando o usuário já comprou um produto, o sistema retorna um `409` tratado como erro genérico no modal — em vez de orientar o usuário de forma clara e permitir a compra de outra forma se desejar; (2) o Pix não tem controle de habilitação via admin, impossibilitando desligar o método de pagamento sem alterar código.

## What Changes

- A resposta `409 ALREADY_PURCHASED` no checkout de cartão e Pix passa a ser tratada como um estado informativo no modal/UI, não como erro
- O modal de pagamento exibe uma nova view "já possui" com mensagem clara e botão "Comprar mesmo assim" (que ignora a verificação e redireciona para o checkout Stripe)
- Novo modelo `SiteConfig` (singleton) no banco com campo `pixEnabled Boolean @default(true)`
- O endpoint `POST /api/checkout/pix` rejeita a requisição com `503 PIX_DISABLED` quando `pixEnabled: false`
- O botão Pix no `PdfPaymentModal` e qualquer menção a Pix na landing page (`PricingSection`) são ocultados quando `pixEnabled: false`
- Admin UI para alternar `pixEnabled` no painel de configurações

## Capabilities

### New Capabilities
- `admin-site-config`: Modelo e UI admin para configurações globais do site (começa com `pixEnabled`; extensível)

### Modified Capabilities
- `checkout`: O comportamento de `ALREADY_PURCHASED` muda — o endpoint mantém o `409`, mas a API de cartão passa a aceitar um parâmetro `force: true` para contornar a verificação; a rota Pix bloqueia quando `pixEnabled: false`
- `plans-page`: O tratamento de `409 ALREADY_PURCHASED` no botão "Comprar" muda de label desabilitada para estado informativo com opção de recompra

## Impact

- **Banco de dados**: nova migração Prisma para modelo `SiteConfig` (singleton `id = "global"`)
- **`src/app/api/checkout/session/route.ts`**: aceita `force: true` no body para ignorar verificação de compra existente
- **`src/app/api/checkout/pix/route.ts`**: verifica `SiteConfig.pixEnabled` antes de processar
- **`src/components/landing/PdfPaymentModal.tsx`**: nova view para `ALREADY_PURCHASED` + botão "Comprar mesmo assim"; Pix button condicional via prop
- **`src/components/landing/PricingSection.tsx`**: prop/fetch de `pixEnabled` para ocultar menções a Pix
- **`src/app/admin/`**: nova página ou seção de configurações do site
- **`src/lib/admin-actions.ts`**: action `updateSiteConfig`
