'use client';

interface Stats {
  animeCount: number;
  episodeCount: number;
  characterCount: number;
  releasingCount: number;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function IndexStrip({ stats }: { stats: Stats }) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

  return (
    <section className="index-strip" aria-label="AniCore database statistics">
      <div>
        <span>Titles indexed</span>
        <strong>{stats.animeCount.toLocaleString()}</strong>
      </div>
      <div>
        <span>Episode records</span>
        <strong>{fmt(stats.episodeCount)}</strong>
      </div>
      <div>
        <span>Characters mapped</span>
        <strong>{fmt(stats.characterCount)}</strong>
      </div>
      <div>
        <span>Source matches</span>
        <strong>5-way</strong>
      </div>
      <div className="strip-status">
        <i></i>
        <span>Index updated {today}</span>
      </div>
    </section>
  );
}
