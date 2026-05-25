## Context

O checkout PIX de produtos PDF usa polling no frontend (`/api/checkout/pix/status`) para detectar quando o pagamento é confirmado. Atualmente, ao detectar `COMPLETED`, o modal faz `router.push('/checkout/sucesso')` — página genérica de acesso à plataforma. O produto PDF não tem campos de entrega digital no schema, e não há mecanismo para retornar o link/senha ao frontend.

## Goals / Non-Goals

**Goals:**
- Adicionar `downloadUrl` e `downloadPassword` ao modelo `Product` (campos opcionais).
- Expandir a resposta da rota de status PIX para incluir dados de entrega quando `COMPLETED`.
- Substituir o redirect por uma view `success` inline no `PdfPaymentModal` com link de download e senha.

**Non-Goals:**
- Expiração ou controle de acesso ao link de download (URL direta no banco por ora).
- Entrega via email pós-pagamento.
- Suporte a múltiplos arquivos por produto.
- Alterações no fluxo de pagamento via cartão (Stripe) — esse fluxo vai para `/checkout/sucesso` e não é afetado.

## Decisions

### 1. Dados de entrega na rota de status, não em endpoint separado

A rota `GET /api/checkout/pix/status?correlationID=...` já é chamada a cada poll. Ao retornar `COMPLETED`, ela inclui `downloadUrl` e `downloadPassword` buscando da `Purchase` → `Product`. Evita uma segunda requisição do frontend após detectar o pagamento.

**Alternativa descartada:** endpoint separado `GET /api/products/:id/download` — adiciona round-trip e requer autenticação adicional no frontend.

### 2. View `success` inline no modal, sem redirect

Ao detectar `COMPLETED`, o modal para o polling e troca para a view `success` com link e senha visíveis. O usuário copia a senha e clica no link — ambos na mesma tela em que iniciou o pagamento.

**Alternativa descartada:** redirect para `/checkout/sucesso?type=pdf` com query param — fragmenta o estado entre páginas, complica o flow e exige passar dados via URL ou sessão.

### 3. Campos opcionais no modelo `Product`

`downloadUrl String?` e `downloadPassword String?` — nulos para produtos de plataforma. Sem enum de tipo de produto por ora, a semântica é implícita: produto tem download ↔ campos preenchidos.

**Alternativa descartada:** campo `type: ProductType` (enum PDF | PLATFORM) — overhead de migração e complexidade que pode ser adicionado depois se necessário.

## Risks / Trade-offs

- **URL de download exposta no banco em plaintext** → Aceitável para o MVP; a URL deve ser um link não-adivinhável (e.g. Google Drive com permissão de link). Futuramente pode ser um signed URL gerado on-demand.
- **Senha em plaintext no banco** → A senha do PDF é um segredo de produto, não do usuário. Risco baixo no contexto atual, mas deve ser avaliado antes da escala.
- **Sem validação de propriedade no download** → O link retornado pela API só é acessível a usuários autenticados que completaram a compra (o polling só retorna dados se a `Purchase` existir com status `COMPLETED`). Não há proteção contra compartilhamento do link depois de recebido.

## Migration Plan

1. Adicionar campos ao schema Prisma e gerar migration.
2. Popular `downloadUrl` e `downloadPassword` no produto PDF via seed ou admin.
3. Atualizar rota de status.
4. Atualizar modal.
5. Sem rollback especial necessário — campos são opcionais e o comportamento anterior (redirect) é apenas removido do código.
