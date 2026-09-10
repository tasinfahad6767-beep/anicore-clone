'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Stats {
  animeCount: number;
  episodeCount: number;
  characterCount: number;
  releasingCount: number;
}

export function MotionFeature({ stats }: { stats: Stats }) {
  const tags = [
    `${stats.animeCount.toLocaleString()} titles`,
    '5 providers',
    `${stats.episodeCount.toLocaleString()} episodes`,
    `${stats.characterCount.toLocaleString()} characters`,
    'Kitsu · AniList · MAL · TVDB · TMDB',
  ];

  return (
    <section className="my-12 md:my-16">
      <div className="bg-[var(--paper-strong)] border border-[var(--line)] rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'var(--cobalt)' }} />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'var(--signal)' }} />
        <div className="relative max-w-3xl">
          <p className="section-kicker">Dimensional discovery</p>
          <h2 className="font-display text-3xl md:text-5xl font-black text-[var(--ink)] leading-tight mb-4">
            The catalog has depth.
          </h2>
          <p className="text-[var(--ink-soft)] text-base md:text-lg mb-6 leading-relaxed">
            Every poster is more than an image. It opens into episodes, people, relations, provider records, artwork, trailers, and the community trail around a title. Five providers unified into one living index — no friction, no jumping between tabs.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((t, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider"
                style={{
                  background: i % 2 === 0 ? 'var(--cobalt)' : 'var(--paper)',
                  color: i % 2 === 0 ? 'white' : 'var(--ink)',
                  border: `1px solid ${i % 2 === 0 ? 'transparent' : 'var(--line)'}`,
                }}>
                {t}
              </span>
            ))}
          </div>
          <Link href="/library" className="btn-outline">
            Enter the catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
