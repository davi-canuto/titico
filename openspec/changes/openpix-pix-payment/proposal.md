## Why

O modal de pagamento atual oferece PIX como opção mas redireciona o usuário para o Stripe Checkout, que não suporta PIX na conta atual e oferece experiência inadequada. PIX exige um fluxo nativo de QR code — o usuário deve ver o código diretamente no site, pagar no app do banco e receber confirmação imediata sem sair da página.

## What Changes

- Adicionar integração com a API REST da Woovi (OpenPix) para geração de cobranças PIX
- Criar endpoint `POST /api/checkout/pix` que gera cobrança na Woovi e retorna QR code + copia-e-cola
- Criar endpoint `GET /api/checkout/pix/status` para polling de status da cobrança
- Criar endpoint `POST /api/woovi/webhook` para confirmação server-side (fallback ao polling)
- Atualizar `PdfPaymentModal` para exibir QR code inline quando PIX selecionado, com polling até confirmação
- Botão "Cartão de Crédito" continua usando Stripe sem alteração
- Variável de ambiente: `WOOVI_APP_ID`

## Capabilities

### New Capabilities

- `pix-checkout`: Fluxo completo de pagamento PIX via Woovi — criação de cobrança, exibição de QR code inline, polling de status e confirmação via webhook

### Modified Capabilities

- `checkout`: O fluxo de checkout agora suporta dois provedores: Stripe (cartão) e Woovi (PIX). A lógica de criação de `Purchase` é compartilhada entre os dois caminhos

## Impact

- **Novo arquivo**: `src/app/api/checkout/pix/route.ts`
- **Novo arquivo**: `src/app/api/checkout/pix/status/route.ts`
- **Novo arquivo**: `src/app/api/woovi/webhook/route.ts`
- **Novo arquivo**: `src/lib/woovi.ts`
- **Modificado**: `src/components/landing/PdfPaymentModal.tsx`
- **Dependência nova**: chamadas REST para `api.openpix.com.br` (sem SDK — REST direto é mais estável)
- **Variável de ambiente**: `WOOVI_APP_ID`
