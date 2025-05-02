import { getAnimeById } from "@/actions/anime";
import {
  createAnimeListEntry,
  getAnimeListEntry,
  updateAnimeListEntryEpisodes,
  updateAnimeListEntryStatus,
} from "@/actions/animelist";
import ShowOverview from "@/components/ShowOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/env";
import { currentUser } from "@clerk/nextjs/server";
import { PlusCircleIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AnimeStatusDropdown from "@/components/AnimeStatusDropdown";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { AnimeListStatus } from "@/types/animelist";
import AddToListButton from "@/components/AddToListButton";
import AnimeEpisodesButtons from "@/components/AnimeEpisodesButtons";

interface AnimePageProps {
  params: Promise<{ id: string }>;
}

const AnimePage = async ({ params }: AnimePageProps) => {
  // const { id } = useParams<{ id: string }>();
  const { id } = await params;
  // const { data: anime, isLoading } = useGetAnime(id);
  const anime = await getAnimeById(id);

  const user = await currentUser();

  if (!anime) {
    return (
      <div className="flex min-h-[90vh] items-center justify-center">
        <p className="text-red-500">Anime not found</p>
      </div>
    );
  }

  const animeListEntry = await getAnimeListEntry({
    animeId: anime.mal_id.toString(),
    userId: user?.id,
  });

  const handleUpdateStatus = async (status: AnimeListStatus) => {
    "use server";
    if (!animeListEntry) return;
    await updateAnimeListEntryStatus({
      entry: animeListEntry,
      userId: user?.id,
      status,
    });
  };

  // Add this near your other server actions
  async function addToListAction(formData: FormData) {
    "use server";

    const animeId = formData.get("animeId") as string;
    const user = await currentUser();

    if (!user) {
      return;
    }

    const anime = await getAnimeById(animeId);

    if (!anime) {
      console.error("Anime not found");
      return;
    }

    try {
      await createAnimeListEntry({
        userId: user.id,
        animeId: anime.mal_id.toString(),
        title: anime.title,
        imageUrl: anime.images.jpg.large_image_url,
        totalEpisodes: anime.episodes,
      });
    } catch (error) {
      console.error("Failed to add anime to list:", error);
    }
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
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Left Column - Image, Rating, Trailer Button */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden py-0">
            <CardContent className="p-0">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                width={500}
                height={700}
                className="h-auto w-full object-cover"
              />
            </CardContent>
          </Card>
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

          <div className="mb-4">
            <SignedIn>
              {animeListEntry ? (
                <div className="flex items-center gap-2">
                  <AnimeStatusDropdown
                    animeId={anime.mal_id.toString()}
                    animeTitle={anime.title}
                    animeImage={anime.images.jpg.large_image_url}
                    initialStatus={animeListEntry?.status}
                    onStatusChange={handleUpdateStatus}
                  />
                  {animeListEntry.status !== AnimeListStatus.Completed && (
                    <AnimeEpisodesButtons
                      totalEpisodes={animeListEntry.total_episodes}
                      watchedEpisodes={animeListEntry.episodes_watched}
                      handleChange={async (episodes: number) => {
                        "use server";
                        await updateAnimeListEntryEpisodes({
                          entryId: animeListEntry.id,
                          userId: user?.id,
                          episodes,
                          totalEpisodes: animeListEntry.total_episodes,
                        });
                      }}
                    />
                  )}
                </div>
              ) : (
                <AddToListButton
                  animeId={anime.mal_id.toString()}
                  action={addToListAction}
                />
              )}
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button
                  variant="default"
                  className="flex items-center justify-center gap-2 bg-blue-500 text-white transition-colors hover:bg-blue-600"
                >
                  <PlusCircleIcon className="h-4 w-4" />
                  Add to List
                </Button>
              </SignInButton>
            </SignedOut>
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
              value={anime.duration ? `${anime.duration}` : "Unknown"}
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
        {/* Trailer Display */}
        {anime.trailer?.embed_url && (
          <div className="mt-3 md:col-span-2 lg:col-span-1">
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
      {/* Relations -- sequels/prequels */}
      <div className="mt-4 grid grid-flow-col grid-rows-2 items-center justify-center gap-4 lg:justify-evenly">
        {anime.relations?.map(({ relation, entry }) => (
          <div key={relation} className="grid grid-cols-1">
            <div className="flex items-center gap-2">
              <h2 className="text-muted-foreground">{relation}</h2>
              <h3 className="text-muted-foreground text-sm capitalize">
                ({entry.find((e) => e.type)?.type})
              </h3>
            </div>

            {entry?.map((entry) => (
              <Link
                key={entry.mal_id}
                className="hover:underline"
                href={`${env.NEXT_PUBLIC_NEXT_URL}/${entry.type}/${entry.mal_id}`}
              >
                {entry.name}
              </Link>
            ))}
          </div>
        ))}
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
