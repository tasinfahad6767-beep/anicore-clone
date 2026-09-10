'use client';
import { useEffect, useState } from 'react';
import { Search, ArrowRight, X } from 'lucide-react';

interface Props {
  sort: string; setSort: (v: string) => void;
  format: string; setFormat: (v: string) => void;
  yearFrom: string; setYearFrom: (v: string) => void;
  query: string; setQuery: (v: string) => void;
  genre: string; setGenre: (v: string) => void;
  genres: Array<{ genre: string; count: number }>;
  total: number;
}

const SORTS = [
  { value: 'score', label: 'Highest rated' },
  { value: 'popularity', label: 'Most popular' },
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A → Z' },
];

const FORMATS = [
  { value: '', label: 'All formats' },
  { value: 'TV', label: 'TV series' },
  { value: 'MOVIE', label: 'Movies' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'SPECIAL', label: 'Specials' },
];

const YEAR_RANGES = [
  { value: '', label: 'Any year' },
  { value: '2025', label: '2025+' },
  { value: '2020', label: '2020+' },
  { value: '2010', label: '2010+' },
  { value: '2000', label: '2000+' },
  { value: '1990', label: '1990+' },
];

function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function FilterPanel({
  sort, setSort, format, setFormat, yearFrom, setYearFrom,
  query, setQuery, genre, setGenre, genres, total,
}: Props) {
  const activeFilters = [genre, format, yearFrom].filter(Boolean).length;
  const clearAll = () => { setGenre(''); setFormat(''); setYearFrom(''); };

  return (
    <>
      <div className="filter-panel">
        <label className="filter-search" htmlFor="filter-search">
          <span>Search</span>
          <div>
            <Search className="w-4 h-4" />
            <input
              id="filter-search"
              name="filter-search"
              placeholder="Title, synonym, native name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </label>
        <label htmlFor="filter-sort">
          <span>Sort by</span>
          <select id="filter-sort" name="filter-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label htmlFor="filter-format">
          <span>Format</span>
          <select id="filter-format" name="filter-format" value={format} onChange={(e) => setFormat(e.target.value)}>
            {FORMATS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </label>
        <label htmlFor="filter-year-from">
          <span>From year</span>
          <select id="filter-year-from" name="filter-year-from" value={yearFrom} onChange={(e) => setYearFrom(e.target.value)}>
            {YEAR_RANGES.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
          </select>
        </label>
        {activeFilters > 0 && (
          <button className="clear-filters" onClick={clearAll} style={{ border: 0, cursor: 'pointer' }}>
            <X className="w-3 h-3 inline" /> Clear ({activeFilters})
          </button>
        )}
      </div>

      <div className="genre-chips">
        <button className={!genre ? 'active' : ''} onClick={() => setGenre('')}>All <span>{fmtCount(total)}</span></button>
        {genres.slice(0, 20).map(g => (
          <button key={g.genre} className={genre === g.genre ? 'active' : ''} onClick={() => setGenre(genre === g.genre ? '' : g.genre)}>
            {g.genre} <span>{fmtCount(g.count)}</span>
          </button>
        ))}
      </div>
    </>
  );
}
