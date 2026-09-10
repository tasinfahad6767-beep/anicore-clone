'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { FanPulse } from '@/components/anicore/FanPulse';
import { SeasonSection } from '@/components/anicore/SeasonSection';
import type { Anime } from '@/lib/anicore/db';

export default function SeasonPage() {
  const [data, setData] = useState<{
    season: string; year: number;
    items: Anime[]; airing: Anime[]; upcoming: Anime[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/season').then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !data) return (
    <div className="inner-page">
      <div className="skeleton" style={{ height: 500, margin: 40 }} />
    </div>
  );

  return (
    <>
      <SeasonSection season={data.season} items={data.items} />
      <FanPulse airing={data.airing} upcoming={data.upcoming} />
    </>
  );
}
