'use client';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  anime: Anime;
  showScore?: boolean;
  compact?: boolean;
}

export function AnimeCard({ anime, showScore = true }: Props) {
  const title = anime.title_english || anime.title;
  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-rose-500/50 transition-all duration-300">
        {anime.poster_url ? (
          <img
            src={anime.poster_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs p-2 text-center">{title}</div>
        )}

        {/* Top badges */}
        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-start justify-between">
          {showScore && anime.score_average ? (
            <span className="bg-black/80 backdrop-blur px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400" /> {anime.score_average.toFixed(1)}
            </span>
          ) : <span />}
          {anime.status === 'RELEASING' && (
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <div className="text-xs font-semibold text-white line-clamp-2 leading-tight">{title}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">{anime.season_year || '?'} · {anime.format || 'TV'}</div>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <div className="text-xs font-medium truncate text-zinc-200 group-hover:text-rose-400 transition-colors">{title}</div>
        <div className="text-[10px] text-zinc-500 truncate">
          {anime.season_year || '?'} · {anime.format || 'TV'} · {anime.episode_count || anime.episodes_known || '?'} eps
        </div>
      </div>
    </Link>
  );
}
