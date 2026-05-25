## Context

O endpoint `POST /api/checkout/session` já funciona: valida auth, busca produto, cria sessão Stripe e retorna `{ checkoutUrl }`. Atualmente não define `payment_method_types`, delegando ao Stripe Dashboard.

O `ProductsCTA` é um client component (convertido na change anterior). O card PDF é um `<Link href="/planos">`.

A sessão do usuário está disponível via `useSession()` de Auth.js no client — sem precisar de API extra para checar auth antes de abrir o modal.

## Goals / Non-Goals

**Goals:**
- Modal leve com dois botões: Cartão de Crédito e PIX
- Usuário logado: escolha → checkout imediato
- Usuário não logado: redirecionado para `/login?callbackUrl=/` antes
- Checkout Stripe configurado com o método escolhido
- Feedback visual de loading enquanto a sessão Stripe é criada

**Non-Goals:**
- Reoabrir o modal automaticamente após login (callbackUrl simples basta)
- Salvar preferência de método de pagamento
- Suporte a outros métodos além de card e pix
- Modal genérico para outros produtos (somente PDF por agora)

## Decisions

### D1: Modal client-side, sem rota dedicada

O modal é um componente React em `ProductsCTA` — sem nova página `/checkout/pdf`. Motivo: a landing page já está carregada, abrir um modal é mais rápido e não perde o contexto do visitante.

### D2: Verificar sessão com `useSession()` no client

Ao clicar em Cartão ou PIX, checamos `session?.user` antes do fetch. Se nulo → `router.push('/login?callbackUrl=/')`. Sem API intermediária.

**Alternativa considerada:** Server Action para criar a sessão Stripe direto — descartado porque o endpoint REST já existe e funciona, e Server Actions exigiriam rewrite do fluxo de erro.

### D3: `payment_method_types` no endpoint

O corpo do request passa a aceitar `paymentMethod?: 'card' | 'pix'`. O endpoint mapeia:
- `'card'` → `payment_method_types: ['card']`
- `'pix'` → `payment_method_types: ['pix']`
- ausente → sem `payment_method_types` (comportamento atual, Stripe usa defaults)

Isso mantém backward compatibility com outros callers (ex: PlanCard).

### D4: `productId` do PDF via env var

O ID do produto PDF no banco varia por ambiente. Usamos `NEXT_PUBLIC_PDF_PRODUCT_ID` para referenciar o produto correto sem hardcode. Se vazio, o botão "Comprar" fica desabilitado.

## Risks / Trade-offs

- [PIX não habilitado no Stripe] → Stripe retorna erro ao criar sessão. Mitigação: erro é capturado e exibido inline no modal ("Pagamento indisponível").
- [Produto PDF não cadastrado no banco] → Stripe retorna `400 VALIDATION_ERROR`. Mesma mitigação.
- [Usuário retorna do login e não reabre modal] → UX aceitável para V1; o usuário vai para `/planos` onde pode comprar pelo `PlanCard` existente.
