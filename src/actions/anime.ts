import { env } from "@/env";
import type { Anime } from "@/types/jikan";

export async function getAnimeById(id: string) {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_JIKAN_API_URL}/anime/${id}/full`,
    );
    if (response.ok) {
      const data = await response.json();
      return data.data as Anime;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function getSeasonalAnime(season: string = 'now'): Promise<Anime[]> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/seasons/${season}`);
    if (!response.ok) {
      throw new Error(`Jikan API Error: ${response.status} ${response.statusText}`);
    }
    const responseData = await response.json() as { data: Anime[] }; // Assuming Jikan's seasonal response structure
    return responseData.data || [];
  } catch (error) {
    console.error("Error fetching seasonal anime:", error);
    return [];
  }
}