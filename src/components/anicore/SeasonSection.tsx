'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  season: string; // e.g. "summer 2026"
  items: Anime[];
}

export function SeasonSection({ season, items }: Props) {
  if (!items?.length) return null;
  const year = items[0]?.season_year || new Date().getFullYear();

  return (
    <section className="season-section" id="season">
      <div className="season-intro">
        <p className="section-kicker">{season}</p>
        <h2>
          The season,<br />
          <em>decoded.</em>
        </h2>
        <p>The loud premieres, the quiet surprises, and everything still airing — ranked through signals from across the community.</p>
        <Link href={`/library?year=${year}`} className="outline-action" style={{ textDecoration: 'none' }}>
          Explore the season <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="season-grid">
        {items.slice(0, 6).map((a, i) => (
          <AnimeCard key={`${a.id}-${i}`} anime={a} wide />
        ))}
      </div>
    </section>
  );
}
