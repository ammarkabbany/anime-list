import React from 'react';
import Link from 'next/link'; // Import Link
import { getSeasonalAnime } from '@/actions/anime';
import AnimeCard from '@/components/AnimeCard';
import { type Anime } from '@/types/jikan';

export default async function SeasonalAnimeSection() {
  const seasonalAnime = await getSeasonalAnime('now');

  if (!seasonalAnime || seasonalAnime.length === 0) {
    // Optional: Render a message or a skeleton loader
    return <p className="py-8 text-center text-muted-foreground">Could not load seasonal anime or none available.</p>;
  }

  return (
    <section className="py-8 container mx-auto px-4"> {/* Added container and padding */}
      <h2 className="mb-6 text-3xl font-bold text-primary">Currently Airing This Season</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"> {/* Horizontal scroll with hidden scrollbar */}
        {seasonalAnime.map((anime: Anime) => (
          <div key={anime.mal_id} className="w-52 flex-shrink-0 md:w-60"> {/* Adjusted width for consistency with AnimeCard aspect ratio */}
            <Link href={`/anime/${anime.mal_id}`} passHref>
              <AnimeCard
                anime={anime}
                onClick={() => {
                  // The onClick is now handled by the Link wrapper for navigation.
                  // If AnimeCard had other interactive elements, their onClicks would still function.
                }}
              />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
// Ensure a newline at the end of the file
