'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import type { Anime } from '@/lib/anicore/db';

export default function SchedulePage() {
  const [airing, setAiring] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/airing').then(r => r.json()).then(d => {
      setAiring(d.items || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--paper)' }} className="skeleton" />;

  return (
    <section className="fan-pulse-section" id="schedule">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Weekly schedule</p>
          <h2>What&apos;s airing now.</h2>
        </div>
        <p>Currently releasing series — sorted by popularity.</p>
      </div>

      {airing.length > 0 ? (
        <div className="browse-grid">
          {airing.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)}
        </div>
      ) : (
        <p style={{ color: 'var(--ink-soft)', textAlign: 'center', padding: '64px 0' }}>
          No currently airing anime in the index. <Link href="/" style={{ color: 'var(--cobalt)' }}>← Back home</Link>
        </p>
      )}
    </section>
  );
}
