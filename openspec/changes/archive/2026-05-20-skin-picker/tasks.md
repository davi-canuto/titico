## 1. Schema — campo heroSkin

- [ ] 1.1 Em `prisma/schema.prisma`, adicionar `heroSkin String @default("0")` ao modelo `User` logo após o campo `role`
- [ ] 1.2 Rodar `npx prisma migrate dev --name add-user-hero-skin` e confirmar banco em sync
- [ ] 1.3 Rodar `npx prisma generate` para atualizar o client

## 2. Constantes de skins

- [ ] 2.1 Criar `src/lib/shaco-skins.ts` exportando `SHACO_SKINS` como array readonly de objetos `{ num: string; name: string }` com as 15 skins: `[{ num: "0", name: "Clássico" }, { num: "1", name: "Chapeleiro Maluco" }, { num: "2", name: "Bobo da Corte" }, { num: "3", name: "Quebra-nozes" }, { num: "4", name: "De Brinquedo" }, { num: "5", name: "Do Manicômio" }, { num: "6", name: "Goseong" }, { num: "7", name: "Shacoringa" }, { num: "8", name: "Estrela Negra" }, { num: "15", name: "Arcanista" }, { num: "23", name: "Pesadelo na Cidade do Crime" }, { num: "33", name: "Bênção do Inverno" }, { num: "43", name: "Soul Fighter" }, { num: "44", name: "Soul Fighter de Prestígio" }, { num: "54", name: "Noite Apavorante" }]`
- [ ] 2.2 Exportar também `VALID_SKIN_NUMS = new Set(SHACO_SKINS.map(s => s.num))` para validação na Server Action
- [ ] 2.3 Exportar função helper `splashUrl(num: string): string` que retorna `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Shaco_${num}.jpg`

## 3. Server Action

- [ ] 3.1 Criar `src/lib/actions/skin.ts` com `'use server'` no topo
- [ ] 3.2 Importar `auth` de `@/lib/auth`, `prisma` de `@/lib/prisma`, `VALID_SKIN_NUMS` de `@/lib/shaco-skins`
- [ ] 3.3 Exportar `async function updateHeroSkin(skinNum: string): Promise<void>` — chamar `auth()`; lançar `Error('UNAUTHORIZED')` se sem sessão; lançar `Error('INVALID_SKIN')` se `!VALID_SKIN_NUMS.has(skinNum)`; chamar `prisma.user.update({ where: { id: session.user.id }, data: { heroSkin: skinNum } })`; chamar `revalidatePath('/dashboard')`

## 4. SkinPicker component

- [ ] 4.1 Criar `src/components/platform/SkinPicker.tsx` com `'use client'`; recebe `{ currentSkin: string }` como prop
- [ ] 4.2 Estado interno: `open: boolean` (default `false`), `activeSkin: string` (default `currentSkin`)
- [ ] 4.3 Botão trigger sobre o hero: `absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20`; ícone de paleta SVG inline; `bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 text-xs text-white/70 hover:text-white hover:border-white/40 flex items-center gap-2 transition-colors`; texto "Mudar skin"
- [ ] 4.4 Painel: `fixed inset-x-0 bottom-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-t border-white/10`; transição `translate-y-full → translate-y-0` com `transition-transform duration-300`; `max-h-[60vh] overflow-y-auto`
- [ ] 4.5 Header do painel: `flex items-center justify-between px-6 py-4`; título "Escolha a skin" em `font-black uppercase text-sm`; botão × para fechar
- [ ] 4.6 Grid de skins: `grid grid-cols-3 gap-3 px-6 pb-6 sm:grid-cols-4 md:grid-cols-5`; para cada skin em `SHACO_SKINS`: card clicável com `<img>` da splash art (`loading="lazy"`, `aspect-video object-cover object-top rounded-lg`); nome abaixo em `text-xs text-white/50`; se `activeSkin === skin.num`: `ring-2 ring-[#e3001b] ring-offset-2 ring-offset-[#0d0d0d]` na imagem
- [ ] 4.7 Ao clicar em uma skin: definir `activeSkin = skin.num`, fechar painel (`open = false`), chamar `updateHeroSkin(skin.num)` (fire-and-forget com `.catch(console.error)`)
- [ ] 4.8 Fechar painel ao pressionar Escape: `useEffect` com listener `keydown` que chama `setOpen(false)` se `e.key === 'Escape'`
- [ ] 4.9 Overlay de fundo: `fixed inset-0 z-40 bg-black/60` visível quando `open`, clique fecha o painel

## 5. Integrar na dashboard home

- [ ] 5.1 Em `src/app/dashboard/page.tsx`, adicionar `heroSkin` ao select da query Prisma do `user`: `select: { heroSkin: true, purchase: { select: { status: true } } }`
- [ ] 5.2 No JSX do hero, substituir `Shaco_71.jpg` por `splashUrl(user?.heroSkin ?? '0')` usando o helper de `@/lib/shaco-skins`
- [ ] 5.3 Alterar `className` da `<Image>` do hero de `object-cover object-center` para `object-cover object-top`
- [ ] 5.4 Dentro da `<section>` do hero (após os gradientes), adicionar `<SkinPicker currentSkin={user?.heroSkin ?? '0'} />` com `import` correto

## 6. Atualização otimista na home

- [ ] 6.1 O `activeSkin` do `SkinPicker` começa com `currentSkin` (prop do server) e muda localmente ao clicar — a `<Image>` do hero é controlada pelo Server Component e atualiza após `revalidatePath`; o efeito otimista é visual (o painel fecha imediatamente)

## 7. Validação

- [ ] 7.1 `npx tsc --noEmit` — sem erros
- [ ] 7.2 Acessar `/dashboard` — confirmar hero com `Shaco_0.jpg` (padrão) e posicionamento `object-top`
- [ ] 7.3 Clicar "Mudar skin" — confirmar painel abre com grid das 15 skins
- [ ] 7.4 Selecionar uma skin — confirmar painel fecha e hero atualiza após reload
- [ ] 7.5 Confirmar que skin persiste após logout e novo login
