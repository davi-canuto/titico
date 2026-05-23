## Why

O fluxo de autenticação com Google está implementado, mas não existe uma rota `/dashboard` — após o login bem-sucedido o usuário recebe um 404. Precisamos de uma página mínima para completar o ciclo e validar o fluxo de ponta a ponta.

## What Changes

- Criar `src/app/dashboard/page.tsx` como Server Component protegido pelo middleware de auth
- Exibir nome e foto do usuário autenticado
- Oferecer botão de logout via Server Action

## Capabilities

### New Capabilities

### Modified Capabilities
- `dashboard`: adicionar página inicial do dashboard com dados da sessão do usuário autenticado

## Impact

- Novo arquivo: `src/app/dashboard/page.tsx`
- Lê sessão via `auth()` do Auth.js — sem nova dependência
- Usa `signOut()` do Auth.js em Server Action de logout
