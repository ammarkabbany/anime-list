import { getAnimeListEntries } from '@/actions/animelist';
import React from 'react';
import AnimeListCard from '@/components/AnimeListCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeListStatus } from '@/types/animelist';

interface AnimeListPageProps {
  params: Promise<{ userId: string }>;
}

const AnimeListPage = async ({params}: AnimeListPageProps) => {
  const {userId} = await params;
  const animeListEntries = await getAnimeListEntries({userId});

  // Group entries by status
  const entriesByStatus = animeListEntries?.reduce((acc, entry) => {
    const status = entry.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(entry);
    return acc;
  }, {} as Record<AnimeListStatus, typeof animeListEntries>);

  // Add special "all" category
  const allEntries = "all";

  // Define the status priority for sorting (from Completed to Plan to Watch)
  const statusPriority = {
    [AnimeListStatus.Watching]: 1,
    [AnimeListStatus.Completed]: 2,
    [AnimeListStatus.OnHold]: 3,
    [AnimeListStatus.Dropped]: 4,
    [AnimeListStatus.PlanToWatch]: 5,
  };

  // Sort function for all entries
  const sortedAllEntries = [...(animeListEntries ?? [])].sort((a, b) => 
    statusPriority[a.status] - statusPriority[b.status]
  );

  const statusTabs = [
    { value: allEntries, label: "All" },
    { value: AnimeListStatus.Watching, label: "Watching" },
    { value: AnimeListStatus.Completed, label: "Completed" },
    // { value: AnimeListStatus.OnHold, label: "On Hold" },
    // { value: AnimeListStatus.Dropped, label: "Dropped" },
    { value: AnimeListStatus.PlanToWatch, label: "Plan to Watch" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Anime List</h1>

      {animeListEntries?.length ? (
        <Tabs defaultValue={allEntries}>
          <TabsList className="mb-6">
            {statusTabs.map(tab => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                disabled={tab.value === allEntries 
                  ? !animeListEntries.length 
                  : !entriesByStatus?.[tab.value as AnimeListStatus]?.length}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Special All tab */}
          <TabsContent key={allEntries} value={allEntries}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {sortedAllEntries.map(entry => (
                <AnimeListCard key={entry.$id} entry={entry} userId={userId} />
              ))}
            </div>
          </TabsContent>

          {/* Status-specific tabs */}
          {statusTabs.filter(tab => tab.value !== allEntries).map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entriesByStatus?.[tab.value as AnimeListStatus]?.map(entry => (
                  <AnimeListCard key={entry.$id} entry={entry} userId={userId} />
                ))}
              </div>
              {!entriesByStatus?.[tab.value as AnimeListStatus]?.length && (
                <p className="text-center text-muted-foreground py-10">
                  No anime in this category yet
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl mb-4">Your anime list is empty</p>
          <p className="text-muted-foreground">
            Browse anime and add them to your list to keep track of your watching progress
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimeListPage;