import { useState, useEffect, type ChangeEventHandler } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
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
          if (error instanceof Error && error.name !== 'AbortError') {
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-2"> {/* Reduced space-y for tighter layout if card has margin */}
      <div className="relative flex items-center">
        <Input
          type="search"
          placeholder="Search anime..."
          value={query}
          onChange={handleInputChange}
          className="w-full rounded-full shadow-md pr-10 focus:ring-2 focus:ring-primary/50"
        />
        <Button
          type="button" // Or "submit" if we want form submission, but current logic is onChange
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          aria-label="Search" // For accessibility
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
      {(isLoading || results.length > 0) && (
          <Card className="rounded-xl shadow-xl border border-primary/20 transition-all duration-300 ease-in-out mt-2">
            <CardContent className="p-4 space-y-3">
              {isLoading ? (
                <p className="text-center text-primary font-semibold animate-pulse">Loading...</p>
              ) : (
                results.map((result) => (
                  <Link
                    key={result.mal_id}
                    className="group flex items-center space-x-4 p-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-purple-500/10 transition-all duration-200" // Updated hover and transition
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
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary">{result.title}</h3>
                      <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                        {result.year}{result.episodes ? ` - ${result.episodes} episodes` : ""}
                      </p>
                      <div className="mt-1 flex gap-2">
                        {result.type && <Badge key={result.type} variant="secondary" className="bg-secondary text-secondary-foreground group-hover:bg-primary/20 group-hover:text-primary">{result.type}</Badge>}
                        {result.status && <Badge key={result.status} variant="outline" className="group-hover:border-primary/50 group-hover:text-primary/80">{result.status}</Badge>}
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
