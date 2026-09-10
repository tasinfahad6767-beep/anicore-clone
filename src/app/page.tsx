'use client';
import { useState, useEffect } from 'react';
import { HeroSpotlight } from '@/components/anicore/HeroSpotlight';
import { IndexStrip } from '@/components/anicore/IndexStrip';
import { AnimeRow } from '@/components/anicore/AnimeRow';
import { AnimeGrid, AnimeGridSkeleton } from '@/components/anicore/AnimeGrid';
import { MotionFeature } from '@/components/anicore/MotionFeature';
import { FanPulse } from '@/components/anicore/FanPulse';
import { SeasonSection } from '@/components/anicore/SeasonSection';
import { FilterPanel } from '@/components/anicore/FilterPanel';
import { Pagination } from '@/components/anicore/Pagination';
import { RowSkeleton } from '@/components/anicore/Skeletons';
import type { Anime } from '@/lib/anicore/db';

interface HomeData {
  trending: Anime[];
  popular: Anime[];
  topRated: Anime[];
  newest: Anime[];
  airing: Anime[];
  upcoming: Anime[];
  latestSeason: Anime[];
  stats: { animeCount: number; episodeCount: number; characterCount: number; releasingCount: number };
}

export default function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [browseItems, setBrowseItems] = useState<Anime[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('trending');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/home').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  useEffect(() => {
    setBrowseLoading(true);
    const params = new URLSearchParams({ sort, page: String(page), perPage: '30' });
    if (genre) params.set('genre', genre);
    if (year) params.set('year', year);
    if (format) params.set('format', format);
    if (status) params.set('status', status);
    fetch(`/api/browse?${params}`).then(r => r.json()).then(d => {
      setBrowseItems(d.items || []);
      setTotal(d.pageInfo?.total || 0);
      setBrowseLoading(false);
    });
  }, [sort, page, genre, year, format, status]);

  return (
    <div className="min-h-screen">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Hero spotlight */}
        {data ? <HeroSpotlight items={data.trending} /> : (
          <div className="h-[520px] md:h-[620px] bg-[var(--paper-strong)] rounded-3xl animate-pulse" />
        )}

        {/* Index strip */}
        {data && <IndexStrip stats={data.stats} />}

        {/* Trending row */}
        {data ? (
          <AnimeRow
            title="Trending across the index"
            kicker="What everyone's watching"
            items={data.trending}
            viewAllHref="/library?sort=trending"
          />
        ) : <RowSkeleton />}

        {/* Motion feature */}
        {data && <MotionFeature stats={data.stats} />}

        {/* Fan pulse (airing + upcoming) */}
        {data && <FanPulse airing={data.airing} upcoming={data.upcoming} />}

        {/* Season section */}
        {data?.latestSeason?.length > 0 && (
          <SeasonSection
            season={(() => {
              const a = data.latestSeason[0];
              return `${(a.season || '').charAt(0) + (a.season || '').slice(1).toLowerCase()} ${a.season_year || ''}`.trim();
            })()}
            items={data.latestSeason}
          />
        )}

        {/* More rows */}
        {data && (
          <>
            <AnimeRow title="Most popular" kicker="All-time favorites" items={data.popular} viewAllHref="/library?sort=popular" />
            <AnimeRow title="Top rated" kicker="Critical consensus" items={data.topRated} viewAllHref="/library?sort=score" />
            <AnimeRow title="Newest releases" kicker="Fresh in the index" items={data.newest} viewAllHref="/library?sort=newest" />
          </>
        )}

        {/* Browse section */}
        <section id="browse" className="mt-16 pt-8 border-t border-[var(--line)]">
          <div className="mb-4">
            <p className="section-kicker">Advanced discovery</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[var(--ink)]">Tune the signal</h2>
            <p className="text-sm text-[var(--ink-soft)] mt-1">Filter the whole index, not a hand-picked shelf.</p>
          </div>

          <FilterPanel
            sort={sort} setSort={(v) => { setSort(v); setPage(1); }}
            genre={genre} setGenre={(v) => { setGenre(v); setPage(1); }}
            year={year} setYear={(v) => { setYear(v); setPage(1); }}
            format={format} setFormat={(v) => { setFormat(v); setPage(1); }}
            status={status} setStatus={(v) => { setStatus(v); setPage(1); }}
          />

          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-xs text-[var(--ink-soft)] uppercase tracking-wider">
              {browseLoading ? 'Loading…' : `${total.toLocaleString()} titles match`}
            </div>
          </div>

          {browseLoading ? (
            <AnimeGridSkeleton count={18} />
          ) : browseItems.length > 0 ? (
            <>
              <AnimeGrid items={browseItems} />
              <Pagination page={page} lastPage={Math.ceil(total / 30)} onPage={setPage} />
            </>
          ) : (
            <div className="text-center py-16 text-[var(--ink-soft)]">
              <div className="text-lg mb-2">No anime match these filters</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
