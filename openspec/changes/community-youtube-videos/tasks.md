## 1. YouTube API Helper

- [x] 1.1 Create `src/lib/youtube.ts` with function `getLatestVideos(maxResults = 6): Promise<YouTubeVideo[]>`
- [x] 1.2 Type `YouTubeVideo = { id: string; title: string; thumbnail: string; publishedAt: string }`
- [x] 1.3 Read `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` from `process.env`; return `[]` if either is missing
- [x] 1.4 Fetch `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={CHANNEL_ID}&order=date&maxResults={maxResults}&type=video&key={API_KEY}` with `next: { revalidate: 3600 }`
- [x] 1.5 On error (non-ok response, exception), log the error and return `[]`
- [x] 1.6 Map `items[]` to `YouTubeVideo`: `id = item.id.videoId`, `title = item.snippet.title`, `thumbnail = item.snippet.thumbnails.medium.url`, `publishedAt = item.snippet.publishedAt`

## 2. Community page

- [x] 2.1 Convert `src/app/lobby/comunidade/page.tsx` to an async Server Component
- [x] 2.2 Call `getLatestVideos()` at the top of the function
- [x] 2.3 If `videos.length > 0`, render a "Recent videos" section with title styled `border-l-2 border-[#e3001b] pl-3`
- [x] 2.4 Card grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- [x] 2.5 Each card: thumbnail `<img>` with `aspect-video object-cover rounded-t-xl`, title, formatted date (`toLocaleDateString('pt-BR')`), "Watch →" link pointing to `https://youtube.com/watch?v={id}` with `target="_blank" rel="noopener"`
- [x] 2.6 Card design: `bg-[#161616] border border-white/5 rounded-xl overflow-hidden`

## 3. Environment variable

- [x] 3.1 Add `YOUTUBE_API_KEY=` and `YOUTUBE_CHANNEL_ID=` to `.env.local` (do not commit real values)
- [ ] 3.2 Document the variables in `.env.example` if it exists

## 4. Verification

- [ ] 4.1 Set `YOUTUBE_API_KEY` and `YOUTUBE_CHANNEL_ID` in `.env.local` (requires a third-party key)
- [ ] 4.2 Visit `/lobby/comunidade` and confirm that the video cards appear
- [ ] 4.3 Click "Watch →" and confirm it opens the video on YouTube
- [ ] 4.4 Remove `YOUTUBE_API_KEY` temporarily and confirm the page loads without error (section disappears)
