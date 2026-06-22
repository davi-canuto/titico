## Context

Existem dois problemas independentes no fluxo de checkout:

**1. ALREADY_PURCHASED como erro**: O endpoint `POST /api/checkout/session` retorna `409 ALREADY_PURCHASED` quando o usuário já tem uma compra `COMPLETED`. O `PdfPaymentModal` no fluxo de cartão não trata esse código especificamente, causando exibição de erro genérico. No fluxo Pix, aparece como "Você já adquiriu este produto." em estilo de erro. O usuário quer poder comprar de novo (ex: presentear, segunda cópia), então a UI deve informar e oferecer escolha.

**2. Pix sem controle admin**: O Pix é implementado via Woovi em `/api/checkout/pix`. Não existe forma de desabilitar o método sem editar código. Quando desabilitado, o botão Pix deve sumir do modal e da landing page.

Não existe modelo `SiteConfig` no banco. O `pixKey` já existente está no modelo `Creator` e não é o mecanismo correto para configuração global.

## Goals / Non-Goals

**Goals:**
- `409 ALREADY_PURCHASED` redireciona para uma view informativa no modal com opção de "Comprar mesmo assim" (recompra via checkout Stripe ignorando a verificação)
- Admin pode desabilitar Pix via painel; quando desabilitado, o botão Pix some do modal e da landing
- Endpoint Pix retorna `503 PIX_DISABLED` quando desabilitado, evitando contornar pela API
- SiteConfig como singleton persistido no banco, extensível para futuras configs

**Non-Goals:**
- Não altera o status code 409 do endpoint (o servidor continua retornando 409 para ALREADY_PURCHASED)
- Não implementa outras configurações de site além de `pixEnabled` nesta mudança
- Não adiciona analytics ou logs especiais para recompras

## Decisions

**Singleton SiteConfig via Prisma**
Opção escolhida: modelo `SiteConfig` com `id String @id @default("global")`. Sempre há exatamente um registro; o código usa `upsert` para garantir existência.
Alternativa descartada: variável de ambiente `PIX_ENABLED` — não editável pelo admin sem redeploy.
Alternativa descartada: campo no modelo `Creator` — o `pixKey` já ali é por-creator, não config global.

**Parâmetro `force: true` no checkout/session para recompra**
Opção escolhida: body aceita `force?: boolean`. Quando `true`, a verificação de `ALREADY_PURCHASED` é pulada e um novo checkout Stripe é criado normalmente.
Alternativa descartada: endpoint separado `/api/checkout/force` — duplicação desnecessária de lógica.
Segurança: `force: true` não bypassa autenticação nem validação de produto — apenas a verificação de compra existente.

**Pix desabilitado no endpoint, não só no frontend**
A verificação de `SiteConfig.pixEnabled` ocorre em `POST /api/checkout/pix` (retorna `503 PIX_DISABLED`). O frontend oculta o botão para UX, mas a proteção real é no servidor.
Alternativa descartada: só ocultar no frontend — não evita chamadas diretas à API.

**Leitura de `pixEnabled` no Server Component da landing**
`PricingSection.tsx` e `PdfPaymentModal.tsx` recebem `pixEnabled` como prop passada pelo Server Component pai. O valor é lido do banco no momento do render; cache invalidado por `revalidatePath("/")` quando admin altera a config.

## Risks / Trade-offs

- **Recompra indesejada**: `force: true` permite que usuários autenticados comprem um produto que já possuem. Risco aceitável — é intencionalmente permitido pelo admin/produto. A compra gera uma segunda `Purchase` no banco; o acesso já existia, então não há impacto funcional.
- **Cache stale do pixEnabled**: entre a desabilitação pelo admin e a próxima revalidação, um usuário pode ainda ver o botão Pix. `revalidatePath("/")` na action de update minimiza a janela.
- **Singleton SiteConfig sem registro inicial**: código deve usar `upsert` ou garantir seed na migração para evitar `null` na leitura.

## Migration Plan

1. Criar migração Prisma para `SiteConfig` com seed do registro `id = "global"`, `pixEnabled = true`
2. Deploy sem quebra de comportamento (Pix continua habilitado por padrão)
3. Admin desabilita Pix via UI quando necessário
4. Rollback: reverter migração remove a tabela; sem a tabela, o código de leitura de `pixEnabled` deve ter fallback `true` (Pix habilitado)
