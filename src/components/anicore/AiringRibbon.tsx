'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Anime } from '@/lib/anicore/db';

export function AiringRibbon({ items }: { items: Anime[] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!items?.length) return null;

  // Generate pseudo air-times for each airing anime (every 7 days from a base)
  const itemsWithTimes = items.slice(0, 12).map((a, i) => {
    const base = new Date();
    base.setHours(20, 0, 0, 0); // air at 8pm
    base.setDate(base.getDate() + i);
    const airTs = base.getTime();
    const diffMs = airTs - now;
    const hrs = Math.floor(Math.abs(diffMs) / 3_600_000);
    const mins = Math.floor((Math.abs(diffMs) % 3_600_000) / 60_000);
    return {
      anime: a,
      airTs,
      diffMs,
      countdown: diffMs > 0 ? `in ${hrs}h ${mins}m` : `${hrs}h ${mins}m ago`,
      isPast: diffMs < 0,
    };
  });

  return (
    <section className="section">
      <div className="container">
        <div style={{
          display: 'flex', alignItems: 'end', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" />
                Live broadcast window
              </span>
            </div>
            <h2 className="display-md" style={{ margin: 0, color: 'var(--cream)' }}>
              Airing <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>now</em>.
            </h2>
          </div>
          <Link href="/schedule" className="font-mono" style={{
            color: 'var(--cream-dim)', fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.1em', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            borderBottom: '1px solid var(--line-strong)',
            paddingBottom: 4,
            transition: 'all 200ms',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.borderBottomColor = 'var(--gold)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--cream-dim)'; e.currentTarget.style.borderBottomColor = 'var(--line-strong)'; }}>
            Full schedule →
          </Link>
        </div>

        {/* Horizontal scroll rail */}
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto',
          paddingBottom: 8, margin: '0 -24px', padding: '0 24px 8px',
          scrollbarWidth: 'thin',
        }}>
          {itemsWithTimes.map((it, i) => {
            const a = it.anime;
            const title = a.title_english || a.title;
            return (
              <Link key={a.id} href={`/anime/${a.slug}`} style={{
                textDecoration: 'none',
                flex: '0 0 auto',
                width: 180,
              }}>
                <div className="lift-on-hover" style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--line)',
                  background: 'var(--surface)',
                }}>
                  {a.poster_url ? (
                    <img src={a.poster_url} alt="" style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                    }} loading="lazy" />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--cream-mute)', fontSize: 11,
                      fontFamily: 'var(--mono)',
                    }}>{title.slice(0, 12)}</div>
                  )}
                  {/* Top right: countdown badge */}
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    padding: '4px 8px',
                    background: it.isPast ? 'rgba(110,116,148,0.85)' : 'rgba(209,69,69,0.85)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    borderRadius: 999,
                    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
                    letterSpacing: '0.04em',
                  }}>
                    {it.countdown}
                  </div>
                  {/* Bottom gradient with title */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: 12,
                    background: 'linear-gradient(to top, rgba(10,16,32,0.95), transparent)',
                  }}>
                    <div style={{
                      fontFamily: 'var(--body)', fontWeight: 600,
                      fontSize: 12, color: 'var(--cream)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{title}</div>
                    <div className="font-mono" style={{
                      fontSize: 9, color: 'var(--cream-dim)',
                      marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>{a.format || 'TV'} · EP {(a.episode_count || 0) + 1}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
