'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimeGrid, AnimeGridSkeleton } from '@/components/anicore/AnimeGrid';
import { FilterBar } from '@/components/anicore/FilterBar';
import { Footer } from '@/components/anicore/Footer';
import { Pagination } from '@/components/anicore/Pagination';
import type { Anime } from '@/lib/anicore/db';

function LibraryContent() {
  const search = useSearchParams();
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState(search.get('sort') || 'trending');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('sort', sort); params.set('page', String(page)); params.set('perPage', '36');
    if (genre) params.set('genre', genre);
    if (year) params.set('year', year);
    if (format) params.set('format', format);
    if (status) params.set('status', status);
    fetch(`/api/browse?${params}`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setTotal(d.pageInfo?.total || 0);
      setLoading(false);
    });
  }, [sort, page, genre, year, format, status]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Library</h1>
          <p className="text-sm text-zinc-500">Browse the full anime collection</p>
        </div>

        <FilterBar
          sort={sort} setSort={(v) => { setSort(v); setPage(1); }}
          genre={genre} setGenre={(v) => { setGenre(v); setPage(1); }}
          year={year} setYear={(v) => { setYear(v); setPage(1); }}
          format={format} setFormat={(v) => { setFormat(v); setPage(1); }}
          status={status} setStatus={(v) => { setStatus(v); setPage(1); }}
        />

        <div className="mb-4 text-sm text-zinc-400">
          {loading ? 'Loading...' : `${total.toLocaleString()} anime found`}
        </div>

        {loading ? (
          <AnimeGridSkeleton count={36} />
        ) : items.length > 0 ? (
          <>
            <AnimeGrid items={items} />
            <Pagination page={page} lastPage={Math.ceil(total / 36)} onPage={setPage} />
          </>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            <div className="text-lg mb-2">No anime match these filters</div>
            <button onClick={() => { setGenre(''); setYear(''); setFormat(''); setStatus(''); setSort('trending'); setPage(1); }}
              className="text-rose-400 hover:text-rose-300 text-sm">Clear all filters</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <LibraryContent />
    </Suspense>
  );
}
