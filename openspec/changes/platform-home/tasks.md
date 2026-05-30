## 1. Platform shell — Navbar

- [x] 1.1 Criar `src/components/platform/Navbar.tsx` — Server Component: recebe `{ userName, userImage, userRole }` como props; renderiza logo "Titiltei" (esquerda), links "Início · Explorar · Comunidade" (desktop), search bar placeholder, avatar + nome + badge "ADMIN" vermelho se role === ADMIN
- [x] 1.2 Avatar: se `userImage` existir, usar `<Image>` circular; caso contrário, `<div>` com inicial do nome em `bg-[#161616] border border-white/10`
- [x] 1.3 Links de nav com estado ativo: link da rota atual recebe estilo `border border-white/20 rounded-full px-3 py-1` (estilo pill, igual ao RD Station)
- [x] 1.4 Criar `src/app/dashboard/layout.tsx` — Server Component: chama `auth()`, redireciona para `/login` se sem sessão, renderiza `<Navbar>` + `{children}`; fundo `bg-[#0d0d0d] min-h-screen`

## 2. Componente ContentCard

- [x] 2.1 Criar `src/components/platform/ContentCard.tsx` — recebe `{ content, userProgress?, locked? }` como props
- [x] 2.2 Thumbnail: `aspect-[2/3]` com `<Image>` ou fallback colorido por `ContentType` (VIDEO → roxo escuro, MATCHUP → vermelho, BUILD → dourado, ARTICLE → azul, PDF → cinza)
- [x] 2.3 Badge de tipo: pill `text-xs uppercase tracking-widest` no canto superior esquerdo sobre a thumbnail
- [x] 2.4 Badge de acesso: se `content.accessLevel === FREE` → pill verde `#4ade80` "GRÁTIS"; se PAID e `locked` → ícone de cadeado SVG inline sobre a thumbnail
- [x] 2.5 Barra de progresso: se `userProgress?.watchedSeconds` existir, renderizar barra fina `h-1 bg-[#e3001b]` na base da thumbnail com largura proporcional (watchedSeconds / duração estimada, fallback 50%)
- [x] 2.6 Título: `text-sm font-semibold text-white` abaixo da thumbnail, truncar em 2 linhas (`line-clamp-2`)

## 3. Componente TrailRow

- [x] 3.1 Criar `src/components/platform/TrailRow.tsx` — `'use client'` para os botões de scroll; recebe `{ trail, items, locked? }`
- [x] 3.2 Cabeçalho da seção: `<h2>` com `border-l-2 border-[#e3001b] pl-3 font-black uppercase tracking-tight text-white text-xl`
- [x] 3.3 Container scroll: `flex gap-4 overflow-x-auto scroll-smooth pb-2` com `scrollbar-hide` (adicionar utilitário CSS em `globals.css`: `.scrollbar-hide { scrollbar-width: none; } .scrollbar-hide::-webkit-scrollbar { display: none; }`)
- [x] 3.4 Botões de arrow: `hidden md:flex` — SVG chevron inline, `bg-[#161616] border border-white/10 rounded-full w-9 h-9`, posicionados absolutamente nos lados do container; `onClick` chama `ref.current.scrollLeft += 320`
- [x] 3.5 Cada item: `<ContentCard>` com `min-w-[160px]` (mobile) ou `min-w-[200px]` (desktop) via classe fixa

## 4. Home page — /dashboard

- [x] 4.1 Reescrever `src/app/dashboard/page.tsx` como Server Component: chamar `auth()` + buscar dados com Prisma diretamente (não via fetch)
- [x] 4.2 Buscar `user` com `purchase` via Prisma para determinar `hasAccess` e `userRole`
- [x] 4.3 Hero banner: `relative h-[420px] overflow-hidden` — `<Image>` do splash `Shaco_71.jpg` (ddragon) como `object-cover`, gradiente `from-[#0d0d0d]` bottom e left, texto sobreposto: label "Plataforma do Bufão", título "Titiltei" em `text-6xl font-black uppercase`, botão CTA vermelho "Explorar conteúdos"
- [x] 4.4 "Continue assistindo": buscar `UserProgress` do usuário (join Content, filter PUBLISHED+active, order updatedAt desc, limit 10); renderizar `<TrailRow>` com título "Continue assistindo" se `progress.length > 0`
- [x] 4.5 Trilhas: buscar `Trail.findMany({ where: { active: true }, include: { items: { orderBy: { order: 'asc' }, take: 12, include: { content: { include: { video: true, matchup: true } } } } } })`; para cada trail com `items.length > 0`, renderizar `<TrailRow locked={!hasAccess}`
- [x] 4.6 Estado sem conteúdo: se nenhuma trail ativa existir, renderizar card `bg-[#161616] border border-white/5 rounded-xl` com mensagem "Conteúdos em breve" centralizado

## 5. Remover dashboard antigo

- [x] 5.1 Remover o conteúdo de avatar/logout do `page.tsx` antigo (substituído na tarefa 4.1); mover lógica de `signOut` para um botão no `Navbar` ou menu de perfil futuro

## 6. Verificação

- [x] 6.1 Rodar `npm run dev` e acessar `/dashboard` — confirmar que navbar aparece e home renderiza sem erros
- [x] 6.2 Confirmar que redireciona para `/login` sem sessão
- [x] 6.3 Confirmar que `npx tsc --noEmit` passa sem erros
- [x] 6.4 Verificar layout no browser em desktop (≥1024px) e mobile (<768px)
