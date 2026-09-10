'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import type { Anime } from '@/lib/anicore/db';

interface Props {
  anime: Anime;
  rank?: number;
  showSources?: boolean;
  wide?: boolean;
}

function isInList(id: number): boolean {
  try { return JSON.parse(localStorage.getItem('anicore-list') || '[]').includes(id); } catch { return false; }
}

function toggleList(id: number): boolean {
  try {
    const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
    const idx = list.indexOf(id);
    let added: boolean;
    if (idx >= 0) { list.splice(idx, 1); added = false; }
    else { list.push(id); added = true; }
    localStorage.setItem('anicore-list', JSON.stringify(list));
    window.dispatchEvent(new Event('anicore-list-changed'));
    return added;
  } catch { return false; }
}

export function AnimeCard({ anime, rank, showSources = true, wide = false }: Props) {
  const [inList, setInList] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const title = anime.title_english || anime.title;

  useEffect(() => { setInList(isInList(anime.id)); }, [anime.id]);

  const handleList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInList(toggleList(anime.id));
  };

  const sourcesArr: string[] = anime.sources || [];
  const hasSource = (name: string) => sourcesArr.some(s => typeof s === 'string' ? s.toLowerCase() === name.toLowerCase() : (s as any)?.slug?.toLowerCase() === name.toLowerCase());

  return (
    <article className={`anime-card ${wide ? 'anime-card-wide' : ''}`}>
      {/* card-hit is an absolute overlay button (sibling of poster-wrap + card-copy), matching AniCore structure */}
      <Link href={`/anime/${anime.slug}`} className="card-hit" aria-label={`Open ${title}`} style={{ textDecoration: 'none' }} />
      <div className="poster-wrap">
        {anime.poster_url ? (
          <img
            src={anime.poster_url}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            style={{ opacity: imgLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="poster-fallback">{(title || '?').charAt(0)}</div>
        )}
        {!imgLoaded && anime.poster_url && (
          <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />
        )}
        {rank != null && <span className="rank">#{String(rank).padStart(2, '0')}</span>}
        {anime.score_average != null && (
          <span className="score score-compact">
            <strong>{Math.round(anime.score_average)}</strong>
          </span>
        )}
        <button className={`save-button ${inList ? 'saved' : ''}`} aria-label={`Add ${title} to My List`} onClick={handleList}>
          {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      <div className="card-copy">
        {showSources && (
          <div className="source-constellation">
            <span className={`source-node source-kitsu ${hasSource('kitsu') ? 'active' : ''}`} title={hasSource('kitsu') ? 'Kitsu source available' : 'Kitsu not linked'}><i></i></span>
            <span className={`source-node source-tvdb ${hasSource('tvdb') ? 'active' : ''}`} title={hasSource('tvdb') ? 'TVDB source available' : 'TVDB not linked'}><i></i></span>
            <span className={`source-node source-tmdb ${hasSource('tmdb') ? 'active' : ''}`} title={hasSource('tmdb') ? 'TMDB source available' : 'TMDB not linked'}><i></i></span>
            <span className={`source-node source-anilist ${hasSource('anilist') ? 'active' : ''}`} title={hasSource('anilist') ? 'AniList source available' : 'AniList not linked'}><i></i></span>
            <span className={`source-node source-mal ${hasSource('mal') ? 'active' : ''}`} title={hasSource('mal') ? 'MAL source available' : 'MAL not linked'}><i></i></span>
          </div>
        )}
        <h3>{title}</h3>
        <p>
          {anime.season_year || '—'} · {(anime.format || 'TV').toLowerCase().charAt(0).toUpperCase() + (anime.format || 'TV').toLowerCase().slice(1)} · {anime.episode_count || anime.episodes_known || '?'} ep
        </p>
        {(anime.genres || []).slice(0, 2).length > 0 && (
          <div className="tag-row">
            {(anime.genres || []).slice(0, 2).map((g: any) => {
              const name = typeof g === 'string' ? g : (g?.name || '');
              return <span key={name}>{name}</span>;
            })}
          </div>
        )}
      </div>
    </article>
  );
}
