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
      className="anime-card cursor-pointer h-full flex flex-col py-0"
      onClick={() => onClick(anime)}
    >
      <div className="card-image-container">
        <Image 
          src={anime.images.jpg.large_image_url} 
          alt={anime.title}
          width={300}
          height={450}
          priority
          className="card-image"
        />
        <div className="card-overlay">
          <Badge variant="outline" className="self-start bg-black/50 text-white border-none mb-1">
            {anime.type || 'Unknown'}
          </Badge>
          {anime.score && anime.score > 0 && (
            <div className="flex items-center text-white mb-2">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span>{anime.score.toFixed(1)}</span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-white line-clamp-2">{anime.title}</h3>
        </div>
      </div>
      <div className="p-3 flex-grow">
        <h3 className="text-base font-semibold line-clamp-1 text-foreground hover:text-primary transition-colors">{anime.title}</h3>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>{anime.status}</span>
          {anime.episodes && <span>{anime.episodes} episodes</span>}
        </div>
      </div>
    </Card>
  );
};

export default AnimeCard;