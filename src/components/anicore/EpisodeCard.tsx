'use client';
import Link from 'next/link';
import { Play, Calendar, Clock } from 'lucide-react';
import type { Episode, Anime } from '@/lib/anicore/db';

interface Props {
  episode: Episode;
  anime?: Anime;
}

export function EpisodeCard({ episode: ep, anime }: Props) {
  const slug = anime?.slug || '';
  const epNum = ep.absolute_number || ep.number;

  return (
    <Link href={`/anime/${slug}/watch?ep=${epNum}`}
      className="group flex gap-3 bg-[var(--paper-strong)] border border-[var(--line)] rounded-xl p-3 hover:border-[var(--cobalt)] transition-all">
      <div className="relative w-32 h-20 shrink-0 rounded-lg overflow-hidden bg-[var(--paper)]">
        {ep.thumbnail_url ? (
          <img src={ep.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-xs font-mono">No thumb</div>
        )}
        <div className="absolute inset-0 bg-[var(--ink)]/0 group-hover:bg-[var(--ink)]/40 transition-colors flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-[var(--cobalt)] flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[var(--ink)]/80 backdrop-blur rounded font-mono text-[10px] font-bold text-white">
          EP {ep.number}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--cobalt)] mb-0.5">
          Episode {ep.number}{ep.season_number ? ` · S${ep.season_number}` : ''}
        </div>
        <div className="font-body text-sm font-semibold text-[var(--ink)] line-clamp-1">{ep.title || 'Untitled'}</div>
        {ep.synopsis && (
          <div className="text-xs text-[var(--ink-soft)] mt-1 line-clamp-2 leading-relaxed">{ep.synopsis}</div>
        )}
        <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--ink-soft)] uppercase tracking-wider mt-1.5">
          {ep.air_date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" /> {ep.air_date}
            </span>
          )}
          {ep.runtime_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> {ep.runtime_minutes}m
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
