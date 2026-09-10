'use client';

interface Stats {
  animeCount: number;
  episodeCount: number;
  characterCount: number;
  releasingCount: number;
}

export function IndexStrip({ stats }: { stats: Stats }) {
  const items = [
    { label: 'Titles indexed', value: stats.animeCount.toLocaleString(), color: 'var(--cobalt)' },
    { label: 'Episodes cataloged', value: stats.episodeCount.toLocaleString(), color: 'var(--signal)' },
    { label: 'Characters tracked', value: stats.characterCount.toLocaleString(), color: 'var(--mint)' },
    { label: 'Currently airing', value: stats.releasingCount.toLocaleString(), color: 'var(--yellow)' },
    { label: 'Data providers', value: '5', color: 'var(--lilac)' },
  ];

  return (
    <section className="my-6 md:my-8">
      <div className="bg-[var(--paper-strong)] border border-[var(--line)] rounded-2xl p-5 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {items.map((it, i) => (
            <div key={i} className="text-center md:text-left">
              <div className="font-display font-black text-2xl md:text-3xl mb-1" style={{ color: it.color }}>
                {it.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)]">
                {it.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
