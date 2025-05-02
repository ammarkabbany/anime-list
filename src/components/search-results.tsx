import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { type Anime, type AnimeResponse } from "@/types/jikan";

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Create an abort controller to cancel fetch requests when needed
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Define async function inside useEffect
    const fetchAnime = async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/anime/search?query=${encodeURIComponent(query)}`,
            { signal }
          );
          const searchResults = (await response.json()) as AnimeResponse;
          if (searchResults?.data) {
            setResults(searchResults.data);
          }
        } catch (error) {
          // Only report errors that aren't from aborting
          if (error.name !== 'AbortError') {
            console.error('Search error:', error);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    
    // Add a small delay before searching to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      void fetchAnime();
    }, 300);
    
    // Cleanup function to cancel fetch and clear timeout
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [query]); // Re-run effect when query changes

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="search"
          placeholder="Search movies and anime..."
          value={query}
          onChange={handleInputChange}
          className="w-full"
        />
      </div>
      {(isLoading || results.length > 0) && (
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <p className="text-center">Loading...</p>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.mal_id}
                    className="mb-4 flex items-center space-x-4 last:mb-0"
                    onClick={() => setQuery("")}
                    href={`/anime/${result.mal_id}`}
                  >
                    <Image
                      src={result.images.jpg.image_url}
                      alt={result.title}
                      width={50}
                      height={75}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{result.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {result.year} - {result.episodes} episodes
                      </p>
                      <div className="flex gap-2">
                        <Badge key={result.type}>{result.type}</Badge>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        )}
    </div>
  );
}
