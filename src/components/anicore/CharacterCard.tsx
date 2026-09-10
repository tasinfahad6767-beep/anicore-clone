'use client';
import type { Character } from '@/lib/anicore/db';

export function CharacterCard({ character: ch }: { character: Character }) {
  const roleColor = ch.role === 'MAIN' ? 'var(--signal)' : ch.role === 'SUPPORTING' ? 'var(--cobalt)' : 'var(--ink-soft)';
  return (
    <div className="group text-center">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--paper-strong)] border border-[var(--line)] group-hover:border-[var(--cobalt)] transition-colors">
        {ch.image_url ? (
          <img src={ch.image_url} alt={ch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-xs font-mono p-2">{ch.name}</div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/40 to-transparent p-2 pt-6">
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: roleColor, color: ch.role === 'MAIN' ? 'var(--on-signal)' : 'white' }}>
            {ch.role}
          </span>
        </div>
      </div>
      <div className="font-body text-xs font-semibold mt-1.5 truncate text-[var(--ink)]">{ch.name}</div>
      {ch.favorites && (
        <div className="font-mono text-[10px] text-[var(--ink-soft)]">{ch.favorites.toLocaleString()} fav</div>
      )}
    </div>
  );
}
