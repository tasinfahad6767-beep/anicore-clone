'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function MotionFeature({ stats }: { stats: Stats }) {
  return (
    <section className="motion-feature discovery-motion" aria-labelledby="living-catalog-title">
      <div className="motion-feature-copy">
        <p className="section-kicker">Dimensional discovery</p>
        <h2 id="living-catalog-title">The catalog has depth.</h2>
        <p>Every poster is more than an image. It opens into episodes, people, relations, provider records, artwork, trailers, and the community trail around a title.</p>
        <div className="motion-feature-tags" aria-label="Anime record dimensions">
          <span>{stats.animeCount.toLocaleString()} titles</span>
          <span>5 providers</span>
          <span>{fmt(stats.episodeCount)} episodes</span>
          <span>{fmt(stats.characterCount)} characters</span>
        </div>
        <Link href="/library" className="outline-action" style={{ textDecoration: 'none' }}>
          Enter the catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="motion-stage poster-motion-stage">
        <div className="motion-media">
          {/* Static poster fallback (we don't host the original mp4/webm) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #1a1f33 0%, #2b3258 50%, #445bff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.1)', fontFamily: 'var(--display)', fontSize: '200px', fontWeight: 800,
          }}>A</div>
        </div>
        <div className="motion-stage-label">
          <span>Living catalog</span>
          <strong>Records in relation</strong>
        </div>
      </div>
    </section>
  );
}
