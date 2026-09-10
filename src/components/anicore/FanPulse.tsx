'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  airing: Anime[];
  upcoming?: Anime[];
}

export function FanPulse({ airing, upcoming }: Props) {
  if (!airing.length && !upcoming?.length) return null;

  return (
    <section className="fan-pulse-section" id="airing">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Fan radar / what is moving</p>
          <h2>Your weekly anime pulse</h2>
        </div>
        <p>Jump straight into shows airing now or scout the next wave before it lands.</p>
      </div>
      <div className="pulse-columns">
        {airing.length > 0 && (
          <div className="pulse-column">
            <div className="pulse-column-head">
              <span><i></i> On air now</span>
              <small>{airing.length} live records</small>
            </div>
            {airing.slice(0, 8).map((a, i) => (
              <PulseRow key={`air-${a.id}`} anime={a} rank={i + 1} />
            ))}
          </div>
        )}
        {upcoming && upcoming.length > 0 && (
          <div className="pulse-column upcoming-column">
            <div className="pulse-column-head">
              <span>Up next</span>
              <small>release watch</small>
            </div>
            {upcoming.slice(0, 8).map((a, i) => (
              <PulseRow key={`upc-${a.id}`} anime={a} rank={i + 1} upcoming />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PulseRow({ anime: a, rank, upcoming }: { anime: Anime; rank: number; upcoming?: boolean }) {
  return (
    <Link href={`/anime/${a.slug}`} className="pulse-row" style={{ textDecoration: 'none' }}>
      <span className="pulse-rank">{String(rank).padStart(2, '0')}</span>
      {a.poster_url ? (
        <img src={a.poster_url} alt="" loading="lazy" />
      ) : (
        <div className="pulse-thumb-fallback">?</div>
      )}
      <div>
        <strong>{a.title_english || a.title}</strong>
        <span>
          {a.format || 'TV'} · {upcoming ? (a.season_year || 'TBA') : (a.status === 'RELEASING' ? 'Airing' : (a.episode_count ? `${a.episode_count} eps` : '—'))}
        </span>
      </div>
      {upcoming ? (
        a.score_average != null ? <span className="quality-pill">Q{Math.round(a.score_average)}</span> : null
      ) : (
        a.score_average != null && (
          <span className="score"><strong>{Math.round(a.score_average)}</strong><small>/100</small></span>
        )
      )}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}
