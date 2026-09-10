'use client';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  items: Anime[];
}

// Unique section — not in AniCore. Horizontal scroll of "spotlight" picks
// with larger cards, curator note, and a different layout from the trending track.
export function SpotlightPicks({ items }: Props) {
  if (!items?.length) return null;

  const picks = items.slice(0, 5);

  return (
    <section className="content-section" id="spotlight" style={{ background: 'var(--paper)', padding: '80px 0' }}>
      <div style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '0 40px' }}>
        <div className="section-heading" style={{ marginBottom: 32 }}>
          <div>
            <p className="section-kicker" style={{ color: 'var(--cobalt)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: 'var(--cobalt)',
                  display: 'inline-block', animation: 'shimmer 2s infinite',
                }} />
                Spotlight / editor selection
              </span>
            </p>
            <h2 style={{
              fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)',
              letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0, color: 'var(--ink)',
            }}>
              Worth your <em style={{ fontStyle: 'italic', color: 'var(--cobalt)' }}>time.</em>
            </h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420, fontSize: 14 }}>
            Five titles the algorithm won&apos;t surface. Hand-picked from the deep index.
          </p>
        </div>

        {/* Horizontal scroll with larger cards */}
        <div style={{
          display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 16,
          scrollbarWidth: 'thin', margin: '0 -40px', padding: '0 40px 16px',
        }}>
          {picks.map((a, i) => {
            const title = a.title_english || a.title;
            return (
              <Link key={a.id} href={`/anime/${a.slug}`} style={{
                textDecoration: 'none',
                flex: '0 0 auto',
                width: 320,
              }}>
                <div style={{
                  background: 'var(--paper-strong)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'all 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--cobalt)';
                  e.currentTarget.style.boxShadow = '0 16px 36px rgba(99, 102, 241, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.borderColor = 'var(--line)';
                  e.currentTarget.style.boxShadow = '';
                }}>
                  {/* Banner image */}
                  <div style={{
                    position: 'relative',
                    aspectRatio: '16 / 9',
                    overflow: 'hidden',
                    background: 'var(--paper)',
                  }}>
                    {a.banner_url ? (
                      <img src={a.banner_url} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 500ms ease',
                      }} loading="lazy" />
                    ) : a.poster_url ? (
                      <img src={a.poster_url} alt="" style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                      }} loading="lazy" />
                    ) : null}
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,16,32,0.8), transparent 60%)',
                    }} />
                    {/* Rank number */}
                    <div style={{
                      position: 'absolute', top: 12, left: 12,
                      fontFamily: 'var(--display)', fontSize: 32, fontWeight: 700,
                      color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      letterSpacing: '-0.04em',
                    }}>{String(i + 1).padStart(2, '0')}</div>
                    {/* Score badge */}
                    {a.score_average != null && (
                      <div style={{
                        position: 'absolute', top: 12, right: 12,
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'rgba(10,16,32,0.85)', backdropFilter: 'blur(8px)',
                        borderRadius: 999, padding: '4px 10px',
                        color: 'var(--yellow)', fontFamily: 'var(--utility)',
                        fontSize: 11, fontWeight: 700,
                      }}>
                        <Star style={{ width: 10, height: 10, fill: 'var(--yellow)' }} />
                        {Math.round(a.score_average)}
                      </div>
                    )}
                    {/* Title overlay on image */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: 14,
                    }}>
                      <h3 style={{
                        fontFamily: 'var(--display)', fontSize: 16, fontWeight: 600,
                        color: 'white', margin: 0, lineHeight: 1.2,
                        letterSpacing: '-0.02em',
                        display: '-webkit-box', WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>{title}</h3>
                      {a.title_native && a.title_native !== a.title_english && (
                        <p style={{
                          fontFamily: 'var(--display)', fontSize: 11, fontStyle: 'italic',
                          color: 'rgba(255,255,255,0.7)', margin: '2px 0 0',
                        }}>{a.title_native}</p>
                      )}
                    </div>
                  </div>
                  {/* Meta footer */}
                  <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      fontFamily: 'var(--utility)', fontSize: 9, color: 'var(--ink-soft)',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>
                      {a.format || 'TV'} · {a.season_year || '—'} · {a.episode_count || '?'} ep
                    </div>
                    <ArrowUpRight style={{ width: 14, height: 14, color: 'var(--cobalt)' }} />
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
