'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeroCarousel } from '@/components/anicore/HeroCarousel';
import { AnimeRow } from '@/components/anicore/AnimeRow';
import { AnimeGrid, AnimeGridSkeleton } from '@/components/anicore/AnimeGrid';
import { FilterBar } from '@/components/anicore/FilterBar';
import { Footer } from '@/components/anicore/Footer';
import { RowSkeleton } from '@/components/anicore/Skeletons';
import { Pagination } from '@/components/anicore/Pagination';
import type { Anime } from '@/lib/anicore/db';

export default function Home() {
  const [homeData, setHomeData] = useState<{
    trending: Anime[]; popular: Anime[]; topRated: Anime[]; newest: Anime[]; airing: Anime[];
    stats: { animeCount: number; episodeCount: number; characterCount: number; releasingCount: number };
  } | null>(null);

  const [libraryItems, setLibraryItems] = useState<Anime[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('trending');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/home').then(r => r.json()).then(setHomeData).catch(() => {});
  }, []);

  useEffect(() => {
    setLibraryLoading(true);
    fetch(`/api/browse?sort=${sort}&page=${page}&perPage=24${genre ? `&genre=${genre}` : ''}${year ? `&year=${year}` : ''}${format ? `&format=${format}` : ''}${status ? `&status=${status}` : ''}`)
      .then(r => r.json())
      .then(d => {
        setLibraryItems(d.items || []);
        setTotal(d.pageInfo?.total || 0);
        setLibraryLoading(false);
      });
  }, [sort, page, genre, year, format, status]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        {homeData ? (
          <HeroCarousel items={homeData.trending} />
        ) : (
          <div className="h-[460px] md:h-[520px] bg-zinc-900 rounded-xl animate-pulse" />
        )}
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {homeData ? (
          <>
            {homeData.airing?.length > 0 && (
              <AnimeRow title="Currently Airing" items={homeData.airing} viewAllHref="/schedule" />
            )}
            <AnimeRow title="Trending Now" items={homeData.trending} viewAllHref="/library?sort=trending" />
            <AnimeRow title="Most Popular" items={homeData.popular} viewAllHref="/library?sort=popular" />
            <AnimeRow title="Top Rated" items={homeData.topRated} viewAllHref="/library?sort=score" />
            <AnimeRow title="Newest Releases" items={homeData.newest} viewAllHref="/library?sort=newest" />
          </>
        ) : (
          <>
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </>
        )}

        {/* Library section */}
        <section className="mt-8 pt-6 border-t border-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">Browse Library</h2>
              {total > 0 && (
                <span className="text-xs text-zinc-500">{total.toLocaleString()} anime</span>
              )}
            </div>
            <Link href="/library" className="text-xs text-rose-400 hover:text-rose-300">
              Open full library →
            </Link>
          </div>

          <FilterBar
            sort={sort} setSort={setSort}
            genre={genre} setGenre={(v) => { setGenre(v); setPage(1); }}
            year={year} setYear={(v) => { setYear(v); setPage(1); }}
            format={format} setFormat={(v) => { setFormat(v); setPage(1); }}
            status={status} setStatus={(v) => { setStatus(v); setPage(1); }}
          />

          {libraryLoading ? (
            <AnimeGridSkeleton count={18} />
          ) : libraryItems.length > 0 ? (
            <>
              <AnimeGrid items={libraryItems} />
              <Pagination page={page} lastPage={Math.ceil(total / 24)} onPage={setPage} />
            </>
          ) : (
            <div className="text-center py-12 text-zinc-500 text-sm">No anime match these filters</div>
          )}
        </section>
      </div>

      <Footer stats={homeData?.stats} />
    </div>
  );
}
