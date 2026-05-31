export type YouTubeVideo = {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

export async function getLatestVideos(maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY
  const channelId = process.env.YOUTUBE_CHANNEL_ID
  if (!apiKey || !channelId) return []

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=${maxResults}&type=video&key=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.error(`[youtube] API error: ${res.status}`)
      return []
    }
    const data = await res.json()
    return (data.items ?? []).map((item: {
      id: { videoId: string }
      snippet: { title: string; thumbnails: { medium: { url: string } }; publishedAt: string }
    }) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }))
  } catch (err) {
    console.error("[youtube] fetch failed:", err)
    return []
  }
}
