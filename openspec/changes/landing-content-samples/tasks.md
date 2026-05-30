## 1. Query na landing

- [x] 1.1 Em `src/app/page.tsx`, adicionar ao `Promise.all` existente uma query: `prisma.content.findMany({ where: { status: 'PUBLISHED', active: true }, orderBy: { publishedAt: 'desc' }, take: 4, select: { id, title, type, thumbnail, matchup: { select: { difficulty } } } })`
- [x] 1.2 Passar o resultado como prop `samples` para `ContentSamplesSection`

## 2. Componente ContentSamplesSection

- [x] 2.1 Criar `src/components/landing/ContentSamplesSection.tsx` como Server Component
- [x] 2.2 Se `samples` for array vazio, retornar `null`
- [x] 2.3 Renderizar título da seção: `"Veja antes de assinar"` com acento lateral vermelho (`border-l-2 border-[#e3001b] pl-3`)
- [x] 2.4 Renderizar grid responsivo de cards (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`)
- [x] 2.5 Cada card: `bg-[#161616] border border-white/5 rounded-xl overflow-hidden`
- [x] 2.6 Thumbnail: `<Image fill className="object-cover">` dentro de `aspect-video`; se nulo, fundo `bg-white/5` com ícone placeholder
- [x] 2.7 Badge de tipo: `text-xs uppercase tracking-[0.25em] font-semibold text-white/50`
- [x] 2.8 Badge de dificuldade (só MATCHUP): cor verde/amarelo/vermelho conforme difficulty
- [x] 2.9 Título do conteúdo: `font-black uppercase tracking-tight text-sm`
- [x] 2.10 Link "Ver amostra gratuita →": `href="/preview/[id]"`, cor `text-[#e3001b] text-sm font-semibold hover:underline`

## 3. Integração na landing

- [x] 3.1 Importar `ContentSamplesSection` em `src/app/page.tsx`
- [x] 3.2 Inserir `<ContentSamplesSection samples={samples} />` após `<PricingSection />`

## 4. Verificação

- [x] 4.1 Abrir a landing sem login e confirmar que a seção aparece com os cards
- [x] 4.2 Clicar em "Ver amostra gratuita →" e confirmar que abre `/preview/[id]` sem redirect para login
- [x] 4.3 Confirmar que se não houver conteúdo publicado a seção não aparece (pode testar temporariamente despublicando todos)
