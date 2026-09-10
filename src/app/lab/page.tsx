'use client';
import Link from 'next/link';
import { ArrowRight, Code, Database, Terminal } from 'lucide-react';

export default function LabPage() {
  return (
    <section style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '80px 40px' }}>
      <div className="section-heading" style={{ marginBottom: 38 }}>
        <div>
          <p className="section-kicker">API Lab</p>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0 }}>
            Build with the index.
          </h2>
        </div>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420 }}>
          Direct, read-only access to the AniCore unified catalog. JSON, no auth, no rate limits.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 48 }}>
        {[
          { method: 'GET', path: '/api/anime?perPage=24', desc: 'Paginated catalog with sort + filters' },
          { method: 'GET', path: '/api/anime/:slug', desc: 'Single anime with episodes, characters, recommendations' },
          { method: 'GET', path: '/api/search?q=…', desc: 'Title / synonym / native name search' },
          { method: 'GET', path: '/api/home', desc: 'Trending + popular + top + newest + airing + stats in one call' },
          { method: 'GET', path: '/api/season', desc: 'Current season\'s top anime + airing + upcoming' },
          { method: 'GET', path: '/api/stats', desc: 'Catalog stats, genre distribution, year histogram' },
          { method: 'GET', path: '/api/genres', desc: 'Distinct genres in the index' },
          { method: 'GET', path: '/api/random', desc: 'Random anime redirect' },
        ].map(ep => (
          <div key={ep.path} className="lab-endpoint-card" style={{ background: 'var(--paper-strong)', border: '1px solid var(--line)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ background: 'var(--mint)', color: 'var(--mint-ink)', fontFamily: 'var(--utility)', fontSize: 8, fontWeight: 700, padding: '3px 7px', letterSpacing: '0.05em' }}>{ep.method}</span>
              <code style={{ fontFamily: 'var(--utility)', fontSize: 12, color: 'var(--cobalt)' }}>{ep.path}</code>
            </div>
            <p style={{ fontSize: 11, color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>{ep.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--paper-strong)', border: '1px solid var(--line-dark)', padding: 24, marginTop: 40 }}>
        <p className="section-kicker">Quick start</p>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: 22, letterSpacing: '-0.04em', margin: '6px 0 18px' }}>Try the API in your terminal</h3>
        <pre style={{ background: 'var(--ink)', color: 'var(--paper-strong)', padding: 18, fontFamily: 'var(--utility)', fontSize: 11, lineHeight: 1.7, overflowX: 'auto' }}>
{`# Get top 5 trending anime
curl "https://anicore.local/api/home" \\
  | jq '.trending[] | {title: .title_english, score: .score_average}'

# Search by name
curl "https://anicore.local/api/search?q=frieren"

# Browse with filters
curl "https://anicore.local/api/browse?sort=score&genre=Action&yearFrom=2020"`}
        </pre>
      </div>

      <Link href="/" className="outline-action" style={{ marginTop: 32, textDecoration: 'none' }}>
        ← Back to AniCore
      </Link>
    </section>
  );
}
