'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  items: Anime[];
  viewAllHref?: string;
}

export function TrendingTrack({ items, viewAllHref = '/library?sort=trending' }: Props) {
  if (!items?.length) return null;
  return (
    <section className="content-section trending-section" id="discover">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Live signal / real-time</p>
          <h2>Trending across the archive</h2>
        </div>
        <Link href={viewAllHref} className="text-action" style={{ textDecoration: 'none' }}>
          <button type="button" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}>
            View full index <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
      <div className="trending-track">
        {items.map((a, i) => (
          <AnimeCard key={`${a.id}-${i}`} anime={a} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}
