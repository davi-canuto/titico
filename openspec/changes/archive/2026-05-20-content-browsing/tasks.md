## 1. ContentCard — adicionar link

- [x] 1.1 Envolver o conteúdo do `ContentCard.tsx` em `<Link href={`/dashboard/conteudo/${content.slug}`}>` do `next/link`; remover `<div>` externo e substituir por `<Link className="group flex flex-col gap-2">`

## 2. Página Explorar

- [x] 2.1 Criar `src/app/dashboard/explorar/page.tsx` — Server Component: recebe `searchParams: { tipo?: string }`, consulta Prisma com `where: { status: PUBLISHED, active: true, ...(tipo ? { type: tipo } : {}) }`, ordena por `publishedAt desc`
- [x] 2.2 Header da página: título "Explorar" com acento vermelho `border-l-2 border-[#e3001b]`, subtítulo `text-white/50`
- [x] 2.3 Filtros de tipo: chips "Todos · Vídeo · Matchup · Build · Artigo · PDF" — cada chip é um `<Link href="?tipo=VIDEO">` (ou `/dashboard/explorar` para "Todos"); chip ativo recebe `bg-[#e3001b] text-white`, inativo `bg-[#161616] border border-white/10 text-white/60`
- [x] 2.4 Grid responsivo: `grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6` com `<ContentCard>` para cada item
- [x] 2.5 Empty state: se `contents.length === 0`, renderizar card centralizado `bg-[#161616] border border-white/5 rounded-xl py-20` com mensagem "Nenhum conteúdo encontrado"
- [x] 2.6 Determinar `hasAccess` e `locked` via `prisma.user.findUnique` igual ao dashboard home (reutilizar padrão)

## 3. VideoPlayer — componente client

- [x] 3.1 Criar `src/components/platform/VideoPlayer.tsx` com `'use client'`; recebe `{ youtubeId: string, slug: string }`
- [x] 3.2 Renderizar `<iframe>` com `src="https://www.youtube.com/embed/${youtubeId}?enablejsapi=1"`, `aspect-video w-full rounded-lg`, `allow="autoplay; encrypted-media"`, `allowFullScreen`
- [x] 3.3 Adicionar `useEffect` que escuta `window.addEventListener('message', handler)`: detecta evento YouTube `{ event: 'onStateChange', info: 1 }` (PLAYING) e envia POST `{ watchedSeconds: 0 }` para `/api/contents/${slug}/progress`
- [x] 3.4 Rastrear tempo assistido com `useRef` para `startTime`: no evento PLAYING gravar `Date.now()`; no `beforeunload` e no cleanup do `useEffect`, calcular `Math.round((Date.now() - startTime) / 1000)` e fazer POST com `watchedSeconds`

## 4. Página de conteúdo (player)

- [x] 4.1 Criar `src/app/dashboard/conteudo/[slug]/page.tsx` — Server Component: buscar conteúdo via `prisma.content.findFirst({ where: { slug, status: PUBLISHED, active: true }, include: { video, matchup, build, article, file } })`; chamar `notFound()` se não encontrado
- [x] 4.2 Determinar `hasAccess` e `locked` (mesmo padrão do dashboard home)
- [x] 4.3 Layout da página: `max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6`; back link `← Voltar` apontando para `/dashboard` com estilo `text-white/50 hover:text-white text-sm`
- [x] 4.4 Cabeçalho: badge de tipo (pill `text-xs uppercase tracking-widest`), título `text-3xl font-black uppercase`, badge FREE/PAID
- [x] 4.5 Gate de acesso: se `locked && content.accessLevel !== FREE`, renderizar `div` com thumbnail em fundo, overlay escuro, ícone de cadeado grande, texto "Conteúdo exclusivo para assinantes" e botão "Comprar acesso" vermelho
- [x] 4.6 Renderização por tipo — VIDEO: `<VideoPlayer youtubeId={content.video.youtubeId} slug={content.slug} />`
- [x] 4.7 Renderização por tipo — MATCHUP: nome do campeão com `<Image>` do ddragon (ícone), badge de dificuldade colorido (EASY `#4ade80` / MEDIUM `#fbbf24` / HARD `#ef4444`), lista de tips com bullets vermelhos, seção de estratégia em prosa, itens sugeridos
- [x] 4.8 Renderização por tipo — BUILD: nome do campeão, grid de itens (slugs/nomes), lista de runas, notas em bloco cinza
- [x] 4.9 Renderização por tipo — ARTICLE: corpo do artigo em `<article className="prose prose-invert max-w-none">`; se Tailwind Typography não estiver instalado, usar `whitespace-pre-wrap text-white/80 leading-relaxed`
- [x] 4.10 Renderização por tipo — PDF: link de download `<a href={content.file.url} target="_blank">` com ícone de documento SVG e tamanho do arquivo se disponível

## 5. Verificação

- [x] 5.1 `npx tsc --noEmit` — sem erros
- [x] 5.2 Acessar `/dashboard/explorar` — grid aparece, chips de filtro funcionam, URL atualiza
- [x] 5.3 Clicar em um card — navega para `/dashboard/conteudo/[slug]`
- [x] 5.4 Página de conteúdo VIDEO — iframe YouTube aparece; verificar no Network que o POST de progresso é disparado
- [x] 5.5 Verificar conteúdo PAID sem acesso — overlay de cadeado aparece corretamente
