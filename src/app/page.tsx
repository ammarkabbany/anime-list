"use client"

import { env } from "@/env"
import { useQuery } from "@tanstack/react-query";
import { type Anime, type AnimeResponse } from "@/types/jikan";
import AnimeCard from "@/components/AnimeCard";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  
  const { data, isLoading } = useQuery<Anime[]>({
    queryKey: ["animes"],
    queryFn: async () => {
        try {
          const response = await fetch(`${env.NEXT_PUBLIC_NEXT_URL}/api/anime/list`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          const data = await response.json() as AnimeResponse
          return data.data
        } catch (error) {
          console.error("Error fetching data:", error);
          return []
        }
      },
  })
  
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Top Animes</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data?.map((anime) => (
            <AnimeCard 
              key={anime.mal_id}
              anime={anime}
              onClick={(anime) => {
                router.push(`/anime/${anime.mal_id}`)
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
