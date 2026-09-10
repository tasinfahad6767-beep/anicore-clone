'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { FilterPanel } from '@/components/anicore/FilterPanel';
import { Pagination } from '@/components/anicore/Pagination';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import type { Anime } from '@/lib/anicore/db';

interface GenreCount { genre: string; count: number; }
interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function LibraryPage() {
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(30);
  const [sort, setSort] = useState('score');
  const [format, setFormat] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [genre, setGenre] = useState('');
  const [query, setQuery] = useState('');
  const [genres, setGenres] = useState<GenreCount[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(d => {
      setGenres(d.genres || []);
      setStats(d.stats);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      sort, page: String(page), perPage: String(perPage),
    });
    if (format) params.set('format', format);
    if (yearFrom) params.set('yearFrom', yearFrom);
    if (genre) params.set('genre', genre);
    if (query) params.set('q', query);
    fetch(`/api/browse?${params}`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setTotal(d.pageInfo?.total || 0);
      setLoading(false);
    });
  }, [sort, page, format, yearFrom, genre, query, perPage]);

  const lastPage = Math.ceil(total / perPage);

  return (
    <div className="inner-page library-page">
      {/* Page hero */}
      <section className="page-hero library-hero">
        <div>
          <p className="section-kicker">Personal catalog</p>
          <h1>My <em>library.</em></h1>
          <p>Filter the whole index, not a hand-picked shelf. Sort by score, popularity, or recency. Find exactly what you&apos;re looking for across {stats ? stats.animeCount.toLocaleString() : '—'} titles.</p>
        </div>
        <div className="library-hero-stats">
          <div className="library-stat-bubble">
            <span>Total titles</span>
            <strong>{stats ? stats.animeCount.toLocaleString() : '—'}</strong>
            <small>Indexed</small>
          </div>
          <div className="library-stat-bubble highlight">
            <span>Currently showing</span>
            <strong>{total.toLocaleString()}</strong>
            <small>Match filters</small>
          </div>
          <div className="library-stat-bubble">
            <span>Genres</span>
            <strong>{genres.length}</strong>
            <small>Tags</small>
          </div>
        </div>
      </section>

      {/* Filter panel */}
      <FilterPanel
        sort={sort} setSort={(v) => { setSort(v); setPage(1); }}
        format={format} setFormat={(v) => { setFormat(v); setPage(1); }}
        yearFrom={yearFrom} setYearFrom={(v) => { setYearFrom(v); setPage(1); }}
        query={query} setQuery={(v) => { setQuery(v); setPage(1); }}
        genre={genre} setGenre={(v) => { setGenre(v); setPage(1); }}
        genres={genres}
        total={total}
      />

      {/* Result count */}
      <div style={{ maxWidth: 'var(--page)', margin: '24px auto 16px', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <p style={{ fontFamily: 'var(--utility)', fontSize: 11, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
          {loading ? 'Loading…' : `Showing ${items.length} of ${total.toLocaleString()} matches`}
        </p>
        <p style={{ fontFamily: 'var(--utility)', fontSize: 10, color: 'var(--ink-soft)', margin: 0 }}>
          Page {page} / {lastPage || 1}
        </p>
      </div>

      {/* Grid */}
      <section className="browse-section" id="browse" aria-busy={loading} style={{ paddingTop: 0, paddingBottom: 60 }}>
        <div className="browse-grid">
          {loading ? (
            Array.from({ length: 18 }).map((_, i) => (
              <article key={i} className="anime-card">
                <div className="poster-wrap skeleton" />
                <div className="card-copy">
                  <div className="skeleton" style={{ height: 12, marginTop: 8, width: '80%' }} />
                  <div className="skeleton" style={{ height: 8, marginTop: 6, width: '60%' }} />
                </div>
              </article>
            ))
          ) : items.length > 0 ? (
            items.map((a, i) => <AnimeCard key={`${a.id}-${i}`} anime={a} />)
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '64px 0', color: 'var(--ink-soft)' }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No anime match these filters.</p>
              <button
                onClick={() => { setFormat(''); setYearFrom(''); setGenre(''); setQuery(''); setSort('score'); setPage(1); }}
                className="outline-action"
                style={{ marginTop: 16, textDecoration: 'none', cursor: 'pointer', background: 'transparent' }}
              >
                <ArrowLeft className="w-4 h-4" /> Clear all filters
              </button>
            </div>
          )}
        </div>

        <Pagination page={page} lastPage={lastPage} onPage={setPage} />
      </section>
    </div>
  );
}
