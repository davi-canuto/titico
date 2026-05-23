## Why

O hero background da home usa sempre a mesma splash art (`Shaco_71`) — que nem existe no ddragon atual — e o posicionamento da imagem corta o personagem. Permitir que cada usuário escolha a skin de fundo torna a experiência pessoal e aproveita as 15 skins disponíveis do Shaco no ddragon.

## What Changes

- Adicionar campo `heroSkin String @default("0")` ao modelo `User` + migração
- Criar `src/components/platform/SkinPicker.tsx` — Client Component com grid de miniaturas das 15 skins; clique chama Server Action que persiste a escolha
- Criar Server Action `updateHeroSkin(skinNum: string)` em `src/lib/actions/skin.ts`
- Atualizar `src/app/dashboard/page.tsx` para ler `user.heroSkin` e usar a splash art correspondente como hero background
- Corrigir posicionamento do hero: `object-top` em vez de `object-center` para mostrar o personagem e não o fundo

## Capabilities

### New Capabilities

- `skin-picker`: seletor persistente de skin do hero background da home, por usuário

### Modified Capabilities

*(nenhum — sem alteração de requisitos existentes)*

## Impact

- **Schema**: campo `heroSkin` no modelo `User` (migration simples, sem breaking change)
- **Novos arquivos**: `src/components/platform/SkinPicker.tsx`, `src/lib/actions/skin.ts`
- **Modificado**: `src/app/dashboard/page.tsx` (lê `heroSkin`), `src/app/dashboard/layout.tsx` (passa `heroSkin` para a page via props ou DB)
- **Sem novas dependências externas** — splash arts vêm do ddragon CDN já usado
