'use client';
import { useEffect, useState } from 'react';
import { BrowseSection } from '@/components/anicore/BrowseSection';
import type { Anime } from '@/lib/anicore/db';

interface GenreCount { genre: string; count: number; }
interface Stats { animeCount: number; episodeCount: number; characterCount: number; releasingCount: number; }

export default function LibraryPage() {
  const [genres, setGenres] = useState<GenreCount[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      setGenres(d.genres || []);
      setStats(d.stats);
    });
  }, []);

  return (
    <BrowseSection
      total={stats?.animeCount || 0}
      genres={genres}
    />
  );
}
