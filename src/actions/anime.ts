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