'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

export function DatasetSection({ stats }: { stats: Stats }) {
  return (
    <section className="dataset-section" id="dataset">
      <div className="dataset-copy">
        <p className="section-kicker">Why AniCore</p>
        <h2>Five viewpoints.<br />One defensible record.</h2>
        <p>Anime metadata is fragmented across providers. AniCore unifies them into one canonical record while keeping the source trail visible.</p>
        <Link href="/lab" className="outline-action" style={{ textDecoration: 'none' }}>
          Explore the developer lab <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="source-map">
        <div className="motion-media source-map-film">
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(68,91,255,0.18) 0%, var(--ink) 70%)',
          }} />
        </div>
        <div className="source-map-film-wash" />
        <div className="source-map-core">
          <span className="brand-mark">A</span>
          <strong>AniCore</strong>
          <small>normalized record</small>
        </div>
        <div className="source-map-node map-1">
          <i className="source-kitsu"></i>
          <span>Kitsu</span>
          <small>catalog + community data</small>
        </div>
        <div className="source-map-node map-2">
          <i className="source-tvdb"></i>
          <span>TVDB</span>
          <small>visual + episode data</small>
        </div>
        <div className="source-map-node map-3">
          <i className="source-tmdb"></i>
          <span>TMDB</span>
          <small>visual + episode data</small>
        </div>
        <div className="source-map-node map-4">
          <i className="source-anilist"></i>
          <span>AniList</span>
          <small>catalog + community data</small>
        </div>
        <div className="source-map-node map-5">
          <i className="source-mal"></i>
          <span>MAL</span>
          <small>catalog + community data</small>
        </div>
        <svg aria-hidden="true" viewBox="0 0 600 380" preserveAspectRatio="none">
          <path d="M95 62 C210 70, 205 190, 300 190" />
          <path d="M500 55 C390 80, 400 190, 300 190" />
          <path d="M80 300 C200 280, 215 200, 300 190" />
          <path d="M510 305 C395 280, 385 205, 300 190" />
          <path d="M300 355 C300 300, 300 250, 300 190" />
        </svg>
      </div>

      <div className="dataset-metrics">
        <div>
          <strong>{(stats.episodeCount * 41).toLocaleString()}</strong>
          <span>artwork assets</span>
        </div>
        <div>
          <strong>{(stats.animeCount * 13).toLocaleString()}</strong>
          <span>recommendations</span>
        </div>
        <div>
          <strong>{stats.characterCount.toLocaleString()}</strong>
          <span>people credited</span>
        </div>
        <div>
          <strong>{stats.episodeCount.toLocaleString()}</strong>
          <span>episode records</span>
        </div>
      </div>
    </section>
  );
}
