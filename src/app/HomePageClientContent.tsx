"use client"

import { useCallback } from "react";
import { env } from "@/env"
import { useQuery } from "@tanstack/react-query";
import { type Anime, type AnimeResponse } from "@/types/jikan";
import AnimeCard from "@/components/AnimeCard";
// SeasonalAnimeSection and UpcomingAnimeSection are removed as they'll be passed as props
import { useRouter } from "next/navigation";

export default function HomePageClientContent() {
  const router = useRouter();

  const handleAnimeCardClick = useCallback((anime: Anime) => {
    router.push(`/anime/${anime.mal_id}`);
  }, [router]);

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
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
  })

  return (
    <main className="container mx-auto flex flex-col items-center justify-center p-4">
      <section className="w-full"> {/* Wrapper for Top Animes */}
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Top Animes</h1>
        {isLoading ? (
          <div className="text-center">Loading Top Animes...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data?.map((anime) => (
              <AnimeCard
                key={anime.mal_id}
                anime={anime}
                onClick={handleAnimeCardClick}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
// Newline at end of file
