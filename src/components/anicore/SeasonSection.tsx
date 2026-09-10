'use client';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  season: string; // e.g. "Summer 2026"
  items: Anime[];
}

export function SeasonSection({ season, items }: Props) {
  if (!items?.length) return null;

  return (
    <section id="season" className="my-12 md:my-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <p className="section-kicker">{season}</p>
          <h2 className="font-display text-3xl md:text-5xl font-black text-[var(--ink)] leading-tight">
            The season,<br />
            <em className="not-italic font-display italic" style={{ fontFamily: 'var(--display), serif', fontStyle: 'italic', color: 'var(--cobalt)' }}>decoded.</em>
          </h2>
          <p className="text-[var(--ink-soft)] text-sm md:text-base mt-3 max-w-xl">
            The loud premieres, the quiet surprises, and everything still airing — ranked through signals from across the community.
          </p>
        </div>
        <Link href={`/library?year=${items[0]?.season_year || ''}`} className="btn-outline shrink-0">
          Explore the season <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
        {items.slice(0, 12).map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)}
      </div>
    </section>
  );
}
