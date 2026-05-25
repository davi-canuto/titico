## Context

O modal de pagamento atual (`PdfPaymentModal`) envia o usuário ao Stripe Checkout tanto para cartão quanto para PIX. PIX via Stripe não está ativado na conta e, mesmo que estivesse, o fluxo de redirect é inadequado — PIX requer exibição de QR code inline. A Woovi (OpenPix) é especializada em PIX e provê API REST simples: criação de cobrança retorna QR code (base64) + código copia-e-cola + `correlationID` para rastreamento. O Stripe continua sem alteração para cartões.

## Goals / Non-Goals

**Goals:**
- Gerar cobranças PIX via Woovi e exibir QR code + copia-e-cola dentro do próprio modal
- Confirmar pagamento via polling client-side (3s de intervalo, timeout de 10min)
- Confirmar pagamento via webhook Woovi como fallback server-side
- Criar `Purchase` no banco ao confirmar, prevenindo duplicatas com `upsert`
- Manter Stripe intacto para cartão

**Non-Goals:**
- Split de pagamento (sem escopo nesta change)
- Suporte a boleto ou outros métodos
- Reembolso de cobranças PIX (escopo futuro)
- SDK Woovi (`@woovi/woovi-sdk`) — usaremos REST direto

## Decisions

### D1: REST direto em vez do SDK Woovi

O SDK oficial (`@woovi/woovi-sdk`) tem histórico de breaking changes sem versionamento semântico adequado e adiciona dependência pesada para chamadas simples. Usamos `fetch` nativo com `src/lib/woovi.ts` encapsulando os dois endpoints necessários: `createCharge` e `getCharge`. Header de auth: `Authorization: <WOOVI_APP_ID>`.

### D2: `correlationID` = `${userId}-${productId}-${Date.now()}`

O `correlationID` identifica a cobrança no lado Woovi. Incluímos timestamp para permitir novas tentativas caso a cobrança expire — sem ele, reuso do mesmo ID retornaria a cobrança antiga (já expirada). O ID é retornado ao frontend e usado no polling.

### D3: Polling client-side + webhook server-side como fallback

O frontend faz `GET /api/checkout/pix/status?correlationID=xxx` a cada 3 segundos. Quando retornar `{ status: "COMPLETED" }`, redireciona para `/checkout/sucesso`. O webhook Woovi (`POST /api/woovi/webhook`) é o fallback — garante confirmação mesmo se o usuário fechar a aba.

**Alternativa descartada:** WebSocket ou Server-Sent Events — overhead desnecessário para um caso de uso que raramente ultrapassa 30s.

### D4: `Purchase` criado no webhook + `upsert` para idempotência

A fonte de verdade é o webhook Woovi. O polling apenas reflete o status da cobrança para o frontend; a criação do `Purchase` ocorre no handler do webhook. Se o usuário já tiver `Purchase COMPLETED` (race condition entre polling e webhook), o `upsert` no webhook é no-op. O redirect do frontend para `/checkout/sucesso` é independente do webhook — só depende do status da cobrança Woovi.

### D5: Verificação de webhook via HMAC-SHA256

Woovi envia o header `X-Woovi-Signature` = HMAC-SHA256 do body raw usando o `WOOVI_APP_ID` como chave. Rejeitamos requests sem assinatura válida com `401`.

### D6: Expiração de cobrança = 24h (padrão Woovi)

Não configuramos `expiresIn` explicitamente — o padrão da Woovi (86400s) é suficiente. Cobranças expiradas aparecem como `EXPIRED` no polling e exibimos mensagem de erro com botão para gerar nova cobrança.

## Risks / Trade-offs

- [Polling causa requests extras] → 3s de intervalo com timeout de 10min = ~200 requests no pior caso. Aceitável para um fluxo de pagamento.
- [Webhook chega antes do polling ver COMPLETED] → `Purchase` já existe quando o polling confirmar; o redirect funciona normalmente.
- [Woovi fora do ar] → A criação da cobrança falha com erro claro no modal. O webhook pode chegar atrasado mas o `Purchase` será criado assim que o serviço voltar.
- [WOOVI_APP_ID ausente em produção] → `woovi.ts` lança erro na inicialização; a rota retorna 500 com log. Deve ser adicionado ao checklist de deploy.
