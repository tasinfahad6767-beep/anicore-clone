'use client';
import Link from 'next/link';

interface Anime {
  id: number; slug: string; title: string; title_english: string | null;
  poster_url: string | null; score_average: number | null;
  season_year: number | null; format: string | null;
  genres: string[]; status: string | null; episode_count: number | null;
}

export function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link href={`/anime/${anime.slug}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 group-hover:border-rose-500/50 transition-colors">
        {anime.poster_url ? (
          <img src={anime.poster_url} alt={anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">No image</div>
        )}
        {anime.score_average && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-amber-400">
            ★ {anime.score_average.toFixed(1)}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="text-xs font-medium truncate">{anime.title}</div>
          {anime.season_year && <div className="text-[10px] text-zinc-400">{anime.season_year} · {anime.format}</div>}
        </div>
      </div>
      <div className="mt-1.5">
        <div className="text-xs font-medium truncate text-zinc-200">{anime.title_english || anime.title}</div>
        <div className="text-[10px] text-zinc-500">{anime.season_year} · {anime.format} · {anime.episode_count || '?'} eps</div>
      </div>
    </Link>
  );
}
