'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Shuffle, Compass, Star } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

export function HeroSpotlight({ items }: { items: Anime[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) {
    return <div className="h-[520px] md:h-[620px] bg-[var(--paper-strong)] rounded-3xl animate-pulse" />;
  }

  const a = items[idx];
  const genres: string[] = a.genres || [];

  return (
    <section className="relative h-[520px] md:h-[620px] w-full overflow-hidden rounded-3xl group"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* Background art */}
      {a.banner_url && (
        <img src={a.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700" key={a.id} />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--paper) 0%, rgba(244,246,251,0.4) 40%, transparent 70%), linear-gradient(to right, var(--paper) 0%, transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--paper) 0%, rgba(9,13,23,0.4) 40%, transparent 70%), linear-gradient(to right, var(--paper) 0%, transparent 60%)' }} data-theme-dark />

      {/* Top right counter */}
      <div className="absolute top-5 right-5 text-right text-white drop-shadow">
        <div className="font-mono text-[10px] uppercase tracking-wider opacity-80">This week</div>
        <div className="font-display text-3xl font-black leading-none">{String(idx + 1).padStart(2, '0')}</div>
        <div className="font-mono text-[10px] uppercase tracking-wider opacity-60">of {String(items.length).padStart(2, '0')}</div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--cobalt)] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] animate-pulse" />
            Trending spotlight
            {a.status === 'RELEASING' && <span className="px-2 py-0.5 bg-[var(--signal)] text-[var(--on-signal)] rounded-full text-[10px] font-bold">AIRING</span>}
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-black text-[var(--ink)] leading-[1.05] mb-2">
            {a.title_english || a.title}
          </h1>
          {a.title_native && a.title_native !== a.title_english && (
            <p className="font-body text-[var(--ink-soft)] text-base md:text-lg mb-4">{a.title_native}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-5 text-sm text-[var(--ink-soft)]">
            {a.score_average && (
              <span className="inline-flex items-center gap-1 font-mono font-bold text-[var(--ink)]">
                <Star className="w-3.5 h-3.5 fill-[var(--yellow)] text-[var(--yellow)]" /> {(a.score_average).toFixed(0)}
                <span className="text-[var(--ink-soft)] font-normal">/100</span>
              </span>
            )}
            {a.format && <span className="font-mono uppercase tracking-wider text-xs">{a.format}</span>}
            {a.season_year && <span className="font-mono uppercase tracking-wider text-xs">{a.season} {a.season_year}</span>}
            {a.episode_count && <span className="font-mono uppercase tracking-wider text-xs">{a.episode_count} eps</span>}
            {a.duration_minutes && <span className="font-mono uppercase tracking-wider text-xs">{a.duration_minutes}m</span>}
          </div>

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {genres.slice(0, 5).map(g => (
                <span key={g} className="px-2.5 py-1 bg-[var(--paper-strong)]/90 backdrop-blur border border-[var(--line)] rounded-full text-[11px] font-mono uppercase tracking-wide text-[var(--ink-soft)]">{g}</span>
              ))}
            </div>
          )}

          {a.synopsis && (
            <p className="text-[var(--ink-soft)] text-sm md:text-base mb-6 line-clamp-2 max-w-2xl">{a.synopsis}</p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/anime/${a.slug}`} className="btn-primary">
              <Compass className="w-4 h-4" /> Explore
            </Link>
            <Link href={`/anime/${a.slug}/watch`} className="btn-signal">
              <Play className="w-4 h-4 fill-[var(--on-signal)]" /> Watch
            </Link>
            <Link href="/random" className="btn-outline">
              <Shuffle className="w-4 h-4" /> Pick for me
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--paper-strong)]/80 backdrop-blur border border-[var(--line)] hover:border-[var(--cobalt)] flex items-center justify-center text-[var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setIdx(i => (i + 1) % items.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--paper-strong)]/80 backdrop-blur border border-[var(--line)] hover:border-[var(--cobalt)] flex items-center justify-center text-[var(--ink)] opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 right-6 flex gap-1.5">
        {items.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-8 bg-[var(--cobalt)]' : 'w-1.5 bg-[var(--ink)]/30 hover:bg-[var(--ink)]/60'}`} />
        ))}
      </div>
    </section>
  );
}
