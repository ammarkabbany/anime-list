import { env } from "@/env";
import { createAdminClient } from "@/lib/appwrite";
import { AnimeListStatus, type AnimeListEntry } from "@/types/animelist";
import { NextResponse, type NextRequest } from "next/server";
import { ID } from "node-appwrite";

interface CreateAnimeListEntryRequest {
  userId: string;
  animeId: string;
  title: string;
  imageUrl: string;
  totalEpisodes: number | null;
}

export async function POST(req: NextRequest) {
  const { userId, animeId, title, imageUrl, totalEpisodes } = await req.json() as CreateAnimeListEntryRequest;
  if (!userId || !animeId || !title || !imageUrl) {
    return NextResponse.json("Missing required fields", { status: 400 });
  }
  const { databases } = await createAdminClient();
  try {
    const response = await databases.createDocument<AnimeListEntry>(
      env.NEXT_PUBLIC_DATABASE_ID,
      env.NEXT_PUBLIC_ANIMELIST_COLLECTION_ID,
      ID.unique(),
      {
        mal_id: animeId,
        userId,
        status: AnimeListStatus.PlanToWatch,
        title,
        imageUrl,
        totalEpisodes,
      },
    );
    return NextResponse.json({
      id: response.$id,
      mal_id: response.mal_id,
      userId: response.userId,
      status: response.status,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating anime list entry:", error);
    return NextResponse.json("Error creating anime list entry", { status: 500 });
  }
}