'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, Play, Calendar, Tv, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

export function HeroCarousel({ items }: { items: Anime[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) {
    return <div className="h-[460px] md:h-[520px] bg-zinc-900 rounded-xl animate-pulse" />;
  }

  const a = items[idx];
  const genres: string[] = a.genres || [];

  return (
    <div
      className="relative h-[460px] md:h-[520px] w-full overflow-hidden rounded-xl group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background */}
      {a.banner_url && (
        <img src={a.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" key={a.id} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-rose-400 tracking-widest uppercase">#{idx + 1} Trending</span>
            {a.status === 'RELEASING' && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">AIRING NOW</span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">
            {a.title_english || a.title}
          </h1>
          {a.title_native && a.title_native !== a.title_english && (
            <p className="text-zinc-400 text-sm md:text-base mb-3">{a.title_native}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
            {a.score_average && (
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> {a.score_average.toFixed(2)}
              </span>
            )}
            {a.format && <span className="flex items-center gap-1 text-zinc-300"><Tv className="w-4 h-4" /> {a.format}</span>}
            {a.season_year && <span className="flex items-center gap-1 text-zinc-300"><Calendar className="w-4 h-4" /> {a.season} {a.season_year}</span>}
            {a.duration_minutes && <span className="flex items-center gap-1 text-zinc-300"><Clock className="w-4 h-4" /> {a.duration_minutes}m</span>}
            {a.episode_count && <span className="text-zinc-300">{a.episode_count} eps</span>}
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {genres.slice(0, 4).map(g => (
                <span key={g} className="px-2.5 py-1 bg-zinc-900/80 backdrop-blur border border-zinc-700/50 rounded text-xs text-zinc-300">{g}</span>
              ))}
            </div>
          )}

          {a.synopsis && (
            <p className="text-zinc-400 text-sm md:text-base mb-5 line-clamp-2 max-w-2xl">{a.synopsis}</p>
          )}

          <div className="flex items-center gap-3">
            <Link href={`/anime/${a.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium text-sm transition-colors">
              <Play className="w-4 h-4 fill-white" /> View Details
            </Link>
            <Link href={`/anime/${a.slug}/watch`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800/80 backdrop-blur hover:bg-zinc-700 text-white rounded-lg font-medium text-sm transition-colors">
              Watch Now
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setIdx(i => (i + 1) % items.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur hover:bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-6 flex gap-1.5">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-rose-500' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'}`} />
        ))}
      </div>
    </div>
  );
}
