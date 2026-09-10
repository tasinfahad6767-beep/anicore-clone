'use client';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

export function AnimeGrid({ items }: { items: Anime[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
      {items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)}
    </div>
  );
}

export function AnimeGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] bg-[var(--paper-strong)] rounded-xl animate-pulse border border-[var(--line)]" />
          <div className="h-3 bg-[var(--paper-strong)] rounded mt-2 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
