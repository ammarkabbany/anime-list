"use server";
import { env } from "@/env";
import { createAdminClient } from "@/lib/appwrite";
import { AnimeListStatus, type AnimeListEntry } from "@/types/animelist";
import { ID, Query } from "node-appwrite";

export interface AnimeListEntryResponse {
  id: string;
  mal_id: string;
  userId: string;
  status: AnimeListStatus;
  score: number | null;
  title: string;
  imageUrl: string | null;
  total_episodes: number | null;
  episodes_watched: number | null;
}

export async function getAnimeListEntries({
  userId,
}: {
  userId: string | undefined;
}) {
  if (!userId) {
    return null;
  }
  const { databases } = await createAdminClient();
  try {
    const response = await databases.listDocuments<AnimeListEntry>(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      [Query.equal("userId", userId), Query.limit(99999)],
    );
    return response;
  } catch (error) {
    console.error("Error fetching anime list entries:", error);
    return { documents: [], total: 0 };
  }
}

export async function getAnimeListEntry({
  animeId,
  userId,
}: {
  animeId: string;
  userId: string | undefined;
}) {
  if (!userId) {
    return null;
  }
  const { databases } = await createAdminClient();
  try {
    const response = await databases.listDocuments<AnimeListEntry>(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      [
        Query.equal("mal_id", animeId),
        Query.equal("userId", userId),
      ],
    );
    const animeListEntry = response.documents[0];
    if (!animeListEntry) {
      return null;
    }
    return {
      id: animeListEntry.$id,
      mal_id: animeListEntry.mal_id,
      userId: animeListEntry.userId,
      status: animeListEntry.status,
      score: animeListEntry.score,
      title: animeListEntry.title,
      imageUrl: animeListEntry.imageUrl,
      total_episodes: animeListEntry.total_episodes,
      episodes_watched: animeListEntry.episodes_watched,
    };
  } catch (error) {
    console.error("Error fetching anime list entry:", error);
    return null;
  }
}

export async function updateAnimeListEntryStatus({
  entry,
  userId,
  status,
}: {
  entry: AnimeListEntryResponse;
  userId: string | undefined;
  status: AnimeListStatus;
}) {
  if (!userId) {
    return null;
  }
  const { databases } = await createAdminClient();
  try {
    const response = await databases.updateDocument<AnimeListEntry>(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      entry.id,
      {
        status,
        episodes_watched: status === AnimeListStatus.Completed ? entry.total_episodes || 0 : entry.episodes_watched || 0,
      },
    );
    return {
      id: response.$id,
      mal_id: response.mal_id,
      userId: response.userId,
      status: response.status,
    };
  } catch (error) {
    console.error("Error updating anime list entry:", error);
    return null;
  }
}

export async function updateAnimeListEntryScore({
  entryId,
  userId,
  score,
}: {
  entryId: string;
  userId: string | undefined;
  score: number | null;
}) {
  if (!userId) {
    return null;
  }
  const { databases } = await createAdminClient();
  try {
    const response = await databases.updateDocument<AnimeListEntry>(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      entryId,
      { score },
    );
    return {
      id: response.$id,
      mal_id: response.mal_id,
      userId: response.userId,
      status: response.status,
      score: response.score,
    };
  } catch (error) {
    console.error("Error updating anime list entry score:", error);
    return null;
  }
}

export async function updateAnimeListEntryEpisodes({
  entryId,
  userId,
  episodes,
  totalEpisodes
}: {
  entryId: string;
  userId: string | undefined;
  episodes: number;
  totalEpisodes: number | null;
}) {
  if (!userId) {
    return null;
  }
  const { databases } = await createAdminClient();
  try {
    if (totalEpisodes !== null && episodes >= totalEpisodes) {
      // If the user has watched more episodes than the total, set status to Completed
      const response = await databases.updateDocument<AnimeListEntry>(
        env.NEXT_PUBLIC_DATABASE_ID,
        env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
        entryId,
        { episodes_watched: episodes, status: AnimeListStatus.Completed },
      );
      return {
        id: response.$id,
        mal_id: response.mal_id,
        userId: response.userId,
        status: response.status,
        episodes_watched: response.episodes_watched,
      };
    }
    const response = await databases.updateDocument<AnimeListEntry>(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      entryId,
      { 'episodes_watched': episodes }
    )
    return {
      id: response.$id,
      mal_id: response.mal_id,
      userId: response.userId,
      status: response.status,
      episodes_watched: response.episodes_watched,
    };
  } catch (error) {
    console.error("Error updating anime list entry:", error);
    return null;
  }
}

export async function incrementAnimeListEntryEpisodes({
  entryId,
  userId,
  totalEpisodes
}: {
  entryId: string;
  userId: string | undefined;
  totalEpisodes: number | null;
}) {
  if (!userId) {
    throw Error('User not found!')

  }
  const { databases } = await createAdminClient();
  const response = await databases.incrementDocumentAttribute<AnimeListEntry>(
    env.NEXT_PUBLIC_DATABASE_ID,
    env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
    entryId,
    'episodes_watched',
    1,
    totalEpisodes ?? 9999
  )
  return {
    id: response.$id,
    mal_id: response.mal_id,
    userId: response.userId,
    status: response.status,
    episodes_watched: response.episodes_watched,
  };
}


export async function decrementAnimeListEntryEpisodes({
  entryId,
  userId,
}: {
  entryId: string;
  userId: string | undefined;
}) {
  if (!userId) {
    throw Error('User not found!')
  }
  const { databases } = await createAdminClient();
  const response = await databases.decrementDocumentAttribute<AnimeListEntry>(
    env.NEXT_PUBLIC_DATABASE_ID,
    env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
    entryId,
    'episodes_watched',
    1,
    0
  )
  return {
    id: response.$id,
    mal_id: response.mal_id,
    userId: response.userId,
    status: response.status,
    episodes_watched: response.episodes_watched,
  };
}

export async function createAnimeListEntry({
  animeId,
  title,
  imageUrl,
  totalEpisodes,
  userId,
}: {
  animeId: string;
  title: string;
  imageUrl: string | null;
  totalEpisodes: number | null;
  userId: string | undefined;
}) {
  if (!userId) {
    return null;
  }
  const { databases } = await createAdminClient();
  try {
    const response = await databases.createDocument(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      ID.unique(),
      {
        mal_id: animeId,
        userId,
        status: AnimeListStatus.PlanToWatch,
        score: null,
        title,
        imageUrl,
        total_episodes: totalEpisodes,
      },
    );
    return {
      id: response.$id,
      mal_id: response.mal_id,
      userId: response.userId,
      status: response.status,
    };
  } catch (error) {
    console.error("Error creating anime list entry:", error);
    return null;
  }
}
