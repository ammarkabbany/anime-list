import { env } from "@/env"
import type { Anime } from "@/types/jikan"
import { useQuery } from "@tanstack/react-query"


export const useGetAnime = (id: string) => {
  return useQuery<Anime | null>({
    queryKey: ["anime", id],
    queryFn: async () => {
        try {
          const response = await fetch(`${env.NEXT_PUBLIC_NEXT_URL}/api/anime/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          const data = await response.json() as Anime
          return data
        } catch (error) {
          console.error("Error fetching data:", error);
          return null
        }
      },
      staleTime: Infinity,
      refetchOnWindowFocus: false
  })
}