'use client';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}
interface GenreCount { genre: string; count: number; }
interface YearRow { year: number; count: number; }

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [genres, setGenres] = useState<GenreCount[]>([]);
  const [years, setYears] = useState<YearRow[]>([]);
  const [formats, setFormats] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      setStats(d.stats);
      setGenres(d.genres || []);
      setYears(d.years || []);
      setFormats(d.formats || []);
    });
  }, []);

  if (!stats) return <div style={{ minHeight: '100vh', background: 'var(--paper)' }} className="skeleton" />;

  const maxGenre = Math.max(...genres.map(g => g.count), 1);
  const maxYear = Math.max(...years.map(y => y.count), 1);

  return (
    <>
      <section className="stats-ribbon">
        <div><small>Titles indexed</small><strong>{stats.animeCount.toLocaleString()}</strong><span>Anime records</span></div>
        <div><small>Episodes cataloged</small><strong>{fmt(stats.episodeCount)}</strong><span>Across all titles</span></div>
        <div><small>Characters mapped</small><strong>{fmt(stats.characterCount)}</strong><span>Cast &amp; staff</span></div>
        <div><small>Currently airing</small><strong>{stats.releasingCount.toLocaleString()}</strong><span>Live records</span></div>
        <div><small>Data providers</small><strong>5-way</strong><span>Kitsu · TVDB · TMDB · AniList · MAL</span></div>
        <div><small>Index health</small><strong>100%</strong><span>Service operational</span></div>
      </section>

      <section style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '80px 40px' }}>
        <div className="section-heading" style={{ marginBottom: 38 }}>
          <div>
            <p className="section-kicker">Distribution</p>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0 }}>
              The catalog, by genre.
            </h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420 }}>
            Top {genres.length} genres in the index, ranked by record count.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          {genres.slice(0, 24).map(g => (
            <Link key={g.genre} href={`/genre/${encodeURIComponent(g.genre.toLowerCase().replace(/\s+/g, '-'))}`} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '200px 1fr 80px', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{g.genre}</span>
              <div style={{ height: 8, background: 'var(--paper-strong)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(g.count / maxGenre) * 100}%`, background: 'linear-gradient(90deg, var(--cobalt), var(--signal))' }} />
              </div>
              <span style={{ fontFamily: 'var(--utility)', fontSize: 11, color: 'var(--ink-soft)', textAlign: 'right' }}>{fmt(g.count)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '80px 40px' }}>
        <div className="section-heading" style={{ marginBottom: 38 }}>
          <div>
            <p className="section-kicker">Timeline</p>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0 }}>
              Year distribution.
            </h2>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {years.slice(0, 25).map(y => (
            <div key={y.year} style={{ padding: 16, background: 'var(--paper-strong)', border: '1px solid var(--line)' }}>
              <div style={{ fontFamily: 'var(--utility)', fontSize: 8, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{y.year}</div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: 22, marginTop: 4, color: 'var(--cobalt)' }}>{fmt(y.count)}</div>
              <div style={{ height: 4, background: 'var(--line)', marginTop: 8, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(y.count / maxYear) * 100}%`, background: 'var(--cobalt)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-cta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 'var(--page)', margin: '80px auto', padding: '55px 65px', background: 'var(--cobalt-dark)', color: 'white' }}>
        <div>
          <p className="section-kicker" style={{ color: 'rgba(255,255,255,0.7)' }}>Browse the index</p>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 36, letterSpacing: '-0.05em', margin: '8px 0 12px' }}>Filter, sort, find.</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 }}>Tune the whole catalog with {genres.length} genres and {years.length} years of records.</p>
        </div>
        <Link href="/library" className="primary-action" style={{ background: 'white', color: 'var(--ink)', padding: '16px 22px', fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 0 }}>
          Open library <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}
