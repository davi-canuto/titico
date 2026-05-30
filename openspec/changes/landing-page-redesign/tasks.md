## 1. Assets e Tipos

- [x] 1.1 Copiar `titico.jpeg` de `../titico/public/titico.jpeg` para `public/titico.jpeg`
- [x] 1.2 Criar `src/lib/matchup-types.ts` com `export type Difficulty = 'Fácil' | 'Médio' | 'Difícil'` e a interface `Matchup` (campos: `champion`, `displayName`, `difficulty`, `estrategia`, `dicas`, `detalhes?`)
- [x] 1.3 Criar `src/data/matchups.ts` copiando exatamente o conteúdo de `../titico/src/data/matchups.ts` — `export const matchups: Matchup[]` (5 free) e `export const lockedMatchups` (32 locked); ajustar import para `@/lib/matchup-types`

## 2. LandingHeader

- [x] 2.1 Criar `src/components/landing/LandingHeader.tsx` como `'use client'` — recebe prop `isAuthenticated: boolean`; estado `open` para menu mobile
- [x] 2.2 Barra fixa: `fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur border-b border-white/5`; logo `TITIL<span text-[#e3001b]>TEI</span>`
- [x] 2.3 Nav desktop: links âncora `href="#matchups"`, `href="#sobre"`, `href="#pricing"` com estilo `text-sm font-semibold uppercase tracking-wider text-white/70 hover:text-[#e3001b]`
- [x] 2.4 Botão CTA: se `!isAuthenticated` → `"Entrar"` linking para `/login`; se autenticado → `"Ir para a plataforma"` linking para `/dashboard`; estilo `bg-[#e3001b] hover:bg-[#b50015] text-white font-black uppercase tracking-wider text-sm px-4 py-2 rounded-lg transition-colors`
- [x] 2.5 Ícones sociais (Instagram, YouTube, TikTok) — SVGs inline idênticos aos do `../titico/src/components/Header.tsx`
- [x] 2.6 Menu mobile hamburger: estado `open`, lista de links âncora + CTA, fecha ao clicar

## 3. Hero

- [x] 3.1 Criar `src/components/landing/Hero.tsx` como Server Component — `section` com `relative min-h-[100dvh] flex flex-col justify-center overflow-hidden`
- [x] 3.2 Background: `<img>` splash `Shaco_0.jpg` (ddragon) `absolute inset-0 w-full h-full object-cover opacity-20 sm:opacity-30`; gradiente overlay `bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/80 to-[#0d0d0d]/50`
- [x] 3.3 Conteúdo: label "Guia Definitivo — Shaco Jungle", título `"GUIA DO"` + `"SHACO"` (clamp), subtítulo muted, badges "Top 1 Shaco do Mundo" e "Top 1 Shaco BR"
- [x] 3.4 CTAs: `<a href="#pricing">` "Ver Planos" (botão vermelho primário) + `<a href="#matchups">` "Ver Matchups Grátis" (botão outline)
- [x] 3.5 Mini grid de preview: primeiros 5 `matchups` (ring vermelho + clickable href="#matchups") + primeiros 7 `lockedMatchups` (grayscale + ícone de cadeado SVG inline + href="#pricing") + contador `+{restantes}`

## 4. VideoSection

- [x] 4.1 Criar `src/components/landing/VideoSection.tsx` como Server Component — seção com label, h2, `div` w-1 h-1 decorativo vermelho, iframe YouTube `https://www.youtube.com/embed/36wA2v1vXWQ` em container `aspect-[16/9] rounded-xl overflow-hidden border border-white/10`

## 5. MatchupPanel

- [x] 5.1 Criar `src/components/landing/MatchupPanel.tsx` como `'use client'` — recebe `matchup: Matchup` e `onClose: () => void`; header com splash do campeão (opacity 40%), gradiente, nome em vermelho, badge de dificuldade
- [x] 5.2 Corpo: 3 colunas (md) com `InfoSection` para Estratégia, Dicas e Detalhes; cada item com bullet `•` vermelho

## 6. MatchupGrid

- [x] 6.1 Criar `src/components/landing/MatchupGrid.tsx` como `'use client'` — importa `matchups` e `lockedMatchups` de `@/data/matchups`
- [x] 6.2 Grid de campeões: ícones livres clicáveis (ring colorido por dificuldade, ativo = ring offset) + ícones locked (grayscale + ícone cadeado)
- [x] 6.3 Painel inline: ao clicar campeão livre, render `<MatchupPanel>` abaixo do grid com `id="matchup-panel"`; scroll suave para o painel 100ms depois; clicar de novo fecha
- [x] 6.4 Modal locked — Shaco box: ao clicar campeão locked, exibir overlay `fixed inset-0 z-50 bg-black/80`; animações CSS injetadas via `<style>` (box-drop, box-shake, box-explode — copiar de `../titico/src/components/MatchupGrid.tsx`); botão "×" fecha; clicar na caixinha faz `window.location.hash = 'pricing'` e fecha o modal
- [x] 6.5 Legenda de dificuldade (Fácil, Médio, Difícil) com dots coloridos
- [x] 6.6 CTA "Ver Guia Completo" no final → `<a href="#pricing">`

## 7. About

- [x] 7.1 Criar `src/components/landing/About.tsx` como Server Component — seção `id="sobre"`; layout flex col → row (md); foto `<img src="/titico.jpeg">` `w-48 h-48 md:w-64 md:h-64 rounded-2xl border-2 border-[#e3001b] object-cover object-top`
- [x] 7.2 Texto bio idêntico ao de `../titico/src/components/About.tsx`; badges "Top 1 Shaco do Mundo" e "Top 1 Shaco BR"

## 8. PricingSection

- [x] 8.1 Atualizar `src/components/platform/PlanCard.tsx` — adicionar prop opcional `callbackUrl?: string` (default `'/planos'`); usar `callbackUrl` no redirect de unauthenticated em vez de hardcoded `'/planos'`
- [x] 8.2 Criar `src/components/landing/PricingSection.tsx` como Server Component — query `prisma.product.findMany({ where: { active: true }, orderBy: { price: 'asc' } })`; mapear produtos adicionando campo `price.formatted`; o produto com maior `price` recebe `isPopular: true`
- [x] 8.3 Layout da seção: `id="pricing"`, label "Planos", h2 "Escolha seu acesso", parágrafo descritivo; grid `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto`; renderizar `<PlanCard>` por produto com `callbackUrl="/"` e `isPopular` conforme o maior preço
- [x] 8.4 Trust bar abaixo do grid: "Pagamento seguro via Stripe · Pagamento único · Sem renovação · Acesso vitalício" (ícones SVG inline, mesmo estilo da `/planos`)
- [x] 8.5 Estado vazio: se `products.length === 0`, renderizar `<p>Planos em breve</p>` centralizado

## 9. LandingFooter

- [x] 9.1 Criar `src/components/landing/LandingFooter.tsx` como Server Component — logo, tagline "Guia do Shaco — Rank 1 Challenger BR", links (Contato, Twitch, YouTube), SVGs sociais (Instagram, YouTube, TikTok) com `target="_blank" rel="noopener noreferrer"`, copyright `© {ano} Titiltei. Todos os direitos reservados. Não afiliado à Riot Games.`

## 10. Root Page

- [x] 10.1 Reescrever `src/app/page.tsx` como Server Component — remover o redirect gate; chamar `auth()` para obter a sessão; sem `redirect()`
- [x] 10.2 Compor a página: `<LandingHeader isAuthenticated={!!session}>` + `<main>` com `<Hero>`, `<VideoSection>`, `<MatchupGrid>`, `<About>`, `<PricingSection>`, `</main>` + `<LandingFooter>`
- [x] 10.3 Adicionar `pt-16` no container principal para compensar o header fixo

## 11. Validação

- [x] 11.1 Rodar `npx tsc --noEmit` — sem erros de TypeScript
- [x] 11.2 Acessar `/` sem sessão → landing renderiza, header mostra botão "Entrar" linkando para `/login`
- [x] 11.3 Acessar `/` com sessão ativa → header mostra "Entrar no Lobby" linkando para `/dashboard`
- [x] 11.4 Clicar em matchup livre (ex: Viego) → painel aparece com estratégia/dicas/detalhes; clicar novamente fecha
- [x] 11.5 Clicar em matchup locked → modal Shaco box aparece com animação; clicar na caixinha → scroll para `#pricing`, modal fecha
- [x] 11.6 CTA de plano sem sessão → browser navega para `/login?callbackUrl=/`
- [x] 11.7 `/planos` continua renderizando normalmente com `callbackUrl=/planos`
- [x] 11.8 Verificar responsividade: hero, grid de matchups e pricing grid em mobile (< 768px) e desktop (≥ 1024px)
