'use client';
import { useEffect, useState } from 'react';
import { HeroSpotlight } from '@/components/anicore/HeroSpotlight';
import { IndexStrip } from '@/components/anicore/IndexStrip';
import { TrendingTrack } from '@/components/anicore/TrendingTrack';
import { MotionFeature } from '@/components/anicore/MotionFeature';
import { FanPulse } from '@/components/anicore/FanPulse';
import { SeasonSection } from '@/components/anicore/SeasonSection';
import { BrowseSection } from '@/components/anicore/BrowseSection';
import { DatasetSection } from '@/components/anicore/DatasetSection';
import type { Anime } from '@/lib/anicore/db';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}
interface GenreCount { genre: string; count: number; }

interface HomeData {
  trending: Anime[];
  popular: Anime[];
  topRated: Anime[];
  newest: Anime[];
  airing: Anime[];
  upcoming: Anime[];
  latestSeason: Anime[];
  stats: Stats;
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [genres, setGenres] = useState<GenreCount[]>([]);

  useEffect(() => {
    fetch('/api/home').then(r => r.json()).then(d => setData(d)).catch(() => {});
    fetch('/api/stats').then(r => r.json()).then(d => setGenres(d.genres || [])).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div style={{ height: '710px', background: 'var(--paper-strong)' }} className="skeleton" />
    );
  }

  const { stats, trending, airing, upcoming, latestSeason } = data;
  const seasonAnime = latestSeason[0];
  const seasonStr = seasonAnime
    ? `${(seasonAnime.season || '').toLowerCase()} ${seasonAnime.season_year || ''}`.trim()
    : 'this season';

  return (
    <>
      <HeroSpotlight items={trending.slice(0, 7)} totalAnime={stats.animeCount} />
      <IndexStrip stats={stats} />
      <TrendingTrack items={trending} />
      <MotionFeature stats={stats} />
      <FanPulse airing={airing} upcoming={upcoming} />
      <SeasonSection season={seasonStr} items={latestSeason} />
      <BrowseSection total={stats.animeCount} genres={genres} />
      <DatasetSection stats={stats} />
    </>
  );
}
