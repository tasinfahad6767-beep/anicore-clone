'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export function DiveButton({ total }: { total: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const dive = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/random');
      const d = await r.json();
      if (d.anime?.slug) {
        router.push(`/anime/${d.anime.slug}`);
      } else {
        router.push('/library');
      }
    } catch {
      router.push('/library');
    }
  };

  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '64px 48px',
          position: 'relative',
          maxWidth: 720,
        }}>
          {/* Glow rings */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at center, rgba(224, 176, 86, 0.12), transparent 60%)',
            pointerEvents: 'none',
            animation: 'shimmer 4s ease-in-out infinite alternate',
          }} />

          <div style={{ position: 'relative' }}>
            <div className="eyebrow no-bar" style={{ marginBottom: 16, justifyContent: 'center', display: 'inline-flex' }}>
              <span>{total.toLocaleString()} titles · one roll of the dice</span>
            </div>

            <h2 className="display-lg" style={{ margin: '0 0 12px', color: 'var(--cream)' }}>
              Don&apos;t know what to <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>watch</em>?
            </h2>
            <p className="font-body" style={{
              margin: '0 auto 32px', maxWidth: '46ch',
              color: 'var(--cream-dim)', fontSize: 14, lineHeight: 1.7,
            }}>
              Let the archive pick. One random title from the entire index, weighted toward the highest-rated. Could be a classic, could be something you&apos;ve never heard of.
            </p>

            <button
              onClick={dive}
              disabled={loading}
              style={{
                background: 'var(--gold)',
                color: 'var(--ink)',
                border: 0,
                borderRadius: 999,
                padding: '20px 40px',
                fontFamily: 'var(--mono)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: loading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                transform: loading ? 'scale(0.96)' : 'scale(1)',
                boxShadow: loading ? 'none' : '0 16px 36px rgba(224, 176, 86, 0.3)',
              }}
              onMouseEnter={e => {
                if (loading) return;
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 48px rgba(224, 176, 86, 0.5)';
              }}
              onMouseLeave={e => {
                if (loading) return;
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(224, 176, 86, 0.3)';
              }}>
              <Sparkles style={{
                width: 18, height: 18,
                animation: loading ? 'spin 0.8s linear infinite' : 'none',
              }} />
              {loading ? 'Rolling…' : 'Dive into the archive'}
              {!loading && <ArrowRight style={{ width: 14, height: 14 }} />}
            </button>

            <div className="font-mono" style={{
              marginTop: 24, fontSize: 10, color: 'var(--cream-mute)',
              textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>
              ⌘ + ↵ to dive from anywhere (coming soon)
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
