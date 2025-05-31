import React from 'react';
import Link from 'next/link';
import { getSeasonalAnime } from '@/actions/anime';
import AnimeCard from '@/components/AnimeCard';
import { type Anime } from '@/types/jikan';

export default async function UpcomingAnimeSection() {
  const upcomingAnime = await getSeasonalAnime('upcoming');

  if (!upcomingAnime || upcomingAnime.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">Could not load upcoming anime or none announced yet.</p>;
  }

  return (
    <section className="py-8 container mx-auto px-4">
      <h2 className="mb-6 text-3xl font-bold text-primary">Coming Next Season</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"> {/* Horizontal scroll with hidden scrollbar */}
        {/* {upcomingAnime.map((anime: Anime) => (
          <div key={anime.mal_id} className="w-52 flex-shrink-0 md:w-60">
            <Link href={`/anime/${anime.mal_id}`} passHref>
              <AnimeCard
                anime={anime}
              />
            </Link>
          </div>
        ))} */}
      </div>
    </section>
  );
}
// Ensure a newline at the end of the file
