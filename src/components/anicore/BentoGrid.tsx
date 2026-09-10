'use client';
import Link from 'next/link';
import { ArrowUpRight, Star, Sparkles, TrendingUp } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  anchor: Anime;     // big featured card
  side: Anime;       // tall side card (collection-style)
  tiles: Anime[];    // 4 small tiles
  wide?: Anime;      // wide horizontal card
}

export function BentoGrid({ anchor, side, tiles, wide }: Props) {
  return (
    <section className="section">
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            <span>Curated picks / this week</span>
          </div>
          <h2 className="display-lg" style={{ margin: 0, color: 'var(--cream)' }}>
            The shape of the <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>archive</em>.
          </h2>
        </div>

        <div className="bento">
          {/* Anchor: 8x2 big card */}
          <BentoCard anime={anchor} variant="anchor" tag="Featured" />

          {/* Side: 4x2 collection card */}
          <BentoCard anime={side} variant="side" tag="Editor's pick" />

          {/* Tiles: 4 small cards */}
          {tiles.slice(0, 4).map((a, i) => (
            <BentoCard key={a.id} anime={a} variant="tile" tag={`#${i + 2}`} />
          ))}

          {/* Wide bottom: optional */}
          {wide && <BentoCard anime={wide} variant="wide" tag="Hidden gem" />}
        </div>
      </div>
    </section>
  );
}

function BentoCard({ anime: a, variant, tag }: { anime: Anime; variant: 'anchor' | 'side' | 'tile' | 'wide'; tag: string }) {
  const title = a.title_english || a.title;
  const isAnchor = variant === 'anchor';
  const isSide = variant === 'side';
  const isTile = variant === 'tile';
  const isWide = variant === 'wide';

  return (
    <Link href={`/anime/${a.slug}`} className={`bento-${variant}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="lift-on-hover" style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid var(--line)',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: isSide || isWide ? 'row' : 'column',
      }}>
        {/* Image side */}
        <div style={{
          position: 'relative',
          flex: isSide ? '0 0 45%' : isWide ? '0 0 35%' : '1 1 auto',
          aspectRatio: isTile ? '3 / 4' : isAnchor ? '16 / 9' : 'auto',
          minHeight: isSide || isWide ? '100%' : 0,
          background: 'var(--ink-deep)',
          overflow: 'hidden',
        }}>
          {a.banner_url || a.poster_url ? (
            <img src={isAnchor || isWide ? a.banner_url || a.poster_url : a.poster_url} alt="" style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1)',
            }} loading="lazy" />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--cream-mute)', fontFamily: 'var(--display)', fontSize: 48,
            }}>{title.charAt(0)}</div>
          )}

          {/* Tag pill top-left */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px',
            background: 'rgba(10,16,32,0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--line-strong)',
            borderRadius: 999,
            color: 'var(--gold)',
            fontFamily: 'var(--mono)', fontSize: 9,
            fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            {tag}
          </div>

          {/* Score top-right */}
          {a.score_average != null && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '4px 10px',
              background: 'rgba(10,16,32,0.85)',
              backdropFilter: 'blur(8px)',
              borderRadius: 999,
              color: 'var(--gold)',
              fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
            }}>
              <Star style={{ width: 10, height: 10, fill: 'var(--gold)' }} />
              {(a.score_average / 10).toFixed(1)}
            </div>
          )}

          {/* Hover arrow */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            width: 36, height: 36,
            borderRadius: 999,
            background: 'var(--gold)',
            color: 'var(--ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all 280ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}>
            <ArrowUpRight style={{ width: 16, height: 16 }} />
          </div>
        </div>

        {/* Content side */}
        <div style={{
          flex: 1,
          padding: isTile ? 14 : isSide || isWide ? 24 : 24,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          minWidth: 0,
        }}>
          <div>
            {/* Meta line */}
            <div className="font-mono" style={{
              display: 'flex', gap: 8, flexWrap: 'wrap',
              fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--cream-mute)', marginBottom: 8,
            }}>
              {a.format && <span>{a.format}</span>}
              {a.season_year && <span>· {a.season_year}</span>}
              {a.episode_count && <span>· {a.episode_count} ep</span>}
            </div>

            {/* Title */}
            <h3 className="font-display" style={{
              margin: 0,
              fontSize: isAnchor ? 36 : isSide ? 24 : isWide ? 24 : 14,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              fontWeight: 500,
              color: 'var(--cream)',
              display: '-webkit-box',
              WebkitLineClamp: isAnchor ? 2 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>{title}</h3>

            {/* Native */}
            {a.title_native && a.title_native !== a.title_english && (isAnchor || isSide || isWide) && (
              <p className="font-display" style={{
                margin: '6px 0 0',
                fontSize: 13, fontStyle: 'italic', color: 'var(--gold)',
                fontWeight: 400,
              }}>{a.title_native}</p>
            )}

            {/* Synopsis for big cards */}
            {isAnchor && a.synopsis && (
              <p className="font-body" style={{
                margin: '14px 0 0',
                fontSize: 14, lineHeight: 1.65, color: 'var(--cream-dim)',
                maxWidth: '50ch',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{a.synopsis}</p>
            )}
          </div>

          {/* Bottom row */}
          {(isAnchor || isSide || isWide) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
              marginTop: 14, paddingTop: 14,
              borderTop: '1px solid var(--line)',
            }}>
              {(a.genres || []).slice(0, 3).map((g: any, i: number) => {
                const name = typeof g === 'string' ? g : (g?.name || '');
                return (
                  <span key={i} className="font-mono" style={{
                    fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '2px 8px', borderRadius: 999,
                    background: 'var(--surface-3)', color: 'var(--cream-dim)',
                    border: '1px solid var(--line)',
                  }}>{name}</span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
