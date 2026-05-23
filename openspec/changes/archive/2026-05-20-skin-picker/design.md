## Context

O dashboard home é um Server Component que já busca o `User` do banco para determinar `hasAccess`. A splash art hardcoded é `Shaco_71.jpg` — skin que não existe na API atual do ddragon (lista válida: 0, 1, 2, 3, 4, 5, 6, 7, 8, 15, 23, 33, 43, 44, 54). O hero usa `object-center` que corta o personagem nas splash arts landscape.

## Goals / Non-Goals

**Goals:**
- Persistir preferência de skin por usuário no banco (`User.heroSkin`)
- Mostrar seletor de skins acessível diretamente na home (botão "Mudar skin" sobre o hero)
- Corrigir posicionamento da imagem para `object-top` (mostra o personagem, não o fundo)
- Atualizar lista de skins para as 15 válidas do ddragon 15.5.1

**Non-Goals:**
- Escolher skins para outras páginas (só a home)
- Preview animado ou comparação lado-a-lado
- Skins de outros campeões

## Decisions

### Persistência no banco, não localStorage

`User.heroSkin` (String, default `"0"`) garante que a preferência segue a conta em qualquer dispositivo. LocalStorage seria mais simples mas seria perdida ao trocar de browser.

### Server Action direta — sem API route

`updateHeroSkin(skinNum: string)` é uma Server Action em `src/lib/actions/skin.ts` que valida o num contra a lista permitida e chama `prisma.user.update`. O `SkinPicker` é `'use client'` e a chama diretamente. Não precisa de uma rota REST — é uma mutação de estado simples do usuário logado.

### Seletor como overlay sobre o hero — botão de ícone

Um botão discreto (ícone de paleta) fica sobre o hero (canto inferior direito). Ao clicar, abre um painel deslizante de baixo com grid de miniaturas `aspect-[16/9]`. Ao escolher: painel fecha, imagem do hero muda otimisticamente no client e persiste via Server Action.

### `object-top` global para splash arts

Splash arts do Shaco têm o personagem posicionado na parte superior-central. `object-top` funciona melhor que `object-center` para a maioria. Skins individuais com posicionamento atípico ficam aceitáveis.

## Risks / Trade-offs

- [Miniaturas do seletor carregam 15 imagens do ddragon] → Mitigation: usar `loading="lazy"` e tamanho pequeno (thumbnail de 160×90px, formato `Shaco_{num}.jpg` redimensionado pelo browser)
- [Server Action chamada sem autenticação] → Mitigation: `auth()` dentro da action; lançar erro se sem sessão
- [Skin num inválido enviado pelo cliente] → Mitigation: validar contra lista `SHACO_SKINS` de nums permitidos antes do update
