## Context

A rota `/dashboard/comunidade` retorna 404 hoje. O link está fixo na navbar. A comunidade do titico existe em canais externos (Discord, YouTube). Para o MVP, a página é totalmente estática — sem banco, sem API. O conteúdo (URLs, descrições) é configurado via constantes no próprio arquivo da página.

## Goals / Non-Goals

**Goals:**
- Resolver o 404 com uma página visualmente consistente com a plataforma
- Seções: destaque do Discord (CTA principal), YouTube (canal), outros canais secundários
- Links externos abrem em nova aba com `rel="noopener noreferrer"`
- Cards de canal com ícone SVG, nome, descrição e contagem de membros/inscritos (estático, atualizado manualmente)
- Layout responsivo, dark theme, seguindo o design system

**Non-Goals:**
- Integração com Discord API (membros online, feed de mensagens)
- Feed dinâmico de posts ou comentários
- Autenticação via Discord
- Qualquer backend — página 100% estática

## Decisions

### Server Component puro — sem `'use client'`

A página não tem interatividade — apenas links. Server Component é o padrão correto; sem overhead de bundle cliente.

### Constantes no topo do arquivo, não em arquivo separado

O conteúdo (URLs, nomes, descrições) é editado raramente. Uma constante `CHANNELS` no topo do `page.tsx` é simples de manter. Não vale criar um arquivo de config separado.

### Discord como CTA primário

Discord é onde a comunidade ativa está. O card de Discord recebe tratamento visual diferenciado (maior, com cor roxa característica `#5865F2`), os demais canais são secundários.

### Estrutura de seções

1. **Hero da página** — título "Comunidade", subtítulo, descrição breve
2. **Canal principal** — card grande do Discord com CTA "Entrar no servidor"
3. **Outros canais** — grid 2-3 colunas com YouTube, WhatsApp (se houver), etc.
4. **Call to action final** — "Dúvidas? Pergunte no Discord" com link

## Risks / Trade-offs

[Links estáticos ficam desatualizados] Se o convite do Discord expirar, precisa de deploy para atualizar → mitigado usando convite permanente (sem expiração no Discord)

[Sem contagem real de membros] Número exibido é estático → documentar no código que deve ser atualizado manualmente
