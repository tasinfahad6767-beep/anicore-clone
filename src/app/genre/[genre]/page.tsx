'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import type { Anime } from '@/lib/anicore/db';

export default function GenrePage() {
  const params = useParams();
  const rawGenre = params.genre as string;
  const genre = rawGenre.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/browse?genre=${encodeURIComponent(genre)}&page=${page}&perPage=24`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setTotal(d.pageInfo?.total || 0);
      setLoading(false);
    });
  }, [genre, page]);

  return (
    <section className="content-section" id={`genre-${rawGenre}`} style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '105px 40px' }}>
      <div className="section-heading" style={{ marginBottom: 38 }}>
        <div>
          <p className="section-kicker">Genre filter</p>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0 }}>
            {genre}.
          </h2>
        </div>
        <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420 }}>
          {loading ? 'Filtering the index…' : `${total.toLocaleString()} titles tagged ${genre}.`}
        </p>
      </div>

      {loading ? (
        <div className="browse-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="anime-card">
              <div className="poster-wrap skeleton" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="browse-grid">
          {items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
          <p style={{ fontSize: 14 }}>No anime tagged &ldquo;{genre}&rdquo; in the index yet.</p>
          <Link href="/library" className="outline-action" style={{ marginTop: 24, textDecoration: 'none', display: 'inline-flex' }}>
            ← Browse all
          </Link>
        </div>
      )}

      {total > 24 && (
        <div className="episode-pagination" style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 48, flexWrap: 'wrap' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
          <span>Page {page} of {Math.ceil(total / 24)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={items.length < 24}>→</button>
        </div>
      )}
    </section>
  );
}
