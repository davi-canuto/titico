## 1. PlanCard component

- [x] 1.1 Criar `src/components/platform/PlanCard.tsx` com `'use client'`; recebe `{ product: { id: string; name: string; description: string | null; price: { formatted: string } } }` como props
- [x] 1.2 Estado interno: `loading: boolean` (default `false`) e `error: string | null` (default `null`)
- [x] 1.3 Handler `handleBuy`: (1) chama `fetch('/api/auth/session')`; se `session` for nulo redireciona via `window.location.href = '/login?callbackUrl=/planos'` e retorna; (2) define `loading = true`, `error = null`; (3) faz `POST /api/checkout/session` com `{ productId: product.id }`; (4) em sucesso redireciona para `checkoutUrl`; (5) em `409` define estado "já tem acesso"; (6) em qualquer outro erro define `error = "Erro ao iniciar o pagamento. Tente novamente."`; (7) `finally` define `loading = false`
- [x] 1.4 Layout do card: `bg-[#161616] border border-white/5 rounded-xl p-6 flex flex-col gap-4`; nome do produto em `font-black uppercase text-xl text-white`; descrição em `text-sm text-white/60 leading-relaxed flex-1`; preço em `text-3xl font-black text-white` com label "por acesso" em `text-xs text-white/30 uppercase tracking-widest`
- [x] 1.5 Botão primário (estado normal): `w-full bg-[#e3001b] hover:bg-[#b50015] active:bg-[#900010] text-white font-black uppercase tracking-wider rounded-lg py-3 transition-colors`; texto "Comprar"
- [x] 1.6 Botão estado loading: `disabled` + spinner SVG inline (circle stroke animado com `animate-spin`) + texto "Processando..."
- [x] 1.7 Estado "já tem acesso": substituir botão por `<p className="text-center text-sm font-semibold text-[#4ade80]">Você já tem acesso</p>`
- [x] 1.8 Mensagem de erro inline: `<p className="text-center text-xs text-[#ef4444]">{error}</p>` renderizada abaixo do botão quando `error !== null`

## 2. Página /planos

- [x] 2.1 Criar `src/app/planos/page.tsx` como Server Component; buscar produtos com `fetch('/api/products', { next: { revalidate: 60 } })`; capturar exceções e tratar como estado de erro
- [x] 2.2 Header da página: container `max-w-4xl mx-auto px-4 py-16 flex flex-col gap-12`; badge "Plataforma" em `text-xs uppercase tracking-[0.25em] text-[#e3001b] font-semibold`; título "Escolha seu plano" em `font-black uppercase text-4xl text-white` com acento `border-l-2 border-[#e3001b] pl-3`; subtítulo "Acesso completo ao guia definitivo de Shaco AD" em `text-white/50`
- [x] 2.3 Grid de produtos: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`; renderizar `<PlanCard product={p} key={p.id} />` para cada produto
- [x] 2.4 Empty state (array vazio): card centralizado `bg-[#161616] border border-white/5 rounded-xl py-20 text-center text-white/30`; texto "Nenhum plano disponível no momento"
- [x] 2.5 Error state (fetch falhou): mesma estrutura do empty state; texto "Não foi possível carregar os planos. Tente novamente mais tarde"
- [x] 2.6 Rodapé da seção: `<p className="text-center text-xs text-white/30">Pagamento único · Sem mensalidades · Acesso vitalício</p>`

## 3. Atualizar gate de acesso

- [x] 3.1 Em `src/app/dashboard/conteudo/[slug]/page.tsx` linha 113: trocar `href="/checkout"` por `href="/planos"` no botão "Comprar acesso"

## 4. Validação

- [x] 4.1 `npx tsc --noEmit` — sem erros
- [ ] 4.2 Acessar `/planos` sem login — confirmar que a página carrega e mostra os produtos (ou empty state se não houver seed)
- [ ] 4.3 Clicar "Comprar" sem sessão — confirmar redirecionamento para `/login?callbackUrl=/planos`
- [ ] 4.4 Acessar um conteúdo PAID sem acesso — confirmar que "Comprar acesso" aponta para `/planos`
