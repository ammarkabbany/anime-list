export interface AnimeResponse {
  data: Anime[];
  pagination: Pagination;
}

export interface Anime {
  mal_id: number;
  url: string;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
  duration: string;
  rating: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  background: string | null;
  season: string | null;
  year: number | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string | null;
    url: string | null;
    embed_url: string | null;
  };
  relations: AnimeRelation[];
  studios: { mal_id: number; type: string; name: string }[];
  genres: { mal_id: number; type: string; name: string }[];
}

export interface AnimeRelation {
  relation: string;
  entry: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
    // images: [
    //   {
    //     jpg: {
    //       image_url: string;
    //       small_image_url: string;
    //       large_image_url: string;
    //     };
    //     webp: {
    //       image_url: string;
    //       small_image_url: string;
    //       large_image_url: string;
    //     };
    //   }
    // ];
  }[];
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}