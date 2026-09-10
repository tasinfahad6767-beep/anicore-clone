'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import type { Anime } from '@/lib/anicore/db';

export default function ListPage() {
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  const loadList = async () => {
    try {
      const ids: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
      if (!ids.length) { setItems([]); setLoading(false); return; }
      // Fetch each — could be batched in a real API, but fine for now
      const results = await Promise.all(
        ids.slice(0, 60).map(id =>
          fetch(`/api/id/${id}`).then(r => r.ok ? r.json() : null).catch(() => null)
        )
      );
      setItems(results.filter(Boolean).map(r => r.anime || r).filter(Boolean));
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { loadList(); }, []);

  const clearList = () => {
    localStorage.removeItem('anicore-list');
    window.dispatchEvent(new Event('anicore-list-changed'));
    setItems([]);
  };

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--paper)' }} className="skeleton" />;

  return (
    <section className="content-section" id="my-list" style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '105px 40px' }}>
      <div className="section-heading" style={{ marginBottom: 38 }}>
        <div>
          <p className="section-kicker">Personal library</p>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: 0 }}>
            My list.
          </h2>
        </div>
        {items.length > 0 && (
          <button onClick={clearList} style={{ background: 'transparent', border: '1px solid var(--signal)', color: 'var(--signal)', padding: '8px 14px', fontSize: 11, fontFamily: 'var(--utility)', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Trash2 className="w-3.5 h-3.5" /> Clear list
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
          <Heart className="w-12 h-12" style={{ opacity: 0.2, margin: '0 auto 16px' }} />
          <p style={{ fontSize: 14 }}>Your list is empty.</p>
          <p style={{ fontSize: 11, marginTop: 8 }}>Click the heart on any anime to add it here.</p>
          <Link href="/" className="outline-action" style={{ marginTop: 24, textDecoration: 'none', display: 'inline-flex' }}>
            Browse the catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="browse-grid">
          {items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)}
        </div>
      )}
    </section>
  );
}
