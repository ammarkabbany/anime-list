"use client"

import { useCallback, useEffect, useState } from "react";
import { env } from "@/env"
import { useQuery } from "@tanstack/react-query";
import { type Anime, type AnimeResponse } from "@/types/jikan";
import AnimeCard from "@/components/AnimeCard";
// SeasonalAnimeSection and UpcomingAnimeSection are removed as they'll be passed as props
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useUser } from "@clerk/nextjs";

export default function HomePageClientContent() {
  const { user } = useUser();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1)
  const [disabledPagination, setDisablePagination] = useState(false)
  const [fetchUrl, setFetchUrl] = useState(`${env.NEXT_PUBLIC_JIKAN_API_URL}/top/anime?limit=25&filter=bypopularity`)

  const handleAnimeCardClick = useCallback((anime: Anime) => {
    router.push(`/anime/${anime.mal_id}`);
  }, [router]);

  const { data, isLoading } = useQuery<Anime[]>({
    queryKey: ["animes", fetchUrl, currentPage],
    queryFn: async () => {
      try {
        setDisablePagination(true)
        const response = await fetch(fetchUrl + `&page=${currentPage}`);
        const data = await response.json() as AnimeResponse
        return data.data
      } catch (error) {
        console.error("Error fetching data:", error);
        return []
      } finally {
        setDisablePagination(false)
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  return (
    <main className="container mx-auto flex flex-col items-center justify-center p-4">
      <Pagination className="*:select-none">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious aria-disabled={disabledPagination} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} />
          </PaginationItem>
          {currentPage > 1 && (
            <>
              <PaginationItem key={1}>
                <PaginationLink aria-disabled={disabledPagination} onClick={() => setCurrentPage(1)}>
                  1
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          <PaginationItem key={currentPage}>
            <PaginationLink aria-disabled={disabledPagination} onClick={() => null} isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          {Array.from({ length: 3 }).map((_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink aria-disabled={disabledPagination} onClick={() => setCurrentPage(currentPage + i + 1)}>
                {currentPage + i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext aria-disabled={disabledPagination} onClick={() => setCurrentPage(prev => prev + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <section className="w-full"> {/* Wrapper for Top Animes */}
        <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Top Animes</h1>
        {user?.username === "ammarkabbany" && <div className="space-x-2">
          <span className="text-lg mb-3">S.S</span>
          <Switch
            onCheckedChange={() => setFetchUrl(prev => {
              if (prev.includes('&rating=rx')) {
                const t = prev.replaceAll('&rating=rx', '')
                return t;
              } else {
                return prev + "&rating=rx"
              }
            })
            }
            className="dark:data-[state=unchecked]:bg-neutral-700 scale-125 mb-4" />
        </div>}
        {isLoading ? (
          <div className="text-center">Loading Top Animes...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {data?.map((anime, i) => (
              <AnimeCard
                key={anime.mal_id + "_" + i}
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
