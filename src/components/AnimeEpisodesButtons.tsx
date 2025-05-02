"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

interface AnimeEpisodesButtonsProps {
  watchedEpisodes?: number;
  totalEpisodes: number | null;
  handleChange?: (episodes: number) => Promise<void>;
}

export default function AnimeEpisodesButtons({
  watchedEpisodes = 0,
  totalEpisodes = 0,
  handleChange,
}: AnimeEpisodesButtonsProps) {
  const [currentEpisodes, setCurrentEpisodes] = useState(watchedEpisodes);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleIncrease = () => {
    if (totalEpisodes === null || watchedEpisodes < totalEpisodes) {
      setCurrentEpisodes(watchedEpisodes + 1);
      startTransition(() => {
        if (handleChange) {
          void handleChange(watchedEpisodes + 1);
        }
        router.refresh();
      });
    }
  };

  const handleDecrease = () => {
    if (watchedEpisodes > 0) {
      setCurrentEpisodes(watchedEpisodes - 1);
      startTransition(() => {
        if (handleChange) {
          void handleChange(watchedEpisodes - 1);
        }
        router.refresh();
      });
    }
  };

  return (
    <div className="inline-flex -space-x-px rounded-md border shadow-xs rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant="ghost"
        size="icon"
        disabled={watchedEpisodes <= 0 || isPending}
        onClick={handleDecrease}
      >
        <MinusIcon size={16} aria-hidden="true" />
      </Button>
      <div className="border-input flex items-center border-r border-l px-4 text-sm font-medium">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = currentEpisodes;
            if (value >= 0 && value <= (totalEpisodes ?? Infinity)) {
              startTransition(() => {
                if (handleChange) {
                  void handleChange(value);
                }
                router.refresh();
              });
            }
          }}        
        >
          <input
            min={0}
            max={totalEpisodes ?? Infinity}
            step={1}
            autoComplete="off"
            autoCorrect="off"
            type="number"
            value={currentEpisodes}
            onChange={(e) => setCurrentEpisodes(Number(e.target.value))}
            className="text-muted-foreground !w-8 [appearance:textfield] border-none bg-transparent text-center focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Episodes watched"
          />
        </form>
        <span className="text-muted-foreground mx-1">/</span>
        <span className="text-foreground">{totalEpisodes ?? "?"}</span>
      </div>
      <Button
        className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
        variant="ghost"
        size="icon"
        disabled={
          (totalEpisodes !== null && watchedEpisodes >= totalEpisodes) ||
          isPending
        }
        onClick={handleIncrease}
      >
        <PlusIcon size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}
