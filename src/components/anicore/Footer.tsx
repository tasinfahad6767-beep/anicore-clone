'use client';
import Link from 'next/link';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

function formatBig(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function Footer({ stats }: { stats?: Stats }) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

  return (
    <footer className="site-footer">
      <div className="site-footer-lead">
        <Link href="/" className="brand footer-brand" style={{ textDecoration: 'none' }}>
          <span className="brand-mark">A</span>
          <span>
            <strong>AniCore</strong>
            <small>the anime archive</small>
          </span>
        </Link>
        <p>One unified anime record, resolved across five independent databases. Self-hosted, fast, no ads.</p>
        <a className="footer-email" href="mailto:hello@anicore.local">hello@anicore.local</a>
      </div>

      <div className="site-footer-links">
        <div>
          <strong>Explore</strong>
          <Link href="/">Discover</Link>
          <Link href="/season">This season</Link>
          <Link href="/schedule">Schedule</Link>
          <Link href="/library">My library</Link>
          <Link href="/stats">Site stats</Link>
        </div>
        <div>
          <strong>Build</strong>
          <Link href="/lab">API Lab</Link>
          <Link href="/lab">Developers</Link>
          <Link href="/stats">Data &amp; sources</Link>
          <Link href="/stats">Service status</Link>
        </div>
        <div>
          <strong>AniCore</strong>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
          <Link href="/">Community guidelines</Link>
          <Link href="/">Privacy</Link>
          <Link href="/">Terms</Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} AniCore</span>
        <span>Independent anime metadata platform · {stats ? `${formatBig(stats.animeCount)} titles indexed · Index updated ${today}` : `Index updated ${today}`}</span>
        <button>
          <i></i> Service status
        </button>
      </div>
    </footer>
  );
}
