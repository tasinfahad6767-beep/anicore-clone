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
  const [loading, setLoading] = useState(!initialItems);
  const [page, setPage] = useState(1);
  const [totalState, setTotalState] = useState(total);
  const [sort, setSort] = useState('score');
  const [format, setFormat] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [genre, setGenre] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
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
  }, [sort, page, format, yearFrom, genre, query]);

  const lastPage = Math.ceil(totalState / 24);

  return (
    <section className="browse-section" id="browse" aria-busy={loading}>
      <div className="section-heading browse-heading">
        <div>
          <p className="section-kicker">Advanced discovery</p>
          <h2>Tune the signal</h2>
        </div>
        <p>Filter the whole index, not a hand-picked shelf.</p>
      </div>

      <FilterPanel
        sort={sort} setSort={(v) => { setSort(v); setPage(1); }}
        format={format} setFormat={(v) => { setFormat(v); setPage(1); }}
        yearFrom={yearFrom} setYearFrom={(v) => { setYearFrom(v); setPage(1); }}
        query={query} setQuery={(v) => { setQuery(v); setPage(1); }}
        genre={genre} setGenre={(v) => { setGenre(v); setPage(1); }}
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
