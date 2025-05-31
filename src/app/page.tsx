import HomePageClientContent from './HomePageClientContent';
import SeasonalAnimeSection from '@/components/SeasonalAnimeSection';
import UpcomingAnimeSection from '@/components/UpcomingAnimeSection';
import { Suspense } from 'react';

export default async function Page() {
  // These are Server Components. Their data fetching executes on the server.
  // Their rendered output (React elements/RSC Payload) is what's passed.
  const seasonalContent = (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading Seasonal Anime...</div>}>
      <SeasonalAnimeSection />
    </Suspense>
  );
  const upcomingContent = (
    <Suspense fallback={<div className="py-8 text-center text-muted-foreground">Loading Upcoming Anime...</div>}>
      <UpcomingAnimeSection />
    </Suspense>
  );

  return (
    <HomePageClientContent
      seasonalContent={seasonalContent}
      upcomingContent={upcomingContent}
    />
  );
}
// Newline at end of file
