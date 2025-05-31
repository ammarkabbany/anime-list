import React from 'react';
import { Card } from "@/components/ui/card";
import { type Anime } from '@/types/jikan';
import { Badge } from '@/components/ui/badge';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick }) => {
  return (
    <Card
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg bg-card shadow-lg transition-all duration-300 hover:shadow-primary/30"
      onClick={() => onClick(anime)}
    >
      {/* Image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" // Adjusted sizes for common breakpoints
        />
        {/* Score Badge - Top Right */}
        {anime.score && anime.score > 0 && (
          <Badge
            // Using default Badge variant which should pick up primary bg/text from theme
            className="absolute top-2 right-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs shadow-md border-transparent"
          >
            <StarIcon className="h-3 w-3" />
            <span>{anime.score.toFixed(1)}</span>
          </Badge>
        )}
         {/* Type Badge - Top Left */}
        {anime.type && (
          <Badge
            variant="secondary" // Using secondary for a different look
            className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs shadow-md border-transparent"
          >
            {anime.type}
          </Badge>
        )}
      </div>

      {/* Content section - title, displayed below image */}
      <div className="px-3 py-0"> {/* Changed py-2 to py-0 */}
        <h3
            className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary"
            title={anime.title} // Add title attribute for full title on hover if truncated
        >
          {anime.title}
        </h3>
        <div className="mt-0.5 flex flex-col"> {/* Wrapper for year and status */}
          {anime.year && (
              <p className="text-xs text-muted-foreground">{anime.year}</p>
          )}
          {anime.status && (
              <p className="mt-0.5 text-xs text-muted-foreground/80 truncate" title={anime.status}>{anime.status}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnimeCard;