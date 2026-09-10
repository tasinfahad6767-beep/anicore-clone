'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface GenreCount { genre: string; count: number; }

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function GenreConstellation({ genres }: { genres: GenreCount[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const sorted = [...genres].sort((a, b) => b.count - a.count);
  const max = sorted[0]?.count || 1;
  const top = sorted.slice(0, 6);

  return (
    <section className="section">
      <div className="container">
        <div style={{
          display: 'flex', alignItems: 'end', justifyContent: 'space-between',
          marginBottom: 32, flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>
              <span>Genre weight map / clickable</span>
            </div>
            <h2 className="display-lg" style={{ margin: 0, color: 'var(--cream)' }}>
              Where the <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>weight</em> is.
            </h2>
            <p className="font-body" style={{
              margin: '12px 0 0', color: 'var(--cream-dim)',
              fontSize: 14, maxWidth: '50ch',
            }}>
              Every pill sized by record count. The biggest are the loudest in the archive.
            </p>
          </div>
          <Link href="/library" className="btn-ghost">
            Browse all <ArrowUpRight style={{ width: 12, height: 12 }} />
          </Link>
        </div>

        {/* Cloud */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
          padding: 24, background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 16,
        }}>
          {sorted.slice(0, 36).map((g, i) => {
            const weight = g.count / max; // 0..1
            const isTop = top.some(t => t.genre === g.genre);
            const isHovered = hovered === g.genre;
            const fontSize = `calc(0.7rem + ${weight * 0.9}rem)`;
            return (
              <Link
                key={g.genre}
                href={`/genre/${encodeURIComponent(g.genre.toLowerCase().replace(/\s+/g, '-'))}`}
                className={`genre-pill ${isTop ? 'is-top' : ''}`}
                style={{
                  fontSize,
                  fontWeight: isTop ? 600 : 500,
                  transform: isHovered ? 'translateY(-3px) scale(1.05)' : undefined,
                  opacity: hovered && !isHovered ? 0.5 : 1,
                }}
                onMouseEnter={() => setHovered(g.genre)}
                onMouseLeave={() => setHovered(null)}
              >
                {g.genre}
                <span style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 9,
                  opacity: 0.6,
                  marginLeft: 6,
                  letterSpacing: '0.05em',
                }}>{fmt(g.count)}</span>
              </Link>
            );
          })}
        </div>

        {/* Top 3 highlight */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12, marginTop: 16,
        }}>
          {top.slice(0, 3).map((g, i) => (
            <Link key={g.genre} href={`/genre/${encodeURIComponent(g.genre.toLowerCase().replace(/\s+/g, '-'))}`}
              style={{ textDecoration: 'none' }}>
              <div className="lift-on-hover" style={{
                padding: '20px 22px',
                background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <div className="font-mono" style={{ fontSize: 9, color: 'var(--cream-mute)', marginBottom: 4 }}>
                    RANK {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="font-display" style={{
                    fontSize: 22, color: 'var(--cream)', fontWeight: 500,
                    letterSpacing: '-0.02em',
                  }}>{g.genre}</div>
                  <div className="font-mono" style={{ fontSize: 11, color: 'var(--gold)', marginTop: 4 }}>
                    {fmt(g.count)} titles
                  </div>
                </div>
                <ArrowUpRight style={{ width: 16, height: 16, color: 'var(--cream-mute)' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
