'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import type { Anime } from '@/lib/anicore/db';

function SearchContent() {
  const search = useSearchParams();
  const q = search.get('q') || '';
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setItems([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=60`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, [q]);

  return (
    <section className="content-section" id="search" style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '105px 40px' }}>
      <div className="section-heading" style={{ marginBottom: 38 }}>
        <div>
          <p className="section-kicker">Search results</p>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0 }}>
            &ldquo;{q}&rdquo;
          </h2>
        </div>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420 }}>
          {loading ? 'Searching the index…' : `${items.length} matches across ${items.length > 0 ? '5 sources' : 'no sources'}.`}
        </p>
      </div>

      {loading ? (
        <div className="browse-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="anime-card">
              <div className="poster-wrap skeleton" />
              <div className="card-copy">
                <div className="skeleton" style={{ height: 12, marginTop: 8 }} />
                <div className="skeleton" style={{ height: 8, marginTop: 6 }} />
              </div>
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="browse-grid">
          {items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
          <SearchIcon className="w-12 h-12" style={{ opacity: 0.2, margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14 }}>No anime match &ldquo;{q}&rdquo;.</p>
          <Link href="/" className="outline-action" style={{ marginTop: 24, textDecoration: 'none', display: 'inline-flex' }}>
            ← Back to AniCore
          </Link>
        </div>
      )}
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--paper)' }} className="skeleton" />}>
      <SearchContent />
    </Suspense>
  );
}
