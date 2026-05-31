## Why

A página `/lobby/buscar` mostra uma tela em branco com ícone de lupa quando o campo está vazio — o usuário não sabe o que existe para buscar e não tem incentivo para explorar. Mostrar conteúdo recente preenche esse vazio e aumenta a descoberta orgânica.

## What Changes

- Quando o campo de busca está vazio e nenhum filtro está ativo, a página exibe uma grade de conteúdos recentes (últimos 8 publicados) em vez da tela em branco
- Ao digitar ou aplicar filtro, o comportamento atual (busca em tempo real) continua inalterado
- Um label "Conteúdos recentes" aparece acima da grade no estado inicial
- Os conteúdos recentes são buscados uma vez ao montar o componente (`useEffect` com array vazio)

## Capabilities

### New Capabilities

- `search-initial-state`: Estado inicial da busca com conteúdos recentes em vez de tela em branco

### Modified Capabilities

(nenhuma)

## Impact

- **Modificado:** `src/app/lobby/buscar/page.tsx` — adiciona fetch de conteúdos recentes no mount e exibe no estado inicial
- **Sem nova rota de API** — reutiliza `/api/search?q=&limit=8` ou busca direta no endpoint existente
