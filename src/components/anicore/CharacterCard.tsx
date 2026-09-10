'use client';
import type { Character } from '@/lib/anicore/db';

export function CharacterCard({ character: ch }: { character: Character }) {
  return (
    <div className="group text-center">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-rose-500/40 transition-colors">
        {ch.image_url ? (
          <img src={ch.image_url} alt={ch.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">{ch.name}</div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            ch.role === 'MAIN' ? 'text-rose-400' : ch.role === 'SUPPORTING' ? 'text-blue-400' : 'text-zinc-400'
          }`}>{ch.role}</span>
        </div>
      </div>
      <div className="text-xs mt-1.5 font-medium truncate text-zinc-200">{ch.name}</div>
      {ch.favorites && (
        <div className="text-[10px] text-zinc-600">{ch.favorites.toLocaleString()} fav</div>
      )}
    </div>
  );
}
