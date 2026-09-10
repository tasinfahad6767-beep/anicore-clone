'use client';
import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

const SORTS = [
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'score', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A-Z' },
];

const FORMATS = ['TV', 'TV_SHORT', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC'];
const STATUSES = [
  { value: '', label: 'Any Status' },
  { value: 'RELEASING', label: 'Currently Airing' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'NOT_YET_RELEASED', label: 'Upcoming' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export function FilterBar({
  sort, setSort, genre, setGenre, year, setYear, format, setFormat, status, setStatus,
}: {
  sort: string; setSort: (v: string) => void;
  genre: string; setGenre: (v: string) => void;
  year: string; setYear: (v: string) => void;
  format: string; setFormat: (v: string) => void;
  status: string; setStatus: (v: string) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/api/genres').then(r => r.json()).then(d => setGenres(d.genres || []));
    fetch('/api/filters').then(r => r.json()).then(d => setYears(d.years || []));
  }, []);

  const activeCount = [genre, format, status].filter(Boolean).length;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          {SORTS.map(s => (
            <button key={s.value} onClick={() => setSort(s.value)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${sort === s.value ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
              {s.label}
            </button>
          ))}
        </div>

        <button onClick={() => setShowFilters(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[10px]">{activeCount}</span>
          )}
        </button>

        {activeCount > 0 && (
          <button onClick={() => { setGenre(''); setYear(''); setFormat(''); setStatus(''); }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="mt-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
              <option value="">All Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
              <option value="">All Years</option>
              {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
              <option value="">All Formats</option>
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
