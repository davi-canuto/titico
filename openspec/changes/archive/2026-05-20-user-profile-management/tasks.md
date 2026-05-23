## 1. API — GET /api/user/me

- [ ] 1.1 Criar `src/app/api/user/me/route.ts` com handler `GET`; chamar `auth()` e retornar `NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })` se sem sessão
- [ ] 1.2 Buscar `prisma.user.findUnique({ where: { id: session.user.id }, select: { id, name, email, image, role, purchase: { select: { productId, status, accessLevel, createdAt } } } })`
- [ ] 1.3 Retornar `{ id, name, email, image, role, hasAccess: purchase?.status === 'COMPLETED', purchase: purchase ?? null }`

## 2. Página de perfil

- [ ] 2.1 Criar `src/app/dashboard/perfil/page.tsx` como Server Component; chamar `auth()` e `redirect('/login')` se sem sessão
- [ ] 2.2 Buscar `prisma.user.findUnique` com `purchase` e `product` incluídos: `include: { purchase: { include: { product: true } } }`
- [ ] 2.3 Calcular `hasAccess = user.purchase?.status === PurchaseStatus.COMPLETED`
- [ ] 2.4 Header da página: `max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8`; back link `← Dashboard` para `/dashboard` em `text-white/40 hover:text-white text-sm`
- [ ] 2.5 Seção de identidade: avatar circular 80×80 (`next/image` ou fallback com inicial em `bg-[#161616] border border-white/10`); nome em `text-2xl font-black uppercase`; e-mail em `text-sm text-white/40`; badge de role `ADMIN` em vermelho se aplicável
- [ ] 2.6 Seção de acesso: card `bg-[#161616] border border-white/5 rounded-xl p-5`; título "Status de acesso" em `text-xs uppercase tracking-widest text-white/30`; se `hasAccess`: badge "Acesso ativo" `bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20`; se não: badge "Sem plano" `bg-white/5 text-white/40` + botão "Ver planos" → `/planos` vermelho
- [ ] 2.7 Se `hasAccess && user.purchase`: card de compra com: nome do produto (`user.purchase.product.name`), data formatada `new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(user.purchase.createdAt))`, pill "PAGO" em verde
- [ ] 2.8 Seção de logout: `<form action={logoutAction}>` com Server Action `async function logoutAction() { 'use server'; await signOut({ redirectTo: '/' }) }`; botão "Sair da conta" em `border border-white/10 hover:border-white/30 text-white/50 hover:text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors`

## 3. Navbar — avatar como link

- [ ] 3.1 Em `src/components/platform/Navbar.tsx`, envolver o bloco do avatar (tanto `<Image>` quanto o fallback `<div>`) em `<Link href="/dashboard/perfil">` com `className="rounded-full"` para manter o formato circular do foco
- [ ] 3.2 Adicionar `title="Ver perfil"` ao Link para acessibilidade

## 4. Validação

- [ ] 4.1 `npx tsc --noEmit` — sem erros
- [ ] 4.2 Acessar `/dashboard/perfil` sem login — confirmar redirect para `/login`
- [ ] 4.3 Acessar `/dashboard/perfil` logado sem compra — confirmar badge "Sem plano" e botão "Ver planos"
- [ ] 4.4 Clicar no avatar da Navbar — confirmar navegação para `/dashboard/perfil`
- [ ] 4.5 Clicar "Sair da conta" no perfil — confirmar logout e redirect para `/`
- [ ] 4.6 `GET /api/user/me` com sessão ativa — confirmar resposta com `hasAccess` correto
