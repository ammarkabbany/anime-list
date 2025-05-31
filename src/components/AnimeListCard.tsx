"use client";

import React, { startTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { type AnimeListEntry, AnimeListStatus } from "@/types/animelist";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateAnimeListEntryEpisodes, updateAnimeListEntryScore } from "@/actions/animelist";
import { useUpdateAnimeEpisodes } from "@/hooks/use-update-anime-episodes";
import { Button } from "./ui/button";

interface AnimeListCardProps {
  entry: AnimeListEntry;
  userId: string | undefined;
}

const statusLabels: Record<AnimeListStatus, string> = {
  [AnimeListStatus.Watching]: "Current",
  [AnimeListStatus.Completed]: "Completed",
  [AnimeListStatus.OnHold]: "On Hold",
  [AnimeListStatus.Dropped]: "Dropped",
  [AnimeListStatus.PlanToWatch]: "Planned",
};

const AnimeListCard: React.FC<AnimeListCardProps> = ({ entry, userId }) => {
  const { userId: clerkUserId } = useAuth();
  const showPlusIcon =
    clerkUserId &&
    userId === clerkUserId &&
    (entry.status === AnimeListStatus.Watching ||
      entry.status === AnimeListStatus.PlanToWatch);

  const [scoreSelectOpen, setScoreSelectOpen] = React.useState(false);
  const [episodesInputOpen, setEpisodesInputOpen] = React.useState(false);
  const scoreSelectRef = React.useRef<HTMLDivElement>(null);
  const [episodesInputValue, setEpisodesInputValue] = React.useState(
    entry.episodes_watched,
  );

  const router = useRouter();

  const { mutate, isPending } = useUpdateAnimeEpisodes();

  // Handle clicking outside to close the select
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        scoreSelectRef.current &&
        !scoreSelectRef.current.contains(event.target as Node)
      ) {
        setScoreSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScoreClick = () => {
    setScoreSelectOpen((prev) => !prev);
  };

  const handleUpdateEpisodes = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (episodesInputValue === entry.episodes_watched) {
      // console.log("Episode count unchanged, not updating.");
      setEpisodesInputOpen(false); // Still close the input if blurred
      return;
    }

    const value = episodesInputValue;
    if (isNaN(value)) return;
    if (value >= 0 && value <= (entry.total_episodes ?? Infinity)) {
      startTransition(() => {
        mutate(
          { entry, value: episodesInputValue },
          {
            onSuccess: () => {
              router.refresh();
            },
          },
        );
      });
      setEpisodesInputOpen(false);
    }
  };
  const handleIncreaseEpisodes = () => {
    startTransition(() => {
      mutate(
        { entry, value: entry.episodes_watched + 1 },
        {
          onSuccess: () => {
            router.refresh();
          },
        },
      );
    });
  };

  return (
    <Card
      className="anime-card flex h-full flex-col gap-1 rounded-md border-primary/20 py-0 shadow-lg hover:shadow-primary/20"
      // onClick={() => onClick(anime)}
    >
      <CardContent className="card-image-container">
        <Image
          src={entry.imageUrl ?? ""}
          alt={entry.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="card-image object-cover"
        />
        {/* Top Rated Badge - Only visible if score is 9 or higher */}
        {entry.score && entry.score >= 9 && (
          <div className="bg-primary truncate text-primary-foreground absolute top-0 left-1/2 -translate-x-1/2 rounded-xs px-3 text-center text-xs font-bold tracking-wide">
            TOP RATED
          </div>
        )}
        <div className="card-overlay"></div>
      </CardContent>
      <div className="flex h-25 flex-grow flex-col justify-between p-2">
        <Link
          href={`/anime/${entry.mal_id}`}
          className="line-clamp-2 text-sm font-semibold transition-colors hover:text-primary"
        >
          {entry.title}
        </Link>
        <div className="mt-2 flex flex-col md:flex-row gap-y-1 md:items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <span className="">{statusLabels[entry.status]}</span>
            <span>|</span>
            <div ref={scoreSelectRef} className="flex items-center gap-1">
              {scoreSelectOpen ? (
                <select
                  onChange={(e) => {
                    const newScore =
                      e.target.value === "not-scored"
                        ? null
                        : Number(e.target.value);
                    // console.log("New score:", newScore);
                    if (!clerkUserId) {
                      console.warn('User ID is null, cannot update score.');
                      return;
                    }
                    startTransition(() => {
                      updateAnimeListEntryScore({
                        entryId: entry.$id,
                        userId: clerkUserId,
                        score: newScore,
                      }).then(() => {
                        router.refresh();
                      });
                    });
                    setScoreSelectOpen(false);
                  }}
                  defaultValue={entry.score?.toString() ?? "not-scored"}
                  className="text-muted-foreground bg-card hover:bg-accent/10 cursor-pointer rounded border-none text-xs font-normal focus:outline-none"
                >
                  <option value="not-scored" disabled>
                    Score
                  </option>
                  <option value="0">-</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              ) : entry.score ? (
                <span
                  className="flex cursor-pointer items-center gap-1 text-primary hover:text-primary/80"
                  onClick={handleScoreClick}
                >
                  Scored
                  <strong className="text-xs font-bold">{entry.score}</strong>
                </span>
              ) : (
                <span
                  className="text-muted-foreground hover:cursor-pointer hover:text-primary/80"
                  onClick={handleScoreClick}
                >
                  Not Scored
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="text-muted-foreground flex items-center gap-1 text-xs font-normal">
              {episodesInputOpen ? (
                <input
                  type="number"
                  defaultValue={entry.episodes_watched}
                  onBlur={() => {
                    handleUpdateEpisodes();
                    setEpisodesInputOpen(false);
                  }}
                  onChange={(e) => {
                    const value = e.target.valueAsNumber;
                    if (isNaN(value)) return;
                    setEpisodesInputValue(value);
                  }}
                  disabled={isPending}
                  onFocus={(e) => e.target.select()}
                  className="bg-card hover:bg-accent/10 border-nonetext-center w-8 [appearance:textfield] rounded border px-1 text-xs font-normal focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              ) : (
                <span
                  onClick={() => showPlusIcon && setEpisodesInputOpen(true)}
                  className={`${showPlusIcon && "hover:text-primary/80 hover:cursor-pointer"}`}
                >
                  <strong className="text-foreground font-bold">{entry.episodes_watched}</strong> of
                </span>
              )}
              {entry.total_episodes} ep
            </div>
            {showPlusIcon && (
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleIncreaseEpisodes}
                disabled={isPending}
                className="text-muted-foreground size-5 cursor-pointer stroke-2 transition-all"
              >
                <PlusCircle className="size-5 cursor-pointer stroke-2 transition-all" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnimeListCard;
