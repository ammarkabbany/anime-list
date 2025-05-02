import { type Models } from 'node-appwrite';

export enum AnimeListStatus {
  Watching = 'watching',
  Completed = 'completed',
  OnHold = 'onhold',
  Dropped = 'dropped',
  PlanToWatch = 'plantowatch'
}

export interface AnimeListEntry extends Models.Document {
  userId: string;
  mal_id: string;
  title: string;
  imageUrl: string | null;
  status: AnimeListStatus;
  score: number | null;
  episodes_watched: number;
  total_episodes: number | null;
}