## 1. Helper YouTube API

- [x] 1.1 Criar `src/lib/youtube.ts` com função `getLatestVideos(maxResults = 6): Promise<YouTubeVideo[]>`
- [x] 1.2 Tipo `YouTubeVideo = { id: string; title: string; thumbnail: string; publishedAt: string }`
- [x] 1.3 Ler `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID` de `process.env`; retornar `[]` se algum estiver ausente
- [x] 1.4 Fazer fetch para `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={CHANNEL_ID}&order=date&maxResults={maxResults}&type=video&key={API_KEY}` com `next: { revalidate: 3600 }`
- [x] 1.5 Em caso de erro (response não ok, exceção), logar o erro e retornar `[]`
- [x] 1.6 Mapear `items[]` para `YouTubeVideo`: `id = item.id.videoId`, `title = item.snippet.title`, `thumbnail = item.snippet.thumbnails.medium.url`, `publishedAt = item.snippet.publishedAt`

## 2. Página comunidade

- [x] 2.1 Converter `src/app/lobby/comunidade/page.tsx` para async Server Component
- [x] 2.2 Chamar `getLatestVideos()` no topo da função
- [x] 2.3 Se `videos.length > 0`, renderizar seção "Vídeos recentes" com título `border-l-2 border-[#e3001b] pl-3`
- [x] 2.4 Grid de cards: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- [x] 2.5 Cada card: thumbnail `<img>` em `aspect-video object-cover rounded-t-xl`, título, data formatada (`toLocaleDateString('pt-BR')`), link `"Assistir →"` apontando para `https://youtube.com/watch?v={id}` com `target="_blank" rel="noopener"`
- [x] 2.6 Cards com design: `bg-[#161616] border border-white/5 rounded-xl overflow-hidden`

## 3. Variável de ambiente

- [x] 3.1 Adicionar `YOUTUBE_API_KEY=` e `YOUTUBE_CHANNEL_ID=` ao `.env.local` (valores reais não comitar)
- [ ] 3.2 Documentar as variáveis no `.env.example` se existir

## 4. Verificação

- [ ] 4.1 Configurar `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID` no `.env.local` (requer chave de terceiro)
- [ ] 4.2 Acessar `/lobby/comunidade` e confirmar que os cards de vídeos aparecem
- [ ] 4.3 Clicar em "Assistir →" e confirmar que abre o vídeo no YouTube
- [ ] 4.4 Remover `YOUTUBE_API_KEY` temporariamente e confirmar que a página carrega sem erro (seção some)
