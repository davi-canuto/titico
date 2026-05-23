## 1. Página de comunidade

- [x] 1.1 Criar `src/app/dashboard/comunidade/page.tsx` como Server Component
- [x] 1.2 Definir constante `CHANNELS` no topo do arquivo com os canais (Discord, YouTube, etc.) — cada canal com `name`, `description`, `url`, `icon` (nome para SVG inline), `members` (string estática), `color`
- [x] 1.3 Implementar seção hero da página: título "Comunidade", subtítulo descritivo
- [x] 1.4 Implementar card principal do Discord: destaque visual (borda colorida `#5865F2`), CTA "Entrar no servidor", contagem de membros
- [x] 1.5 Implementar grid de canais secundários (YouTube, WhatsApp) com cards menores
- [x] 1.6 Todos os links externos: `target="_blank" rel="noopener noreferrer"`
- [x] 1.7 Seguir design system: `bg-[#0d0d0d]`, cards `bg-[#161616] border-white/5`, tipografia `font-black uppercase`

## 2. Validação

- [x] 2.1 Acessar `/dashboard/comunidade` autenticado → página renderiza sem erro
- [x] 2.2 Verificar que links externos abrem em nova aba
- [x] 2.3 Verificar responsividade mobile
