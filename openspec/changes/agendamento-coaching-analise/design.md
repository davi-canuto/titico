## Context

`ProductsCTA` é atualmente um Server Component com links estáticos para `/planos`. A integração com Cal.com requer interatividade client-side (click handlers para abrir o modal), então o componente precisa virar client component.

Cal.com oferece `@calcom/embed-react`, que expõe o hook `useCalModal` e o componente `<Cal />` — permite abrir um modal de agendamento para qualquer event type sem redirecionar o usuário para outra página.

Cada event type do Cal.com tem um **slug** único (ex: `titiltei/coaching-1x1`). Os slugs são configurados no painel do Cal.com e referenciados no código via variáveis de ambiente.

## Goals / Non-Goals

**Goals:**
- Botão "Agendar Coaching" abre modal Cal.com para o event type de coaching
- Botão "Agendar Análise" abre modal Cal.com para o event type de análise
- Modal abre in-page (não redireciona, não abre nova aba)
- Qualquer visitante pode agendar sem conta na plataforma
- Slugs do Cal.com configuráveis via env vars (não hardcoded)

**Non-Goals:**
- Sincronizar agendamentos com o banco de dados da plataforma
- Notificações internas (webhooks Cal.com → plataforma)
- Fluxo de pagamento dentro do agendamento (tratado separadamente via produtos)
- Agendamento pelo botão PDF (que vai para `/planos`)

## Decisions

### D1: `@calcom/embed-react` com modal inline

O Cal.com Embed SDK oferece três modos: inline (iframe embutido), popup (nova janela) e modal. Usamos **modal** — abre sobre a página sem sair da landing, mantendo o contexto do usuário.

**Alternativa considerada:** Link direto para `cal.com/titiltei/...` — descartado por quebrar o fluxo (usuário sai da landing).

### D2: Slugs via variáveis de ambiente

Os event type slugs são armazenados em `NEXT_PUBLIC_CAL_COACHING_SLUG` e `NEXT_PUBLIC_CAL_ANALISE_SLUG`. Sendo `NEXT_PUBLIC_`, são acessíveis no client sem API route.

**Alternativa considerada:** Hardcoded no componente — descartado por dificultar mudanças de slug sem deploy.

### D3: `ProductsCTA` vira client component

O componente precisa de `onClick` para abrir o modal. A busca de produtos (se necessária no futuro) pode ser feita via Server Component pai que passa dados como props.

### D4: Análise de Partida coleta informações via campo personalizado no Cal.com

O Cal.com permite adicionar campos customizados ao formulário de agendamento (ex: "ID da partida / link do replay"). Isso é configurado no painel do Cal.com — sem código adicional no frontend.

## Risks / Trade-offs

- [Cal.com fora do ar] → Modal não abre; os botões ficam sem resposta. Mitigação: baixo risco, Cal.com tem SLA alto; fallback pode ser adicionado futuramente.
- [Bundle size] → `@calcom/embed-react` adiciona ~50KB ao bundle do client component. Aceitável para esta landing page.
- [Event type slugs não configurados] → Se as env vars estiverem vazias, os botões não abrirão nada. Mitigação: validar no componente e logar warning em dev.
