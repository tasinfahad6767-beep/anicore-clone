'use client';

const GENRES = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Romance', 'Adventure', 'Slice of Life', 'Mystery', 'Supernatural', 'Sports', 'Horror'];
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2010, 2005, 2000];
const SORTS = [
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'score', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export function FilterBar({ sort, setSort, genre, setGenre, year, setYear }: {
  sort: string; setSort: (v: string) => void;
  genre: string; setGenre: (v: string) => void;
  year: string; setYear: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div className="flex gap-1">
        {SORTS.map(s => (
          <button key={s.value} onClick={() => setSort(s.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${sort === s.value ? 'bg-rose-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <select value={genre} onChange={(e) => setGenre(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white">
        <option value="">All Genres</option>
        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
      </select>
      <select value={year} onChange={(e) => setYear(e.target.value)}
        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white">
        <option value="">All Years</option>
        {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
      </select>
    </div>
  );
}
