'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

export function HeroCinematic({ items, total }: { items: Anime[]; total: number }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 9000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) {
    return (
      <section style={{ minHeight: '78vh', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
      </section>
    );
  }

  const a = items[idx];
  const title = a.title_english || a.title;

  return (
    <section style={{
      position: 'relative',
      minHeight: '78vh',
      overflow: 'hidden',
    }}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}>
      {/* Background image with parallax */}
      <div className="parallax-image" style={{
        position: 'absolute',
        inset: '-6%',
        backgroundImage: `url("${a.banner_url || a.poster_url || ''}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'saturate(1.05)',
      }} />
      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, var(--ink) 0%, rgba(10,16,32,0.85) 35%, rgba(10,16,32,0.5) 60%, transparent 90%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, var(--ink) 0%, rgba(10,16,32,0.7) 40%, rgba(10,16,32,0.2) 70%, transparent 100%)',
      }} />

      {/* Top eyebrow */}
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="eyebrow">
            <span>Archive / Vol. {String(idx + 1).padStart(2, '0')}</span>
            <span style={{ color: 'var(--crimson)' }}>· {a.status === 'RELEASING' ? 'AIRING NOW' : 'FEATURED'}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {items.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} aria-label={`Slide ${i + 1}`} style={{
                height: 2,
                width: i === idx ? 40 : 16,
                background: i === idx ? 'var(--gold)' : 'var(--line-strong)',
                border: 0, padding: 0, cursor: 'pointer',
                transition: 'all 320ms cubic-bezier(0.2, 0.8, 0.2, 1)',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className="container" style={{
        position: 'relative', zIndex: 2,
        paddingBottom: 80,
        paddingTop: 80,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Native title above */}
        {a.title_native && a.title_native !== a.title_english && (
          <p className="font-display" style={{
            fontSize: 16, fontStyle: 'italic', color: 'var(--gold)',
            margin: 0, fontWeight: 400, letterSpacing: '-0.01em',
          }}>{a.title_native}</p>
        )}

        {/* Massive title */}
        <h1 className="font-display" style={{
          fontSize: 'clamp(3rem, 8vw, 7rem)',
          lineHeight: 0.95, letterSpacing: '-0.04em',
          margin: 0, fontWeight: 500, color: 'var(--cream)',
          maxWidth: '14ch',
        }}>
          {title}
        </h1>

        {/* Meta row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
          marginTop: 8,
        }}>
          {a.score_average != null && (
            <span className="font-mono" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px',
              background: 'var(--ink)',
              border: '1px solid var(--line-gold)',
              borderRadius: 999,
              color: 'var(--gold)', fontSize: 12, fontWeight: 600,
            }}>
              ★ {(a.score_average / 10).toFixed(1)} <span style={{ opacity: 0.5 }}>/10</span>
            </span>
          )}
          {a.format && (
            <span className="font-mono" style={{
              color: 'var(--cream-dim)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>{a.format}</span>
          )}
          {a.season_year && (
            <span className="font-mono" style={{
              color: 'var(--cream-dim)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>{a.season} {a.season_year}</span>
          )}
          {a.episode_count && (
            <span className="font-mono" style={{
              color: 'var(--cream-dim)', fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>{a.episode_count} EP</span>
          )}
        </div>

        {/* Synopsis */}
        {a.synopsis && (
          <p className="font-body" style={{
            color: 'var(--cream-dim)',
            fontSize: 15, lineHeight: 1.7,
            maxWidth: '55ch',
            margin: '12px 0 0',
          }}>{a.synopsis.slice(0, 220)}…</p>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Link href={`/anime/${a.slug}`} className="btn-gold">
            Open the record <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
          <Link href={`/anime/${a.slug}/watch`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--cream)', color: 'var(--ink)',
            fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '14px 24px', borderRadius: 999, textDecoration: 'none',
            border: '1px solid var(--cream)',
            transition: 'all 200ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--cream)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--cream)'; e.currentTarget.style.color = 'var(--ink)'; }}>
            <Play style={{ width: 12, height: 12, fill: 'currentColor' }} /> Watch now
          </Link>
          <Link href="/random" className="btn-ghost">
            <Sparkles style={{ width: 12, height: 12 }} /> Pick for me
          </Link>
        </div>

        {/* Counter line */}
        <div style={{
          marginTop: 48, paddingTop: 24,
          borderTop: '1px solid var(--line)',
          display: 'flex', gap: 48, flexWrap: 'wrap',
        }}>
          <CounterStat label="Titles indexed" value={total} />
          <CounterStat label="Spotlight #" value={idx + 1} suffix={`/ ${items.length}`} />
          <CounterStat label="Status" value={(a.status || 'FINISHED').replace('_', ' ')} />
        </div>
      </div>
    </section>
  );
}

function CounterStat({ label, value, suffix }: { label: string; value: number | string; suffix?: string }) {
  return (
    <div>
      <div className="meta" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="font-display" style={{ fontSize: 28, color: 'var(--gold)', fontWeight: 500, letterSpacing: '-0.02em' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {suffix && <span className="font-mono" style={{ fontSize: 11, color: 'var(--cream-mute)' }}>{suffix}</span>}
      </div>
    </div>
  );
}
