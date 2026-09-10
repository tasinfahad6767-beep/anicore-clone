'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { FanPulse } from '@/components/anicore/FanPulse';
import type { Anime } from '@/lib/anicore/db';

export default function SeasonPage() {
  const [season, setSeason] = useState<string>('');
  const [year, setYear] = useState<number | null>(null);
  const [items, setItems] = useState<Anime[]>([]);
  const [airing, setAiring] = useState<Anime[]>([]);
  const [upcoming, setUpcoming] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/season').then(r => r.json()).then(d => {
      setSeason(d.season || 'Current season');
      setYear(d.year || null);
      setItems(d.items || []);
      setAiring(d.airing || []);
      setUpcoming(d.upcoming || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--paper)' }} className="skeleton" />;

  return (
    <>
      <section className="season-section" id="season" style={{ minHeight: 'auto' }}>
        <div className="season-intro" style={{ position: 'static' }}>
          <p className="section-kicker">{season}</p>
          <h2>
            The season,<br />
            <em>decoded.</em>
          </h2>
          <p>The loud premieres, the quiet surprises, and everything still airing — ranked through signals from across the community.</p>
          {year && (
            <Link href={`/library?year=${year}`} className="outline-action" style={{ textDecoration: 'none' }}>
              Browse {year} catalog <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        <div className="season-grid">
          {items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} wide />)}
        </div>
      </section>

      <FanPulse airing={airing} upcoming={upcoming} />
    </>
  );
}
