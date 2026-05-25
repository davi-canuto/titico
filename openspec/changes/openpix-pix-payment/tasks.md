## 1. Cliente Woovi

- [x] 1.1 Criar `src/lib/woovi.ts` com função `createCharge({ correlationID, value, comment })` que chama `POST https://api.openpix.com.br/api/v1/charge` com header `Authorization: WOOVI_APP_ID` e retorna `{ qrCodeImage, brCode, correlationID }`
- [x] 1.2 Adicionar função `getCharge(correlationID)` em `src/lib/woovi.ts` que chama `GET https://api.openpix.com.br/api/v1/charge/{correlationID}` e retorna `{ status }` (`ACTIVE` | `COMPLETED` | `EXPIRED`)
- [x] 1.3 Ambas as funções devem lançar erro com mensagem clara se `WOOVI_APP_ID` não estiver definido

## 2. Endpoint de Criação de Cobrança PIX

- [x] 2.1 Criar `src/app/api/checkout/pix/route.ts` com handler `POST` que autentica a sessão, valida `productId`, verifica `Purchase` duplicado e chama `createCharge`
- [x] 2.2 Gerar `correlationID` no formato `${userId}-${productId}-${Date.now()}`
- [x] 2.3 Retornar `201 { correlationID, qrCodeImage, brCode }` em sucesso; `400`, `401` ou `409` nos casos de erro conforme spec

## 3. Endpoint de Polling de Status

- [x] 3.1 Criar `src/app/api/checkout/pix/status/route.ts` com handler `GET` que lê `correlationID` dos search params, valida presença e chama `getCharge`
- [x] 3.2 Retornar `200 { status }` com o status da Woovi; `400` se `correlationID` ausente; `401` se sem sessão

## 4. Webhook Woovi

- [x] 4.1 Criar `src/app/api/woovi/webhook/route.ts` com handler `POST` que lê o body raw e verifica `X-Woovi-Signature` via HMAC-SHA256 com `WOOVI_APP_ID` como chave
- [x] 4.2 Extrair `userId` e `productId` do `correlationID` (split por `-`, primeiros dois segmentos) e buscar o produto no banco para confirmar existência
- [x] 4.3 Se evento for charge `COMPLETED`, fazer `prisma.purchase.upsert` com `status: COMPLETED` e `stripeSessionId` = `correlationID` (campo reutilizado como ID de transação)
- [x] 4.4 Retornar `200` para todos os eventos (inclusive os ignorados); `401` apenas se assinatura inválida

## 5. Atualizar Modal de Pagamento

- [x] 5.1 Em `PdfPaymentModal`, adicionar estado para modo PIX: `pixData: { correlationID, qrCodeImage, brCode } | null`
- [x] 5.2 Quando PIX selecionado, chamar `POST /api/checkout/pix` e armazenar resposta em `pixData` — exibir spinner durante a criação
- [x] 5.3 Renderizar view de QR code: imagem `qrCodeImage` (tag `<img>` com src base64) + botão "Copiar código PIX" que copia `brCode` com feedback visual de 2s
- [x] 5.4 Iniciar polling `GET /api/checkout/pix/status?correlationID=xxx` a cada 3 segundos usando `setInterval` — limpar intervalo ao desmontar ou ao detectar status final
- [x] 5.5 Em `COMPLETED`: parar polling e redirecionar para `/checkout/sucesso`
- [x] 5.6 Em `EXPIRED`: parar polling, exibir erro e botão "Gerar novo QR code" que reseta `pixData` e repete o fluxo
- [x] 5.7 Remover envio de `paymentMethod` para o endpoint Stripe (botão "Cartão" chama `/api/checkout/session` sem campo `paymentMethod`)

## 6. Testes Manuais

- [ ] 6.1 Clicar "PIX" → verificar spinner → QR code exibido com botão copiar
- [ ] 6.2 Copiar código PIX → verificar feedback visual de 2s
- [ ] 6.3 Clicar "Cartão" → verificar redirect para Stripe Checkout normalmente
- [ ] 6.4 Simular pagamento PIX via painel Woovi (sandbox) → verificar redirect para `/checkout/sucesso`
- [ ] 6.5 Verificar webhook no painel Woovi → confirmar criação do `Purchase` no banco
- [ ] 6.6 Tentar pagar com produto já comprado → verificar erro `409` no modal
