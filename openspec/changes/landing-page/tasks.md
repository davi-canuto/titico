## 1. Verificação da spec contra a implementação atual

- [x] 1.1 Confirmar que `src/app/page.tsx` renderiza todas as seções na ordem documentada na spec
- [x] 1.2 Confirmar que `LandingHeader` exibe CTA condicional (autenticado → `/dashboard`, anônimo → `/login`)
- [x] 1.3 Confirmar que `Hero` exibe 5 matchups gratuitos e 7 bloqueados no preview grid
- [x] 1.4 Confirmar que `MatchupGrid` abre painel inline ao clicar em matchup gratuito e fecha ao clicar novamente
- [x] 1.5 Confirmar que modal de matchup bloqueado navega para `#pricing` ao clicar no Shaco e exibe flash branco
- [x] 1.6 Confirmar que `PricingSection` exibe "Planos em breve" quando não há produtos ativos no banco
- [x] 1.7 Confirmar que `LandingFooter` exibe ano atual no copyright

## 2. Ajustes de cobertura (se gaps forem encontrados)

- [x] 2.1 Corrigir qualquer divergência entre a implementação e os requisitos da spec `landing-page`
- [x] 2.2 Garantir que o fallback de erro do `PricingSection` (catch) retorna lista vazia e não propaga exceção

## 3. Arquivamento

- [ ] 3.1 Executar `/opsx:archive` para mesclar a spec `landing-page` em `openspec/specs/landing-page/spec.md`
