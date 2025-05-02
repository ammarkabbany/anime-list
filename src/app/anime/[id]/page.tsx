"use client";
import ShowOverview from "@/components/ShowOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetAnime } from "@/hooks/use-get-anime";
import { Loader2, PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const AnimePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: anime, isLoading } = useGetAnime(id);
  const [showTrailer, setShowTrailer] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 size-8" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center">
        <p className="text-red-500">Anime not found</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Title section - aligned left */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-blue-300 text-shadow-lg sm:text-3xl">
          {anime.title}
        </h1>
        {anime.title_japanese && (
          <h2 className="text-muted-foreground mt-1 text-sm sm:text-base">
            {anime.title_japanese}
          </h2>
        )}
      </div>

      {/* Rating and Votes - more compact */}
      <div className="mt-3 flex items-center space-x-2">
        {/* <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-base font-bold">
            </span> */}
        <div className="flex items-center gap-1">
          <Star size={20} className="fill-yellow-400 text-yellow-400" />
          <p className="text-lg">{Number(anime.score).toFixed(1)}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">
            ({Number(anime.scored_by).toLocaleString()} votes)
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column - Image, Rating, Trailer Button */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <Image
                src={anime.images.webp.large_image_url}
                alt={anime.title}
                width={500}
                height={700}
                className="h-auto w-full object-cover"
              />
            </CardContent>
          </Card>

          {/* Trailer Button */}
          {anime.trailer?.embed_url && (
            <Button
              variant="outline"
              className="mt-3 flex w-full items-center justify-center gap-2 py-1.5"
              onClick={() => setShowTrailer(!showTrailer)}
            >
              <PlayCircle size={16} />
              Watch Trailer
            </Button>
          )}

          {/* Trailer Display */}
          {showTrailer && anime.trailer?.embed_url && (
            <div className="mt-3">
              <iframe
                className="aspect-video w-full"
                src={anime.trailer.embed_url}
                title="Anime Trailer"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="md:col-span-2">
          {/* Genres */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {anime.genres.map((genre) => (
                <Badge
                  key={genre.mal_id}
                  variant="secondary"
                  className="py-0.5 text-xs"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoCard title="Type" value={anime.type ?? "Unknown"} />
            <InfoCard
              title="Episodes"
              value={anime.episodes?.toString() ?? "Unknown"}
            />
            <InfoCard title="Rating" value={anime.rating ?? "Unknown"} />
            <InfoCard title="Status" value={anime.status ?? "Unknown"} />
            <InfoCard
              title="Duration"
              value={
                anime.duration
                  ? `${anime.duration}`
                  : "Unknown"
              }
            />
            <InfoCard
              title="Studios"
              value={
                anime.studios?.map((studio) => studio.name).join(", ") ??
                "Unknown"
              }
            />
          </div>

          {/* MAL Link */}
          <a
            className="text-foreground mb-4 inline-block text-sm hover:underline"
            href={anime.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on <strong>MyAnimeList</strong> →
          </a>

          {/* Synopsis */}
          <div>
            <h3 className="mb-2 text-base font-semibold">Synopsis</h3>
            <ShowOverview overview={anime.synopsis ?? ""} />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper component for info grid
const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-muted/20 rounded-lg p-2">
    <h4 className="text-muted-foreground text-xs font-medium">{title}</h4>
    <p className="text-sm font-medium">{value}</p>
  </div>
);

export default AnimePage;
