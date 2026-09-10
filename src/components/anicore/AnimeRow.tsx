'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  title: string;
  kicker?: string;
  description?: string;
  items: Anime[];
  viewAllHref?: string;
}

export function AnimeRow({ title, kicker, description, items, viewAllHref }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items?.length) return null;

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -w * 0.85 : w * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="my-8 md:my-12">
      <div className="flex items-start justify-between gap-4 mb-4 px-1">
        <div className="min-w-0">
          {kicker && <p className="section-kicker">{kicker}</p>}
          <h2 className="font-display text-xl md:text-2xl font-bold text-[var(--ink)] leading-tight">{title}</h2>
          {description && <p className="text-sm text-[var(--ink-soft)] mt-1 max-w-2xl">{description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {viewAllHref && (
            <Link href={viewAllHref} className="font-mono text-[11px] uppercase tracking-wider text-[var(--cobalt)] hover:text-[var(--cobalt-dark)] hidden sm:block">View all →</Link>
          )}
          <div className="flex gap-1">
            <button onClick={() => scroll('left')} aria-label="Scroll left"
              className="w-8 h-8 rounded-lg bg-[var(--paper-strong)] border border-[var(--line)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] flex items-center justify-center text-[var(--ink-soft)]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right"
              className="w-8 h-8 rounded-lg bg-[var(--paper-strong)] border border-[var(--line)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] flex items-center justify-center text-[var(--ink-soft)]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
        style={{ scrollSnapType: 'x mandatory' }}>
        {items.map((a, i) => (
          <div key={`${a.id}-${i}`} className="snap-start shrink-0 w-[150px] md:w-[170px]">
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>
    </section>
  );
}
