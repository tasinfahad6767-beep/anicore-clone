'use client';
import { useEffect, useState } from 'react';
import { FilterPanel } from './FilterPanel';
import { AnimeCard } from './AnimeCard';
import { Pagination } from './Pagination';
import type { Anime } from '@/lib/anicore/db';

interface GenreCount { genre: string; count: number; }
interface Props {
  initialItems?: Anime[];
  total: number;
  genres: GenreCount[];
}

export function BrowseSection({ initialItems, total, genres }: Props) {
  const [items, setItems] = useState<Anime[]>(initialItems || []);
  const [loading, setLoading] = useState(false); // not loading if we have initialItems
  const [page, setPage] = useState(1);
  const [totalState, setTotalState] = useState(total);
  const [sort, setSort] = useState('score');
  const [format, setFormat] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [genre, setGenre] = useState('');
  const [query, setQuery] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Skip the initial fetch if we have initialItems and user hasn't interacted yet
    if (initialItems && !hasInteracted) return;
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page), perPage: '24' });
    if (format) params.set('format', format);
    if (yearFrom) params.set('yearFrom', yearFrom);
    if (genre) params.set('genre', genre);
    if (query) params.set('q', query);
    fetch(`/api/browse?${params}`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setTotalState(d.pageInfo?.total || 0);
      setLoading(false);
    });
  }, [sort, page, format, yearFrom, genre, query, hasInteracted, initialItems]);

  // Mark as interacted when user changes filters
  const updateSort = (v: string) => { setHasInteracted(true); setSort(v); setPage(1); };
  const updateFormat = (v: string) => { setHasInteracted(true); setFormat(v); setPage(1); };
  const updateYearFrom = (v: string) => { setHasInteracted(true); setYearFrom(v); setPage(1); };
  const updateGenre = (v: string) => { setHasInteracted(true); setGenre(v); setPage(1); };
  const updateQuery = (v: string) => { setHasInteracted(true); setQuery(v); setPage(1); };

  const lastPage = Math.ceil(totalState / 24);

  return (
    <section className="browse-section" id="browse" aria-busy={loading}>
      <div className="section-heading browse-heading">
        <div>
          <p className="section-kicker">Full catalog</p>
          <h2>Filter the catalog</h2>
        </div>
        <p>Sort, filter, and search the entire catalog.</p>
      </div>

      <FilterPanel
        sort={sort} setSort={updateSort}
        format={format} setFormat={updateFormat}
        yearFrom={yearFrom} setYearFrom={updateYearFrom}
        query={query} setQuery={updateQuery}
        genre={genre} setGenre={updateGenre}
        genres={genres}
        total={totalState}
      />

      <div className="browse-grid">
        {loading ? (
          Array.from({ length: 18 }).map((_, i) => (
            <article key={i} className="anime-card">
              <div className="poster-wrap" style={{ background: 'var(--paper)', animation: 'shimmer 1.5s infinite' }}>
                <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
              </div>
              <div className="card-copy">
                <div className="skeleton" style={{ height: '12px', width: '80%', marginTop: '8px' }} />
                <div className="skeleton" style={{ height: '8px', width: '60%', marginTop: '6px' }} />
              </div>
            </article>
          ))
        ) : items.length > 0 ? (
          items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
            No anime match these filters.
          </div>
        )}
      </div>

      <Pagination page={page} lastPage={lastPage} onPage={setPage} />
    </section>
  );
}
