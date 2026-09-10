'use client';
import Link from 'next/link';
import { Star, Radio, Calendar } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  airing: Anime[];
  upcoming?: Anime[];
}

export function FanPulse({ airing, upcoming }: Props) {
  if (!airing.length && !upcoming?.length) return null;

  return (
    <section id="airing" className="my-8 md:my-12">
      <div className="mb-4">
        <p className="section-kicker">Fan radar / what is moving</p>
        <h2 className="font-display text-xl md:text-2xl font-bold text-[var(--ink)]">Your weekly anime pulse</h2>
        <p className="text-sm text-[var(--ink-soft)] mt-1">Jump straight into shows airing now or scout the next wave before it lands.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* On air now */}
        {airing.length > 0 && (
          <div className="bg-[var(--paper-strong)] border border-[var(--line)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[var(--signal)] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink)] font-semibold">On air now</span>
              </div>
              <small className="font-mono text-[10px] text-[var(--ink-soft)]">{airing.length} live records</small>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {airing.slice(0, 8).map((a, i) => (
                <PulseRow key={a.id} anime={a} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Coming up */}
        {upcoming && upcoming.length > 0 && (
          <div className="bg-[var(--paper-strong)] border border-[var(--line)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--line)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--cobalt)]" />
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink)] font-semibold">Coming up</span>
              </div>
              <small className="font-mono text-[10px] text-[var(--ink-soft)]">{upcoming.length} upcoming</small>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {upcoming.slice(0, 8).map((a, i) => (
                <PulseRow key={a.id} anime={a} rank={i + 1} upcoming />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PulseRow({ anime: a, rank, upcoming }: { anime: Anime; rank: number; upcoming?: boolean }) {
  return (
    <Link href={`/anime/${a.slug}`} className="flex items-center gap-3 p-3 hover:bg-[var(--paper)] transition-colors">
      <span className="font-display font-black text-lg text-[var(--ink-soft)] w-7 text-center">{String(rank).padStart(2, '0')}</span>
      <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-[var(--paper)]">
        {a.poster_url && <img src={a.poster_url} alt="" className="w-full h-full object-cover" loading="lazy" />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-body text-sm font-semibold text-[var(--ink)] truncate">{a.title_english || a.title}</div>
        <div className="font-mono text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">
          {a.format || 'TV'}
          {a.episode_count && ` · ${a.episode_count} eps`}
          {a.season_year && ` · ${a.season_year}`}
          {upcoming && a.status === 'NOT_YET_RELEASED' && ' · upcoming'}
        </div>
      </div>
      {a.score_average && (
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-[var(--ink)]">
          <Star className="w-3 h-3 fill-[var(--yellow)] text-[var(--yellow)]" />
          {(a.score_average).toFixed(0)}
        </div>
      )}
    </Link>
  );
}
