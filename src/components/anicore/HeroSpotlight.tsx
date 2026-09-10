'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  items: Anime[];
  totalAnime: number;
}

export function HeroSpotlight({ items, totalAnime }: Props) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 8000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  if (!items.length) {
    return <section className="hero"><div className="hero-art" style={{ height: 710, background: 'var(--paper-strong)' }} /></section>;
  }

  const a = items[idx];
  const titleLong = (a.title_english || a.title).length > 22;
  const score = a.score_average;

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className={`hero ${titleLong ? 'has-long-title' : ''} ${paused ? 'hero-is-paused' : ''}`}>
      {/* Art column */}
      <div className="hero-art" style={{ backgroundImage: `url("${a.banner_url || a.poster_url || ''}")` }}>
        <div className="hero-art-wash" />
        <div className="hero-art-caption">
          <span>This week</span>
          <strong>{String(idx + 1).padStart(2, '0')}</strong>
          <small>of {String(items.length).padStart(2, '0')}</small>
        </div>
        <div className="hero-switcher" aria-label="Weekly trending spotlight controls">
          <button aria-label="Previous weekly spotlight" onClick={() => setIdx(i => (i - 1 + items.length) % items.length)}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="hero-dots">
            {items.map((_, i) => (
              <button key={i} aria-label={`Show ${items[i].title_english || items[i].title}`}
                className={i === idx ? 'active' : ''} onClick={() => setIdx(i)}>
                <span />
              </button>
            ))}
          </div>
          <button aria-label="Next weekly spotlight" onClick={() => setIdx(i => (i + 1) % items.length)}>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button className="hero-pause" aria-label="Pause weekly spotlight" onClick={() => setPaused(p => !p)}>
            {paused ? '▶' : 'Ⅱ'}
          </button>
        </div>
      </div>

      {/* Content column */}
      <div className="hero-content" aria-live="polite">
        <p className="hero-kicker">
          <span>This week / {String(idx + 1).padStart(2, '0')}</span> trending across the index
        </p>
        <h1 className={`hero-weekly-title ${titleLong ? 'is-long' : ''}`}>
          {a.title_english || a.title}
        </h1>
        {a.title_native && a.title_native !== a.title_english && (
          <p className="hero-native-name">{a.title_native}</p>
        )}
        <div className="hero-weekly-meta">
          {a.status && <span>{a.status}</span>}
          {a.format && <span>{a.format}</span>}
          {a.season_year && <span>{a.season_year}</span>}
          {a.episode_count && <span>{a.episode_count} episodes</span>}
          {score != null && (
            <span className="score">
              <strong>{Math.round(score)}</strong>
              <small>/100</small>
            </span>
          )}
        </div>
        <p className="hero-intro">
          Search, trace, and save anime across five independent databases — resolved into one precise, human-friendly catalog.
        </p>

        <div className="search-shell">
          <form className="global-search" onSubmit={submitSearch}>
            <Search className="w-5 h-5" />
            <input
              id="global-search"
              name="search"
              placeholder={`Search ${totalAnime.toLocaleString()} anime, characters, studios…`}
              aria-label="Search the AniCore database"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <kbd>/</kbd>
            <button type="submit">Explore</button>
          </form>
        </div>

        <div className="hero-quick-actions">
          <Link href="/random">
            <Sparkles className="w-3.5 h-3.5" /> Pick for me
          </Link>
          <Link href="/library">
            Browse the full catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="hero-footnote">
          <div className="source-constellation with-labels">
            <span className="source-node source-kitsu active" title="Kitsu source available"><i></i><b>Kitsu</b></span>
            <span className="source-node source-tvdb active" title="TVDB source available"><i></i><b>TVDB</b></span>
            <span className="source-node source-tmdb active" title="TMDB source available"><i></i><b>TMDB</b></span>
            <span className="source-node source-anilist active" title="AniList source available"><i></i><b>AniList</b></span>
            <span className="source-node source-mal active" title="MAL source available"><i></i><b>MAL</b></span>
          </div>
          <span>Unified across Kitsu, TVDB, TMDB, AniList &amp; MAL</span>
        </div>
      </div>

      {/* Feature bar (bottom of hero-art) */}
      <Link href={`/anime/${a.slug}`} className="hero-feature" style={{ textDecoration: 'none' }}>
        <span className="feature-index">Weekly / {String(idx + 1).padStart(2, '0')}</span>
        <div>
          <small>Open this week&apos;s full record</small>
          <strong>{a.title_english || a.title}</strong>
          {a.title_native && <span>{a.title_native}</span>}
        </div>
        {score != null && (
          <span className="score">
            <strong>{Math.round(score)}</strong>
            <small>/100</small>
          </span>
        )}
        <i>
          <ArrowRight className="w-5 h-5" />
        </i>
      </Link>
    </section>
  );
}
