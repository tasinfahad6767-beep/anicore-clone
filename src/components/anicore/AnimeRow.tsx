'use client';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

export function AnimeRow({ title, items, viewAllHref }: { title: string; items: Anime[]; viewAllHref?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items?.length) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -w * 0.8 : w * 0.8, behavior: 'smooth' });
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
          <span className="text-xs text-zinc-500">{items.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link href={viewAllHref} className="text-xs text-rose-400 hover:text-rose-300 hidden sm:block">View all →</Link>
          )}
          <div className="flex gap-1">
            <button onClick={() => scroll('left')}
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')}
              className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x"
        style={{ scrollbarWidth: 'thin' }}>
        {items.map(a => (
          <div key={a.id} className="snap-start shrink-0 w-[140px] md:w-[160px]">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </section>
  );
}
