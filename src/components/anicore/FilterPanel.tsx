'use client';
import { useEffect, useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const SORTS = [
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Most popular' },
  { value: 'score', label: 'Highest rated' },
  { value: 'newest', label: 'Newest first' },
  { value: 'az', label: 'A → Z' },
];

const FORMATS = ['TV', 'TV_SHORT', 'MOVIE', 'OVA', 'ONA', 'SPECIAL', 'MUSIC'];
const STATUSES = [
  { value: '', label: 'Any status' },
  { value: 'RELEASING', label: 'Currently airing' },
  { value: 'FINISHED', label: 'Finished' },
  { value: 'NOT_YET_RELEASED', label: 'Upcoming' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface Props {
  sort: string; setSort: (v: string) => void;
  genre: string; setGenre: (v: string) => void;
  year: string; setYear: (v: string) => void;
  format: string; setFormat: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  query?: string; setQuery?: (v: string) => void;
}

export function FilterPanel({
  sort, setSort, genre, setGenre, year, setYear, format, setFormat, status, setStatus,
  query, setQuery,
}: Props) {
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    fetch('/api/genres').then(r => r.json()).then(d => setGenres(d.genres || []));
    fetch('/api/filters').then(r => r.json()).then(d => setYears(d.years || []));
  }, []);

  const activeCount = [genre, format, status].filter(Boolean).length;
  const clearAll = () => { setGenre(''); setYear(''); setFormat(''); setStatus(''); };

  return (
    <div className="bg-[var(--paper-strong)] border border-[var(--line)] rounded-2xl p-4 md:p-5 mb-6">
      {/* Search + Sort row */}
      <div className="flex flex-col md:flex-row gap-3 mb-3">
        {setQuery && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
            <input
              type="text" value={query || ''} onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter the catalog…"
              className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-full pl-10 pr-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--cobalt)] focus:outline-none"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] hidden sm:block">Sort by</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-[var(--paper)] border border-[var(--line)] rounded-full px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--cobalt)] focus:outline-none">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <button onClick={() => setShowAdvanced(s => !s)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-colors ${
              showAdvanced || activeCount > 0
                ? 'bg-[var(--cobalt)] text-white border-transparent'
                : 'bg-[var(--paper)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--cobalt)]'
            }`}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            {activeCount > 0 && <span className="bg-white text-[var(--cobalt)] rounded-full px-1.5 text-[10px] font-bold">{activeCount}</span>}
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[var(--line)] fade-in">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] font-semibold">Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}
              className="w-full mt-1 bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2 py-1.5 text-xs text-[var(--ink)]">
              <option value="">All genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] font-semibold">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)}
              className="w-full mt-1 bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2 py-1.5 text-xs text-[var(--ink)]">
              <option value="">All years</option>
              {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] font-semibold">Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}
              className="w-full mt-1 bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2 py-1.5 text-xs text-[var(--ink)]">
              <option value="">All formats</option>
              {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] font-semibold">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2 py-1.5 text-xs text-[var(--ink)]">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--line)]">
          {genre && <Chip label={genre} onRemove={() => setGenre('')} />}
          {year && <Chip label={year} onRemove={() => setYear('')} />}
          {format && <Chip label={format} onRemove={() => setFormat('')} />}
          {status && <Chip label={STATUSES.find(s => s.value === status)?.label || status} onRemove={() => setStatus('')} />}
          <button onClick={clearAll} className="text-xs text-[var(--signal)] hover:underline font-mono uppercase tracking-wider ml-1 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--cobalt)]/10 text-[var(--cobalt)] border border-[var(--cobalt)]/20 rounded-full text-[11px] font-mono uppercase tracking-wider">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-[var(--signal)]">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
