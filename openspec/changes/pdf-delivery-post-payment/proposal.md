## Why

Após o pagamento PIX de um produto PDF ser confirmado, o modal redireciona o usuário para `/checkout/sucesso` — uma página genérica de acesso à plataforma que diz "Bem-vindo ao Lobby" e aponta para o dashboard. O usuário não recebe o PDF que comprou. A entrega do produto precisa acontecer inline no modal, exibindo o link de download e a senha do arquivo assim que o pagamento é detectado.

## What Changes

- Adicionar campos `downloadUrl` e `downloadPassword` ao modelo `Product` no schema Prisma (apenas para produtos do tipo PDF).
- O `PdfPaymentModal` passa a exibir uma tela de sucesso inline (sem redirect) quando o polling detecta `COMPLETED`, mostrando o link de download e a senha do PDF.
- A rota `/api/checkout/pix/status` passa a retornar `downloadUrl` e `downloadPassword` junto ao status `COMPLETED`, buscando do produto associado à compra.
- Remover o redirect para `/checkout/sucesso` do fluxo PIX de produtos PDF.

## Capabilities

### New Capabilities

- `pdf-delivery`: Entrega do PDF pós-pagamento — exibição de link de download e senha dentro do modal após confirmação do pagamento PIX.

### Modified Capabilities

- `checkout`: A rota de status PIX agora retorna dados do produto (downloadUrl, downloadPassword) quando o pagamento é confirmado.
- `products`: O modelo Product recebe campos opcionais de entrega digital (downloadUrl, downloadPassword).

## Impact

- **Schema Prisma**: modelo `Product` — dois novos campos opcionais `String?`.
- **API**: `GET /api/checkout/pix/status` — resposta expandida com dados de entrega quando `status === COMPLETED`.
- **Frontend**: `PdfPaymentModal.tsx` — nova view `success` substituindo o `router.push('/checkout/sucesso')`.
- **Sem breaking changes** para produtos de plataforma (coaching, análise) — os campos são opcionais.
