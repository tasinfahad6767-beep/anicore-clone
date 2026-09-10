'use client';
import Link from 'next/link';
import { Quote, ArrowUpRight } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Pick {
  anime: Anime;
  note: string;
  curator: string;
}

export function CuratorPicks({ picks }: { picks: Pick[] }) {
  if (!picks?.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            <span>Editor's selection / hand-picked</span>
          </div>
          <h2 className="display-lg" style={{ margin: 0, color: 'var(--cream)' }}>
            Notes from the <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>margin</em>.
          </h2>
          <p className="font-body" style={{
            margin: '12px 0 0', color: 'var(--cream-dim)',
            fontSize: 14, maxWidth: '50ch',
          }}>
            Three titles worth your time, with a sentence on why.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {picks.map((p, i) => {
            const a = p.anime;
            const title = a.title_english || a.title;
            return (
              <Link key={a.id} href={`/anime/${a.slug}`} style={{ textDecoration: 'none' }}>
                <article className="lift-on-hover" style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 16,
                  padding: 24,
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', gap: 16,
                }}>
                  <div className="font-mono" style={{
                    fontSize: 10, color: 'var(--gold)', textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}>
                    № {String(i + 1).padStart(2, '0')} · {a.format || 'TV'}
                  </div>

                  {/* Poster + title row */}
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {a.poster_url && (
                      <div style={{
                        width: 64, height: 88, borderRadius: 6, overflow: 'hidden',
                        flexShrink: 0, border: '1px solid var(--line)',
                      }}>
                        <img src={a.poster_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="font-display" style={{
                        margin: 0, fontSize: 20, fontWeight: 500,
                        color: 'var(--cream)', letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                      }}>{title}</h3>
                      {a.title_native && a.title_native !== a.title_english && (
                        <p className="font-display" style={{
                          margin: '4px 0 0', fontSize: 12, fontStyle: 'italic',
                          color: 'var(--gold)',
                        }}>{a.title_native}</p>
                      )}
                      <div className="font-mono" style={{
                        marginTop: 8, fontSize: 9, color: 'var(--cream-mute)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                      }}>
                        {a.season_year || '—'} · {a.episode_count || '?'} ep
                        {a.score_average != null && ` · ★ ${(a.score_average / 10).toFixed(1)}`}
                      </div>
                    </div>
                  </div>

                  {/* Curator note */}
                  <div style={{
                    position: 'relative',
                    padding: '14px 16px 14px 32px',
                    background: 'var(--ink-deep)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    flex: 1,
                  }}>
                    <Quote style={{
                      position: 'absolute', top: 10, left: 10,
                      width: 14, height: 14, color: 'var(--gold)', opacity: 0.5,
                    }} />
                    <p className="font-body" style={{
                      margin: 0, fontSize: 13, color: 'var(--cream-dim)', lineHeight: 1.6,
                    }}>{p.note}</p>
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 11, color: 'var(--cream-mute)',
                  }}>
                    <span className="font-mono" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      — {p.curator}
                    </span>
                    <span className="font-mono" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      color: 'var(--gold)',
                    }}>
                      Open <ArrowUpRight style={{ width: 10, height: 10 }} />
                    </span>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
