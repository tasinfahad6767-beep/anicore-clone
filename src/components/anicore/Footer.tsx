'use client';
import Link from 'next/link';
import { Heart, Github } from 'lucide-react';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

export function Footer({ stats }: { stats?: Stats }) {
  return (
    <footer style={{
      marginTop: 96,
      borderTop: '1px solid var(--line)',
      background: 'var(--ink-deep)',
    }}>
      {/* Top color bar */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, var(--gold) 0%, var(--crimson) 35%, var(--teal) 65%, var(--gold) 100%)',
      }} />

      <div className="container" style={{ padding: '64px 24px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 1fr) repeat(3, 1fr)',
          gap: 64,
        }}>
          {/* Lead */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="font-display" style={{
                fontSize: 28, fontWeight: 500, color: 'var(--cream)', letterSpacing: '-0.03em',
              }}>AniCore</span>
              <div className="font-mono" style={{
                fontSize: 10, color: 'var(--cream-mute)', textTransform: 'uppercase',
                letterSpacing: '0.12em', marginTop: 4,
              }}>the living archive</div>
            </Link>
            <p className="font-body" style={{
              margin: '24px 0 0', color: 'var(--cream-dim)',
              fontSize: 13, lineHeight: 1.7, maxWidth: 380,
            }}>
              One traceable anime record, resolved across the databases fans and developers already use. Self-hosted, fast, no ads.
            </p>
          </div>

          {/* Nav columns */}
          <FooterCol title="Explore" links={[
            { label: 'Discover', href: '/' },
            { label: 'This Season', href: '/season' },
            { label: 'Schedule', href: '/schedule' },
            { label: 'Library', href: '/library' },
          ]} />
          <FooterCol title="Build" links={[
            { label: 'API Lab', href: '/lab' },
            { label: 'Stats', href: '/stats' },
            { label: 'Data sources', href: '/stats' },
            { label: 'Service status', href: '/stats' },
          ]} />
          <FooterCol title="AniCore" links={[
            { label: 'About', href: '/' },
            { label: 'Contact', href: '/' },
            { label: 'Privacy', href: '/' },
            { label: 'Terms', href: '/' },
          ]} />
        </div>

        {/* Stats strip */}
        {stats && (
          <div style={{
            marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--line)',
            display: 'flex', flexWrap: 'wrap', gap: 32,
          }}>
            <Stat label="Titles" value={stats.animeCount.toLocaleString()} />
            <Stat label="Episodes" value={stats.episodeCount.toLocaleString()} />
            <Stat label="Characters" value={stats.characterCount.toLocaleString()} />
            <Stat label="Airing now" value={stats.releasingCount.toLocaleString()} />
          </div>
        )}

        {/* Bottom row */}
        <div style={{
          marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div className="font-mono" style={{
            fontSize: 10, color: 'var(--cream-mute)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            © {new Date().getFullYear()} AniCore · Built with <Heart style={{ width: 9, height: 9, fill: 'var(--crimson)', color: 'var(--crimson)', display: 'inline' }} /> · Self-hosted
          </div>
          <a href="https://github.com/tasinfahad6767-beep/anicore-clone" target="_blank" rel="noopener" style={{
            color: 'var(--cream-mute)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
            textDecoration: 'none',
            transition: 'color 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-mute)'}>
            <Github style={{ width: 12, height: 12 }} /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <div className="font-mono" style={{
        fontSize: 10, color: 'var(--cream-mute)', textTransform: 'uppercase',
        letterSpacing: '0.12em', marginBottom: 16,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {links.map(l => (
          <li key={l.label}>
            <Link href={l.href} style={{
              textDecoration: 'none', color: 'var(--cream-dim)',
              fontFamily: 'var(--body)', fontSize: 13,
              transition: 'color 180ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--cream-dim)'}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display" style={{
        fontSize: 24, color: 'var(--gold)', fontWeight: 500, letterSpacing: '-0.02em',
      }}>{value}</div>
      <div className="font-mono" style={{
        fontSize: 9, color: 'var(--cream-mute)', marginTop: 2,
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>{label}</div>
    </div>
  );
}
