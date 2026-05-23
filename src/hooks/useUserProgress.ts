import { useQuery } from "@tanstack/react-query"

interface UserProgress {
  watchedSeconds: number | null
  completedAt: string | null
}

export function useUserProgress(slug: string) {
  return useQuery<UserProgress>({
    queryKey: ["user-progress", slug],
    queryFn: async () => {
      const res = await fetch(`/api/contents/${slug}/progress`)
      if (!res.ok) throw new Error("Failed to fetch progress")
      return res.json() as Promise<UserProgress>
    },
    staleTime: 60 * 1000,
  })
}
