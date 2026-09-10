'use client';
import { useState, useEffect } from 'react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { SearchBar } from '@/components/anicore/SearchBar';
import { FilterBar } from '@/components/anicore/FilterBar';

interface Anime {
  id: number; slug: string; title: string; title_english: string | null;
  poster_url: string | null; score_average: number | null;
  season_year: number | null; format: string | null;
  genres: string[]; status: string | null; episode_count: number | null;
}

export default function Home() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('trending');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery) {
      fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=50`)
        .then(r => r.json())
        .then(d => { setAnime(d.items || []); setTotal(d.items?.length || 0); setLoading(false); });
    } else {
      setLoading(true);
      fetch(`/api/browse?sort=${sort}&page=${page}&perPage=24${genre ? `&genre=${genre}` : ''}${year ? `&year=${year}` : ''}`)
        .then(r => r.json())
        .then(d => { setAnime(d.items || []); setTotal(d.pageInfo?.total || 0); setLoading(false); });
    }
  }, [sort, page, genre, year, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
            AniCore
          </h1>
          <div className="flex-1 max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {!searchQuery && (
          <FilterBar sort={sort} setSort={setSort} genre={genre} setGenre={setGenre} year={year} setYear={setYear} />
        )}

        <div className="mb-4 text-sm text-zinc-400">
          {loading ? 'Loading...' : `${total.toLocaleString()} anime${searchQuery ? ' found' : ''}`}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-900 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {anime.map(a => <AnimeCard key={a.id} anime={a} />)}
            </div>
            {!searchQuery && total > 24 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700">Prev</button>
                <span className="px-4 py-2 text-zinc-400">Page {page}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={anime.length < 24}
                  className="px-4 py-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700">Next</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
