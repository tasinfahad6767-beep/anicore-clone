'use client';
import { useEffect, useRef, useState } from 'react';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

function useCountUp(target: number, durationMs: number, start: boolean) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, durationMs, start]);
  return val;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function IndexPulse({ stats }: { stats: Stats }) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setStarted(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anime = useCountUp(stats.animeCount, 1800, started);
  const episodes = useCountUp(stats.episodeCount, 1800, started);
  const chars = useCountUp(stats.characterCount, 1800, started);
  const airing = useCountUp(stats.releasingCount, 1800, started);

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 16,
          padding: '60px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle grid overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div className="eyebrow no-bar" style={{ marginBottom: 12, justifyContent: 'center', display: 'inline-flex' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span className="live-dot" />
                Index heartbeat · live
              </span>
            </div>
            <h2 className="display-md" style={{ margin: '0 0 8px', color: 'var(--cream)', fontWeight: 500 }}>
              The archive is <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>alive</em>.
            </h2>
            <p className="font-body" style={{
              margin: '0 auto 40px', maxWidth: '60ch',
              color: 'var(--cream-dim)', fontSize: 14, lineHeight: 1.7,
            }}>
              Five independent databases, unified into one canonical record. New titles enter the index every minute — these numbers reflect the current state of the archive.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 24,
              maxWidth: 900,
              margin: '0 auto',
            }}>
              <Stat label="Titles indexed" value={anime.toLocaleString()} />
              <Stat label="Episodes cataloged" value={fmt(episodes)} />
              <Stat label="Characters mapped" value={fmt(chars)} />
              <Stat label="Airing right now" value={airing.toLocaleString()} accent="crimson" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: 'gold' | 'crimson' }) {
  return (
    <div>
      <div className="font-display" style={{
        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
        lineHeight: 1, fontWeight: 500, letterSpacing: '-0.04em',
        color: accent === 'crimson' ? 'var(--crimson)' : 'var(--gold)',
      }}>
        {value}
      </div>
      <div className="font-mono" style={{
        marginTop: 8, fontSize: 10, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--cream-dim)',
      }}>{label}</div>
    </div>
  );
}
