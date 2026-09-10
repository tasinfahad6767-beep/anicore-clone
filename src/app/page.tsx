'use client';
import { useEffect, useState } from 'react';
import { HeroCinematic } from '@/components/anicore/HeroCinematic';
import { AiringRibbon } from '@/components/anicore/AiringRibbon';
import { BentoGrid } from '@/components/anicore/BentoGrid';
import { GenreConstellation } from '@/components/anicore/GenreConstellation';
import { IndexPulse } from '@/components/anicore/IndexPulse';
import { CuratorPicks } from '@/components/anicore/CuratorPicks';
import { DiveButton } from '@/components/anicore/DiveButton';
import type { Anime } from '@/lib/anicore/db';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}
interface GenreCount { genre: string; count: number; }

interface HomeData {
  trending: Anime[];
  popular: Anime[];
  topRated: Anime[];
  newest: Anime[];
  airing: Anime[];
  upcoming: Anime[];
  latestSeason: Anime[];
  stats: Stats;
}

const CURATOR_NOTES = [
  'A masterclass in pacing. The kind of show that rewards patience with one of the most satisfying payoffs in the medium.',
  'Quietly devastating. Watch it for the silences between the dialogue as much as the words themselves.',
  'Pure craft. Every frame is composed, every cut deliberate. A reminder that animation is a director\'s medium.',
];

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [genres, setGenres] = useState<GenreCount[]>([]);

  useEffect(() => {
    fetch('/api/home').then(r => r.json()).then(setData).catch(() => {});
    fetch('/api/stats').then(r => r.json()).then(d => setGenres(d.genres || [])).catch(() => {});
  }, []);

  if (!data) {
    return (
      <div>
        <div className="skeleton" style={{ minHeight: '78vh' }} />
        <div className="container" style={{ padding: 80 }}>
          <div className="skeleton" style={{ height: 200 }} />
        </div>
      </div>
    );
  }

  const { stats, trending, airing, popular, topRated, newest } = data;

  // Build bento picks
  const bento = {
    anchor: trending[0] || popular[0] || topRated[0] || newest[0],
    side: topRated[0] || popular[0],
    tiles: [popular[1], popular[2], newest[0], newest[1]].filter(Boolean),
    wide: topRated[1] || popular[3],
  };

  // Build curator picks (3 picks with notes)
  const curatorPicks = [
    { anime: topRated[0] || popular[0], note: CURATOR_NOTES[0], curator: 'The Archive' },
    { anime: popular[1] || topRated[1], note: CURATOR_NOTES[1], curator: 'The Archive' },
    { anime: newest[0] || airing[0], note: CURATOR_NOTES[2], curator: 'The Archive' },
  ].filter(p => p.anime);

  return (
    <>
      <HeroCinematic items={trending.slice(0, 7)} total={stats.animeCount} />

      <AiringRibbon items={airing} />

      <BentoGrid {...bento} />

      <IndexPulse stats={stats} />

      <GenreConstellation genres={genres} />

      <CuratorPicks picks={curatorPicks} />

      <DiveButton total={stats.animeCount} />

      {/* Final CTA strip */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{
            padding: '40px 32px',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 24,
          }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>
                <span>Looking for something specific?</span>
              </div>
              <h3 className="display-md" style={{ margin: 0, color: 'var(--cream)' }}>
                Filter the <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>entire index</em>.
              </h3>
            </div>
            <a href="/library" className="btn-gold">
              Open the library →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
