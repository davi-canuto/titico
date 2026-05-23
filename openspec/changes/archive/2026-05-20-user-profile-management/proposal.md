## Why

Usuários logados não têm onde ver seu status de acesso, dados da compra ou sair da conta de forma clara — o único logout está no dashboard sem destaque. A ausência de uma página de perfil deixa o usuário sem visibilidade sobre o que tem acesso e por quê.

## What Changes

- Implementar `GET /api/user/me` — endpoint já specced em `user-profile`, retorna dados do usuário + status de compra
- Criar página `/dashboard/perfil` com: avatar, nome, e-mail, status de acesso (ATIVO / SEM PLANO), resumo da compra (produto, data, valor) e botão de logout
- Adicionar link para `/dashboard/perfil` no avatar da Navbar

## Capabilities

### New Capabilities

- `user-profile-page`: Página de perfil do usuário em `/dashboard/perfil` exibindo identidade, status de acesso e resumo de compra

### Modified Capabilities

*(nenhum — requisito de `user-profile` API não muda, apenas é implementado)*

## Impact

- **Novos arquivos**: `src/app/api/user/me/route.ts`, `src/app/dashboard/perfil/page.tsx`
- **Modificado**: `src/components/platform/Navbar.tsx` — avatar vira link para `/dashboard/perfil`
- **Sem novas dependências**
