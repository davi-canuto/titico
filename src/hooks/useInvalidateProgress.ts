import { useQueryClient } from "@tanstack/react-query"

export function useInvalidateProgress() {
  const queryClient = useQueryClient()
  return (slug?: string) => {
    queryClient.invalidateQueries({
      queryKey: slug ? ["user-progress", slug] : ["user-progress"],
    })
  }
}
