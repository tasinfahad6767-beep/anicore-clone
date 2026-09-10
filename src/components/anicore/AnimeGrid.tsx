'use client';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

export function AnimeGrid({ items }: { items: Anime[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
      {items.map(a => <AnimeCard key={a.id} anime={a} />)}
    </div>
  );
}

export function AnimeGridSkeleton({ count = 18 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] bg-zinc-900 rounded-lg animate-pulse" />
          <div className="h-3 bg-zinc-900 rounded mt-2 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
