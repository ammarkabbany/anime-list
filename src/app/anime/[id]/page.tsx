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
// Card and CardContent might not be needed directly if InfoCard is restyled
// import { Card, CardContent } from "@/components/ui/card";
import { env } from "@/env";
import { currentUser } from "@clerk/nextjs/server";
import { PlusCircleIcon, StarIcon as StarSolidIcon } from "lucide-react"; // Renamed for clarity if using hollow Star
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

// Helper component for info grid (restyled)
const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-card p-3 rounded-lg shadow-md hover:shadow-primary/20 transition-shadow duration-200">
    <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
    <p className="text-sm font-semibold text-foreground">{value}</p>
  </div>
);

const AnimePage = async ({ params }: AnimePageProps) => {
  const { id } = await params;
  const anime = await getAnimeById(id);
  const user = await currentUser();

  if (!anime) {
    return (
      <div className="flex min-h-[90vh] items-center justify-center">
        <p className="text-destructive font-semibold">Anime not found.</p>
      </div>
    );
  }

  const animeListEntry = await getAnimeListEntry({
    animeId: anime.mal_id.toString(),
    userId: user?.id,
  });

  // Server actions remain the same
  const handleUpdateStatus = async (status: AnimeListStatus) => {
    "use server";
    if (!animeListEntry) return; // Should ideally also check for user
    if (!user?.id) return; // Explicit user check
    await updateAnimeListEntryStatus({
      entry: animeListEntry,
      userId: user.id,
      status,
    });
  };

  async function addToListAction(formData: FormData) {
    "use server";
    const animeId = formData.get("animeId") as string;
    const user = await currentUser(); // Re-fetch user for server action context
    if (!user) return;
    const currentAnime = await getAnimeById(animeId); // Re-fetch anime for safety
    if (!currentAnime) {
      console.error("Anime not found for addToListAction");
      return;
    }
    try {
      await createAnimeListEntry({
        userId: user.id,
        animeId: currentAnime.mal_id.toString(),
        title: currentAnime.title,
        imageUrl: currentAnime.images.jpg.large_image_url,
        totalEpisodes: currentAnime.episodes,
      });
    } catch (error) {
      console.error("Failed to add anime to list:", error);
    }
  }

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-end p-4 md:p-8 text-white">
        {/* Background Image */}
        <Image
          src={anime.images.jpg.large_image_url}
          alt={`Background for ${anime.title}`}
          fill
          className="absolute inset-0 w-full h-full object-cover -z-10"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 -z-10" />

        {/* Hero Content */}
        <div className="relative z-0 container mx-auto w-full"> {/* Added w-full for proper container behavior */}
          <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg mb-1">
            {anime.title}
          </h1>
          {anime.title_japanese && (
            <h2 className="text-lg md:text-xl text-gray-300 drop-shadow-md mb-4">
              {anime.title_japanese}
            </h2>
          )}

          <div className="flex items-center gap-2 mb-4">
            <StarSolidIcon size={24} className="fill-yellow-400 text-yellow-400" />
            <p className="text-2xl font-bold">{Number(anime.score).toFixed(2)}</p>
            <span className="text-sm text-gray-300">
              ({Number(anime.scored_by).toLocaleString()} votes)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <SignedIn>
              {animeListEntry ? (
                <>
                  <AnimeStatusDropdown
                    animeId={anime.mal_id.toString()}
                    animeTitle={anime.title}
                    animeImage={anime.images.jpg.large_image_url}
                    initialStatus={animeListEntry?.status}
                    onStatusChange={handleUpdateStatus}
                  />
                  {/* Removed episodes button from hero, can be on list card */}
                </>
              ) : (
                <AddToListButton
                  animeId={anime.mal_id.toString()}
                  action={addToListAction}
                />
              )}
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="default"> {/* Uses new gradient button style */}
                  <PlusCircleIcon className="mr-2 h-4 w-4" /> Add to List
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Main Content Area Below Hero */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Synopsis, Genres, Details) */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-primary/30 pb-2">
                Synopsis
              </h3>
              <ShowOverview overview={anime.synopsis ?? "No synopsis available."} />
            </section>

            <section>
              <h3 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-primary/30 pb-2">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Badge key={genre.mal_id} variant="secondary" className="text-sm px-3 py-1">
                    {genre.name}
                  </Badge>
                ))}
                {anime.themes.map((theme) => (
                  <Badge key={theme.mal_id} variant="outline" className="text-sm px-3 py-1">
                    {theme.name}
                  </Badge>
                ))}
                {anime.demographics.map((demographic) => (
                  <Badge key={demographic.mal_id} variant="outline" className="text-sm px-3 py-1 bg-popover text-popover-foreground">
                    {demographic.name}
                  </Badge>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Details, Trailer, Relations) */}
          <div className="lg:col-span-1 space-y-8">
            <section>
              <h3 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-primary/30 pb-2">
                Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard title="Type" value={anime.type ?? "N/A"} />
                <InfoCard title="Episodes" value={anime.episodes?.toString() ?? "N/A"} />
                <InfoCard title="Status" value={anime.status ?? "N/A"} />
                <InfoCard title="Rating" value={anime.rating ?? "N/A"} />
                <InfoCard title="Duration" value={anime.duration ?? "N/A"} />
                <InfoCard title="Source" value={anime.source ?? "N/A"} />
                <InfoCard title="Season" value={`${anime.season ?? "N/A"} ${anime.year ?? ""}`} />
                <InfoCard title="Aired" value={anime.aired?.string ?? "N/A"} />
                <InfoCard
                  title="Studios"
                  value={anime.studios?.map((s) => s.name).join(", ") || "N/A"}
                />
                <InfoCard
                  title="Producers"
                  value={anime.producers?.map((p) => p.name).join(", ") || "N/A"}
                />
              </div>
              <a
                className="text-accent-foreground hover:text-primary mt-4 inline-block text-sm hover:underline"
                href={anime.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on MyAnimeList →
              </a>
            </section>

            {anime.trailer?.embed_url && (
              <section>
                <h3 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-primary/30 pb-2">
                  Trailer
                </h3>
                <div className="aspect-video overflow-hidden rounded-lg shadow-md">
                  <iframe
                    className="w-full h-full"
                    src={anime.trailer.embed_url}
                    title="Anime Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {anime.relations && anime.relations.length > 0 && (
              <section>
                <h3 className="text-2xl font-semibold text-primary mb-4 border-b-2 border-primary/30 pb-2">
                  Related Anime
                </h3>
                <div className="space-y-3">
                  {anime.relations.map(({ relation, entry }) => (
                    <div key={relation + entry[0]?.mal_id} className="bg-card p-3 rounded-lg shadow-sm">
                      <h4 className="text-sm font-semibold text-foreground capitalize">{relation}</h4>
                      {entry?.map((e) => (
                        <Link
                          key={e.mal_id}
                          href={`/anime/${e.mal_id}`} // Assuming URL structure, might need adjustment for manga etc.
                          className="block text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          {e.name} ({e.type})
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AnimePage;
// Ensure newline at end of file
