## 1. Middleware — Abrir rota pública

- [x] 1.1 Localizar `src/middleware.ts` e identificar o matcher de rotas protegidas
- [x] 1.2 Adicionar `/preview/:path*` à lista de rotas públicas (excluir do matcher de autenticação)
- [x] 1.3 Verificar manualmente que `/dashboard/` ainda redireciona para `/login` sem sessão

## 2. Helper de preview server-side

- [x] 2.1 Criar `src/lib/content-preview.ts` com função `getPreviewData(contentId: string, userId?: string)` que:
  - Busca `Content` por `id` com status `PUBLISHED` (retorna `null` se não encontrado/DRAFT)
  - Busca `ArticleMeta`, `VideoMeta` ou `MatchupMeta` conforme o tipo
  - Aplica truncamento: artigos → primeiros 2 parágrafos (`body.split('\n\n').slice(0, 2)`); matchups → primeiros 2 tips, sem `strategy`; vídeos → sem `youtubeId`
  - Busca produto associado via `ContentProduct → Product` (primeiro produto ativo encontrado)
  - Se `userId` fornecido, verifica `Purchase` (status COMPLETED) para retornar `hasAccess: boolean`
- [x] 2.2 Garantir que `youtubeId` e o body completo nunca estejam no objeto de retorno quando `hasAccess` é false

## 3. Página `/preview/[contentId]`

- [x] 3.1 Criar `src/app/preview/[contentId]/page.tsx` como Server Component
- [x] 3.2 Chamar `auth()` para obter sessão (pode ser nula); chamar `getPreviewData(contentId, session?.user?.id)`
- [x] 3.3 Retornar `notFound()` se `getPreviewData` retornar `null`
- [x] 3.4 Se `hasAccess === true`, fazer `redirect('/dashboard/conteudo/[contentId]')`
- [x] 3.5 Renderizar seção de cabeçalho: thumbnail (`<Image>`), título, tipo, dificuldade (badge colorido para MATCHUP)
- [x] 3.6 Renderizar conteúdo truncado (parágrafos/tips conforme tipo)
- [x] 3.7 Renderizar gradiente de fade sobre a última linha do conteúdo truncado
- [x] 3.8 Renderizar `PurchaseGate` component (ver tarefa 4)

## 4. Componente PurchaseGate

- [x] 4.1 Criar `src/app/preview/_components/PurchaseGate.tsx` como Client Component
- [x] 4.2 Props: `product: { name, price: string } | null`, `contentId: string`, `isAuthenticated: boolean`
- [x] 4.3 Se `product` existir: exibir nome do produto, preço, botão "Garantir acesso" → `/api/checkout/session` (POST com `productId`) ou link para checkout conforme fluxo existente
- [x] 4.4 Se `product` for null: exibir "Acesso necessário" e botão "Ver planos" → `/planos`
- [x] 4.5 Aplicar design: `bg-[#161616]`, borda `border-white/10`, botão `bg-[#e3001b] hover:bg-[#b50015]`, texto `text-white`, `font-black uppercase tracking-wider`

## 5. Open Graph — generateMetadata

- [x] 5.1 Exportar `generateMetadata` de `src/app/preview/[contentId]/page.tsx`
- [x] 5.2 Usar `content.title` como `og:title`
- [x] 5.3 Usar primeiros 160 chars do conteúdo truncado (ou nome do campeão + tipo para matchups) como `og:description`
- [x] 5.4 Usar `content.thumbnail` como `og:image`; fallback para imagem estática da plataforma se thumbnail for nulo
- [x] 5.5 Adicionar `twitter:card: summary_large_image`

## 6. Testes manuais

- [x] 6.1 Acessar `/preview/[id]` sem sessão: verificar que a página carrega e o gate é exibido
- [x] 6.2 Acessar `/preview/[id]` com usuário sem acesso: verificar gate de compra (sem redirect para login)
- [x] 6.3 Acessar `/preview/[id]` com usuário com acesso: verificar redirect para `/dashboard/conteudo/[id]`
- [x] 6.4 Acessar `/preview/id-invalido`: verificar 404
- [x] 6.5 Verificar Open Graph colando a URL em `https://cards-dev.twitter.com/validator` ou inspecionando as meta tags no HTML
- [x] 6.6 Verificar que `/dashboard/` ainda redireciona para `/login` sem sessão (regressão de middleware)
