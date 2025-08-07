import { decrementAnimeListEntryEpisodes, incrementAnimeListEntryEpisodes } from "@/actions/animelist";
import type { AnimeListEntry } from "@/types/animelist";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

export const useDecrementAnimeEpisodes = () => {
  const { userId: clerkUserId } = useAuth();

  return useMutation({
    mutationKey: ["anime"],
    mutationFn: async ({
      entry,
    }: {
      entry: AnimeListEntry;
    }) => {
      try {
        if (!clerkUserId) {
          throw Error('User not found!')
        }
        return await decrementAnimeListEntryEpisodes({
          entryId: entry.$id,
          userId: clerkUserId,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    },
  });
};
