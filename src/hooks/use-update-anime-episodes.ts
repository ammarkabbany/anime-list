import { updateAnimeListEntryEpisodes } from "@/actions/animelist";
import type { AnimeListEntry } from "@/types/animelist";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";

export const useUpdateAnimeEpisodes = () => {
  const { userId: clerkUserId } = useAuth();

  return useMutation({
    mutationKey: ["anime"],
    mutationFn: async ({
      entry,
      value,
    }: {
      entry: AnimeListEntry;
      value: number;
    }) => {
      try {
        if (!clerkUserId) {
          return null;
        }
        await updateAnimeListEntryEpisodes({
          entryId: entry.$id,
          userId: clerkUserId,
          episodes: value,
          totalEpisodes: entry.total_episodes,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        return null;
      }
    },
  });
};
