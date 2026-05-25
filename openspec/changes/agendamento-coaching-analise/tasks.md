## 1. Pré-requisito Operacional — Cal.com

- [ ] 1.1 Criar conta no Cal.com em cal.com/signup (ou usar conta existente do Titiltei)
- [ ] 1.2 Criar event type "Coaching 1:1" — duração 60min, slug `coaching-1x1`, descrição e foto
- [ ] 1.3 Criar event type "Análise de Partida" — duração 30min, slug `analise-de-partida`, adicionar campo customizado obrigatório "ID ou link da partida"
- [ ] 1.4 Conectar Google Calendar (ou outro) no Cal.com para sincronizar disponibilidade
- [ ] 1.5 Anotar o username do Cal.com (ex: `titiltei`) para montar os slugs completos

## 2. Configuração de Ambiente

- [ ] 2.1 Adicionar `NEXT_PUBLIC_CAL_COACHING_SLUG=titiltei/coaching-1x1` no `.env.local` e no ambiente de produção
- [ ] 2.2 Adicionar `NEXT_PUBLIC_CAL_ANALISE_SLUG=titiltei/analise-de-partida` no `.env.local` e no ambiente de produção

## 3. Dependência

- [x] 3.1 Instalar `@calcom/embed-react`: `npm install @calcom/embed-react`

## 4. Implementação

- [x] 4.1 Converter `src/components/landing/ProductsCTA.tsx` para client component (`'use client'`)
- [x] 4.2 Importar `getCalApi` de `@calcom/embed-react`
- [x] 4.3 Inicializar ambos os namespaces Cal.com via `useEffect` com `getCalApi`
- [x] 4.4 Substituir cards de Coaching e Análise por `<button>` com `data-cal-namespace`, `data-cal-link` e `data-cal-config`
- [x] 4.5 Cal.com intercepta o click via `data-cal-*` e abre o modal automaticamente
- [x] 4.6 Card de PDF permanece como `<Link href="/planos">` (inalterado)
- [x] 4.7 Guard: se env var vazia, `console.warn` em dev e botão desabilitado (`disabled`)

## 5. Testes Manuais

- [ ] 5.1 Clicar em "Agendar" no card Coaching → modal Cal.com abre com calendário de coaching
- [ ] 5.2 Clicar em "Agendar" no card Análise → modal Cal.com abre com campo de partida
- [ ] 5.3 Clicar em "Comprar" no card PDF → navega para `/planos` normalmente
- [ ] 5.4 Completar um agendamento de teste no Coaching → confirmar email recebido
- [ ] 5.5 Verificar que o modal fecha corretamente ao clicar fora ou no X
- [ ] 5.6 Testar em mobile — modal deve ser responsivo
