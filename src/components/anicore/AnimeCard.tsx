'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, Heart, Play } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  anime: Anime;
  showScore?: boolean;
}

function isInList(id: number): boolean {
  try { return JSON.parse(localStorage.getItem('anicore-list') || '[]').includes(id); } catch { return false; }
}

function toggleList(id: number): boolean {
  try {
    const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
    const idx = list.indexOf(id);
    let added: boolean;
    if (idx >= 0) { list.splice(idx, 1); added = false; }
    else { list.push(id); added = true; }
    localStorage.setItem('anicore-list', JSON.stringify(list));
    window.dispatchEvent(new Event('anicore-list-changed'));
    return added;
  } catch { return false; }
}

export function AnimeCard({ anime, showScore = true }: Props) {
  const [inList, setInList] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const title = anime.title_english || anime.title;

  useEffect(() => { setInList(isInList(anime.id)); }, [anime.id]);

  const handleList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInList(toggleList(anime.id));
  };

  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--paper-strong)] border border-[var(--line)] group-hover:border-[var(--cobalt)] transition-all duration-300">
        {anime.poster_url ? (
          <img
            src={anime.poster_url}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-xs p-2 text-center font-mono">{title}</div>
        )}

        {/* Score pill top-left */}
        {showScore && anime.score_average && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--paper-strong)]/95 backdrop-blur text-[10px] font-mono font-bold text-[var(--ink)]">
            <Star className="w-2.5 h-2.5 fill-[var(--yellow)] text-[var(--yellow)]" />
            {(anime.score_average).toFixed(0)}
          </div>
        )}

        {/* Airing badge top-right */}
        {anime.status === 'RELEASING' && (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--signal)] shadow-[0_0_8px_var(--signal)] animate-pulse" />
        )}

        {/* My List button */}
        <button
          onClick={handleList}
          aria-label={`Add ${title} to My List`}
          className={`absolute bottom-2 right-2 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all ${
            inList
              ? 'bg-[var(--signal)] text-[var(--on-signal)] opacity-100'
              : 'bg-[var(--paper-strong)]/85 text-[var(--ink)] opacity-0 group-hover:opacity-100 hover:bg-[var(--signal)] hover:text-[var(--on-signal)]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${inList ? 'fill-current' : ''}`} />
        </button>

        {/* Play overlay on hover */}
        <div className="absolute inset-0 bg-[var(--ink)]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-[var(--cobalt)] flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <div className="font-body text-xs font-semibold truncate text-[var(--ink)] group-hover:text-[var(--cobalt)] transition-colors">
          {title}
        </div>
        <div className="font-mono text-[10px] text-[var(--ink-soft)] uppercase tracking-wider mt-0.5 truncate">
          {anime.season_year || '—'} · {anime.format || 'TV'} · {anime.episode_count || '?'} eps
        </div>
      </div>
    </Link>
  );
}
