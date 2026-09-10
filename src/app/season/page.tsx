'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { FanPulse } from '@/components/anicore/FanPulse';
import { HeroSpotlight } from '@/components/anicore/HeroSpotlight';
import { IndexStrip } from '@/components/anicore/IndexStrip';
import { SeasonSection } from '@/components/anicore/SeasonSection';
import { MotionFeature } from '@/components/anicore/MotionFeature';
import type { Anime } from '@/lib/anicore/db';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

export default function SeasonPage() {
  const [data, setData] = useState<{
    season: string; year: number;
    items: Anime[]; airing: Anime[]; upcoming: Anime[];
  } | null>(null);
  const [trending, setTrending] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/season').then(r => r.json()),
      fetch('/api/home').then(r => r.json()),
    ]).then(([seasonData, homeData]) => {
      setData(seasonData);
      setTrending(homeData.trending || []);
      setPopular(homeData.popular || []);
      setTopRated(homeData.topRated || []);
      setStats(homeData.stats || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !data) return (
    <div className="inner-page">
      <div className="skeleton" style={{ height: 500, margin: 40 }} />
    </div>
  );

  return (
    <>
      {/* Hero with this season's top anime */}
      <HeroSpotlight items={trending.slice(0, 7)} totalAnime={stats?.animeCount || 0} />

      {stats && <IndexStrip stats={stats} />}

      {/* Season spotlight */}
      <SeasonSection season={data.season} items={data.items} />

      {/* Motion feature */}
      {stats && <MotionFeature stats={stats} />}

      {/* Currently airing + upcoming */}
      <FanPulse airing={data.airing} upcoming={data.upcoming} />

      {/* Most popular this season */}
      {popular.length > 0 && (
        <section className="content-section" id="popular">
          <div className="section-heading">
            <div>
              <p className="section-kicker">All-time favorites</p>
              <h2>Most popular.</h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420 }}>
              The titles that never leave the conversation, ranked by MAL members.
            </p>
          </div>
          <div className="trending-track">
            {popular.slice(0, 10).map((a, i) => (
              <AnimeCard key={`pop-${a.id}-${i}`} anime={a} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Top rated */}
      {topRated.length > 0 && (
        <section className="content-section" id="top-rated">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Critical consensus</p>
              <h2>Top rated.</h2>
            </div>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 420 }}>
              The highest-scored titles across the unified index.
            </p>
          </div>
          <div className="trending-track">
            {topRated.slice(0, 10).map((a, i) => (
              <AnimeCard key={`top-${a.id}-${i}`} anime={a} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Browse CTA */}
      <section style={{ maxWidth: 'var(--page)', margin: '0 auto', padding: '80px 40px', textAlign: 'center' }}>
        <p className="section-kicker">Explore deeper</p>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(36px, 4vw, 60px)', letterSpacing: '-0.065em', lineHeight: 1.03, margin: '0 0 18px' }}>
          Tune the full catalog.
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Filter the entire index by genre, year, format, and status. Find exactly what you&apos;re looking for.
        </p>
        <Link href="/library" className="outline-action" style={{ textDecoration: 'none' }}>
          Open the library <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}
