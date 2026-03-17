# Titico — Site do Guia do Shaco AD

## Contexto do Projeto

Site para **Tiago "Titiltei" Nunes** (aka "Titi"), criador de conteúdo de League of Legends especializado em **Shaco AD Jungle**. Rank 1 Challenger BR (TiTiltei#Amor). Canais: YouTube/@titiltei e Twitch.tv/titiltei.

**Referência visual:** https://arthurlanches.com.br/ — seletor de campeões com grid de ícones circulares, ao clicar carrega as informações do matchup. Mesmo conceito, mas focado **apenas no Shaco** (ponto de vista do Shaco vs cada campeão rival).

**Site atual:** https://titiltei.com/ (será substituído ou complementado por este)

---

## Stack

- **Next.js** (App Router) — deploy gratuito na Vercel
- **Tailwind CSS** — estilização rápida, dark theme
- **TypeScript**
- **Imagens de campeões:** Riot Data Dragon CDN — `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/[ChampionName].png`
- **Sem banco de dados** — dados dos matchups em arquivos `.ts` estáticos (fácil de manter)

---

## Identidade Visual

Retirada do PDF "GUIA DO SHACO AD":
- **Fundo:** preto profundo (`#0d0d0d` / `#111111`)
- **Cor primária:** vermelho (`#E3001B` ou similar)
- **Texto:** branco
- **Dificuldade fácil:** verde (`#4ade80`)
- **Dificuldade médio:** amarelo/laranja (`#fbbf24`)
- **Dificuldade difícil:** vermelho (`#ef4444`)
- **Fonte:** bold, impactante — usar `font-black` Tailwind / considerar Bebas Neue ou Inter Black
- **Estética:** gamer dark, arte de campeões como background das seções

---

## Estrutura do Site

### Seções (na ordem)
1. **Header/Nav** — Logo TITILTEI, links de navegação, ícones sociais (Instagram, YouTube, TikTok)
2. **Hero** — Arte do Shaco, título "GUIA DO SHACO AD", subtítulo "SE TORNE UM DEUS JOGANDO DE SHACO", CTA para comprar guia
3. **Sobre** — Foto do Tiago, bio, tabela de rank (Challenger BR)
4. **Matchups** — Grid de ícones de campeões (como arthurlanches), clique carrega detalhes
5. **Build & Runas** — Teaser do conteúdo pago, CTA para comprar guia completo
6. **Comprar Guia** — Seção de venda (link Kiwify)
7. **Live/Stream** *(futuro)* — Embed Twitch/YouTube
8. **Agendamento de Coach** *(futuro)* — Formulário/link de agendamento
9. **Footer** — Redes sociais, contato

---

## Estrutura de Dados dos Matchups

```typescript
interface Matchup {
  champion: string;           // nome exato para o Data Dragon CDN
  displayName: string;        // nome de exibição
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  estrategia: string[];
  dicas: string[];
  detalhes?: string[];        // ou conclusao
  itemSugestao?: string;      // nome do item (para imagem do CDN)
}
```

### Matchups da Amostra Grátis (PDF)

**Viego** — Fácil
- Estratégia: invade nível 3 (troca early é sua); caixinhas cancela W (Fauces Espectrais); Ignite + Q para seguir Flash e garantir abate
- Dicas: invada campos da jungle para atrasar early game; use pressão do time para garantir invade
- Conclusão: troca nível 3 decisiva; caixinhas no pé cancela W; Ignite+Q na fuga = free kill

**Diana** — Médio — *Sugestão de item*
- Estratégia: 3 campos + invade lado oposto; objetivo é atrasar nível 4 dela; caixinhas no pé se ela gastar W (Cascata Lívida) cedo
- Dicas: nível 6 você tem vantagem direta; teamfights — caixinhas perto dos carries
- Detalhes: depende do W para se proteger; a partir do nível 4 ela fica mais forte; caixinha na rota de entrada trava engage

**Jarvan IV** — Médio — *Sugestão de item*
- Estratégia: evite confrontos diretos nível 3 (bandeira E+Q); foque em counter ganks; nível 6 countere Cataclisma com Q ou R; garanta objetivos cedo
- Dicas: Jarvan é jungler previsível; caixinhas perto de aliados travam engages
- Detalhes: Jarvan tem vantagem nível 3; espere gastar habilidades no farm; depende do early game; neutralize com counter ganks

**Kayn** — Médio — *Sugestão de item (roxo)*
- Estratégia: invade nível 3 mas seja paciente; Ignite corta cura do E (Transcendência Sombria); se usar E para fugir, siga com Q; controle early (forma humana); garanta objetivos cedo
- Dicas: jogue pela fog of war; abuse da fraqueza no early antes de evoluir
- Detalhes: perigoso no mid/late se farmar tranquilo; cura e mobilidade difíceis de punir tarde

**Lee Sin** — Médio — *Sugestão de item*
- Estratégia: matchup não é tão difícil quanto parece; quem troca melhor vence; invade nível 3 OU full clear funcionam; caixinha cancela Q (Onda Sônica); 3 pontos no W (Caixinhas) acelera clear e fortalece trocas curta distância; controle jungle
- Dicas: caixinhas para counterar entradas; jogue agressivo mas evite tomar Q
- Detalhes: kit favorece early mas depende de acertar habilidades; neutralizar primeiros ganks é essencial

---

## Fontes de Dados Externas

- **Champion icons/splash art:** `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/[Name].png`
- **Item icons:** `https://ddragon.leagueoflegends.com/cdn/15.5.1/img/item/[itemId].png`
- **Versão atual do patch:** verificar em `https://ddragon.leagueoflegends.com/api/versions.json`
- **Venda do guia completo:** Kiwify (link a ser fornecido)
- **Contato:** titiltei.contatos@gmail.com | +55 12 9 8270-0714

---

## Funcionalidades Fase 1 (MVP)

- [ ] Grid de campeões com ícones circulares (mesma UX do arthurlanches)
- [ ] Filtro por dificuldade (Fácil / Médio / Difícil)
- [ ] Ao clicar em campeão: exibe painel com Estratégia / Dicas / Detalhes / Item sugestão
- [ ] Seção Hero com arte do Shaco
- [ ] Seção "Sobre" com bio do Titiltei
- [ ] CTA para compra do guia completo
- [ ] Links de redes sociais

## Funcionalidades Fase 2 (Futuro)

- [ ] Live/stream embed (Twitch/YouTube)
- [ ] Agendamento de coaching
- [ ] Seção de build e runas completas
- [ ] Newsletter

---

## Estrutura de Pastas (Next.js App Router)

```
src/
  app/
    page.tsx          # Home com todas as seções
    layout.tsx        # Layout global
  components/
    Header.tsx
    Hero.tsx
    About.tsx
    MatchupGrid.tsx   # Grid de ícones de campeões
    MatchupPanel.tsx  # Painel de detalhes do matchup
    BuyGuide.tsx
    Footer.tsx
  data/
    matchups.ts       # Dados estáticos dos matchups
  lib/
    types.ts          # Interfaces TypeScript
```

---

## Observações Importantes

- Manter tudo **estático** (sem API calls em runtime) — facilita hospedagem gratuita na Vercel
- Dados dos matchups em arquivos `.ts` — fácil de adicionar novos matchups sem backend
- Imagens de campeões via CDN da Riot (gratuito, não precisa hospedar)
- O site deve refletir a identidade visual do PDF: escuro, vermelho, impactante
