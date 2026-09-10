'use client';
import Link from 'next/link';
import { Play, Calendar } from 'lucide-react';
import type { Episode, Anime } from '@/lib/anicore/db';

interface Props {
  episode: Episode;
  anime?: Anime;
  index?: number;
}

export function EpisodeCard({ episode: ep, anime, index }: Props) {
  const slug = anime?.slug || '';
  const epNum = ep.absolute_number || ep.number;

  return (
    <Link
      href={`/anime/${slug}/watch?ep=${epNum}`}
      className="group flex gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 hover:border-rose-500/40 hover:bg-zinc-900 transition-all"
    >
      <div className="relative w-32 h-20 shrink-0 rounded overflow-hidden bg-zinc-800">
        {ep.thumbnail_url ? (
          <img src={ep.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No thumb</div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 backdrop-blur rounded text-[10px] font-bold text-white">
          EP {ep.number}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-zinc-500 mb-0.5">
          Episode {ep.number}{ep.season_number ? ` · S${ep.season_number}` : ''}
        </div>
        <div className="text-sm font-medium text-white line-clamp-1">{ep.title || 'Untitled'}</div>
        {ep.synopsis && (
          <div className="text-xs text-zinc-500 mt-1 line-clamp-2">{ep.synopsis}</div>
        )}
        {ep.air_date && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-600 mt-1.5">
            <Calendar className="w-2.5 h-2.5" /> {ep.air_date}
            {ep.runtime_minutes && <span> · {ep.runtime_minutes}m</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
