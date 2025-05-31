import { env } from "@/env";
import type { Anime } from "@/types/jikan";

export async function getAnimeById(id: string) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_NEXT_URL}/api/anime/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json() as Anime
    return data
  } catch (error) {
    console.error("Error fetching data:", error);
    return null
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