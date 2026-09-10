import { HeroSpotlight } from '@/components/anicore/HeroSpotlight';
import { IndexStrip } from '@/components/anicore/IndexStrip';
import { TrendingTrack } from '@/components/anicore/TrendingTrack';
import { SpotlightPicks } from '@/components/anicore/SpotlightPicks';
import { MotionFeature } from '@/components/anicore/MotionFeature';
import { FanPulse } from '@/components/anicore/FanPulse';
import { SeasonSection } from '@/components/anicore/SeasonSection';
import { BrowseSection } from '@/components/anicore/BrowseSection';
import { DatasetSection } from '@/components/anicore/DatasetSection';
import { getTrending, getPopular, getTopRated, getNewest, getAiring, getUpcoming, getLatestSeason, getStats, getGenreStats } from '@/lib/anicore/db';

import { listAnime } from '@/lib/anicore/db';

// Server Component — data is fetched on the server, HTML includes it
// No client-side fetch = instant first paint with content
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export default function Home() {
  // All queries run on the server — 22ms total with cache
  const trending = getTrending(8);
  const popular = getPopular(20);
  const topRated = getTopRated(20);
  const newest = getNewest(20);
  const airing = getAiring(10);
  const upcoming = getUpcoming(10);
  const latestSeason = getLatestSeason(12);
  const stats = getStats();
  const genres = getGenreStats();
  // Pre-fetch initial browse items (sorted by score, first page)
  const browseInitial = listAnime({ sort: 'score', page: 1, perPage: 24 });

  const seasonAnime = latestSeason[0];
  const seasonStr = seasonAnime
    ? `${(seasonAnime.season || '').toLowerCase()} ${seasonAnime.season_year || ''}`.trim()
    : 'this season';

  return (
    <>
      <HeroSpotlight items={trending.slice(0, 7)} totalAnime={stats.animeCount} />
      <IndexStrip stats={stats} />
      <TrendingTrack items={trending} />
      <SpotlightPicks items={topRated} />
      <MotionFeature items={topRated} stats={stats} />
      <FanPulse airing={airing} upcoming={upcoming} />
      <SeasonSection season={seasonStr} items={latestSeason} />
      <BrowseSection initialItems={browseInitial.items} total={browseInitial.pageInfo.total} genres={genres} />
      <DatasetSection stats={stats} />
    </>
  );
}
