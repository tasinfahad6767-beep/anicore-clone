'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  items: Anime[];
  stats: {
    animeCount: number;
    episodeCount: number;
    characterCount: number;
  };
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// Unique motion feature — floating poster collage instead of the empty "A" placeholder.
// Shows real anime posters from the top-rated list, floating with depth.
export function MotionFeature({ items, stats }: Props) {
  if (!items?.length) return null;

  const posters = items.slice(0, 6).filter(a => a.poster_url);

  const tags = [
    `${stats.animeCount.toLocaleString()} titles`,
    '5 providers',
    `${fmt(stats.episodeCount)} episodes`,
    `${fmt(stats.characterCount)} characters`,
  ];

  return (
    <section className="motion-feature discovery-motion" aria-labelledby="living-catalog-title">
      <div className="motion-feature-copy">
        <p className="section-kicker">Dimensional discovery</p>
        <h2 id="living-catalog-title">Every record has depth.</h2>
        <p>Every poster is more than an image. It opens into episodes, characters, relations, provider records, artwork, trailers, and the community trail around a title — unified across five independent sources.</p>
        <div className="motion-feature-tags" aria-label="Anime record dimensions">
          {tags.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
        <Link href="/library" className="outline-action" style={{ textDecoration: 'none' }}>
          Enter the catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Floating poster collage — replaces the empty "A" placeholder */}
      <div className="motion-stage poster-motion-stage">
        <div className="motion-media" style={{
          position: 'relative',
          background: 'linear-gradient(135deg, var(--ink) 0%, #1a1f3a 50%, var(--cobalt-dark) 100%)',
          overflow: 'hidden',
          minHeight: 470,
        }}>
          {/* Grid background pattern */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.15,
            pointerEvents: 'none',
          }} />

          {/* Floating posters with parallax-like positioning */}
          {posters.map((a, i) => {
            const positions = [
              { top: '8%', left: '5%', rotate: '-6deg', z: 1, scale: 1.0 },
              { top: '15%', left: '35%', rotate: '3deg', z: 3, scale: 1.15 },
              { top: '5%', left: '65%', rotate: '-2deg', z: 2, scale: 0.95 },
              { top: '45%', left: '12%', rotate: '4deg', z: 4, scale: 1.05 },
              { top: '50%', left: '42%', rotate: '-3deg', z: 5, scale: 1.2 },
              { top: '42%', left: '72%', rotate: '5deg', z: 2, scale: 0.9 },
            ];
            const pos = positions[i] || positions[0];
            const title = a.title_english || a.title;
            return (
              <Link key={a.id} href={`/anime/${a.slug}`} style={{
                position: 'absolute',
                top: pos.top, left: pos.left,
                width: '24%',
                minWidth: 80,
                aspectRatio: '2 / 3',
                transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
                zIndex: pos.z,
                borderRadius: 6,
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.1)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                transition: 'all 400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = `rotate(0deg) scale(${parseFloat(pos.scale) + 0.15})`;
                e.currentTarget.style.zIndex = '10';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.borderColor = 'var(--cobalt)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = `rotate(${pos.rotate}) scale(${pos.scale})`;
                e.currentTarget.style.zIndex = String(pos.z);
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.5)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              }}>
                <img src={a.poster_url} alt={title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                }} loading="lazy" />
                {/* Score badge */}
                {a.score_average != null && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    background: 'rgba(10,16,32,0.9)', backdropFilter: 'blur(4px)',
                    borderRadius: 999, padding: '2px 6px',
                    fontFamily: 'var(--utility)', fontSize: 9, fontWeight: 700,
                    color: 'var(--yellow)',
                  }}>★ {Math.round(a.score_average)}</div>
                )}
              </Link>
            );
          })}

          {/* Connecting lines (SVG overlay) */}
          <svg style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none', zIndex: 0,
          }} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="17" y1="25" x2="47" y2="30" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.4" />
            <line x1="47" y1="30" x2="77" y2="22" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.4" />
            <line x1="17" y1="25" x2="24" y2="60" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.3" />
            <line x1="47" y1="30" x2="54" y2="65" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.3" />
            <line x1="77" y1="22" x2="84" y2="57" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.3" />
            <line x1="24" y1="60" x2="54" y2="65" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.4" />
            <line x1="54" y1="65" x2="84" y2="57" stroke="var(--cobalt)" strokeWidth="0.15" strokeDasharray="0.8 0.8" opacity="0.3" />
          </svg>
        </div>

        <div className="motion-stage-label">
          <span>Living catalog</span>
          <strong>Records in relation</strong>
        </div>
      </div>
    </section>
  );
}
