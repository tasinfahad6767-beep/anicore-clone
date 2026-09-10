'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Play, Calendar, Clock, Tv } from 'lucide-react';

export default function AnimeDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/anime/${slug}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-zinc-600">Loading...</div></div>;
  if (!data?.anime) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-zinc-600">Anime not found</div></div>;

  const a = data.anime;
  const genres: string[] = typeof a.genres === 'string' ? JSON.parse(a.genres) : a.genres || [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Banner */}
      {a.banner_url && (
        <div className="relative h-[300px] w-full overflow-hidden">
          <img src={a.banner_url} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6 -mt-32 relative">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="flex gap-6">
          {/* Poster */}
          <div className="w-48 shrink-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800">
              {a.poster_url && <img src={a.poster_url} alt={a.title} className="w-full h-full object-cover" />}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-1">{a.title_english || a.title}</h1>
            {a.title_native && <p className="text-zinc-500 text-sm mb-3">{a.title_native}</p>}
            
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              {a.score_average && <span className="flex items-center gap-1 text-amber-400"><Star className="w-4 h-4" /> {a.score_average.toFixed(1)}</span>}
              {a.format && <span className="flex items-center gap-1 text-zinc-400"><Tv className="w-4 h-4" /> {a.format}</span>}
              {a.season_year && <span className="flex items-center gap-1 text-zinc-400"><Calendar className="w-4 h-4" /> {a.season} {a.season_year}</span>}
              {a.duration_minutes && <span className="flex items-center gap-1 text-zinc-400"><Clock className="w-4 h-4" /> {a.duration_minutes} min</span>}
              <span className="text-zinc-400">{a.episode_count || a.episodes_known || '?'} episodes</span>
              <span className={`px-2 py-0.5 rounded text-xs ${a.status === 'RELEASING' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>{a.status}</span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map(g => <span key={g} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-400">{g}</span>)}
              </div>
            )}

            {/* Synopsis */}
            {a.synopsis && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 text-zinc-300">Synopsis</h2>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-6">{a.synopsis}</p>
              </div>
            )}

            {/* Scores */}
            <div className="flex gap-4 mb-6">
              {a.score_anilist && <div className="bg-zinc-900 rounded-lg p-3 text-center"><div className="text-xl font-bold text-blue-400">{a.score_anilist}</div><div className="text-xs text-zinc-500">AniList</div></div>}
              {a.score_mal && <div className="bg-zinc-900 rounded-lg p-3 text-center"><div className="text-xl font-bold text-amber-400">{a.score_mal}</div><div className="text-xs text-zinc-500">MAL</div></div>}
              {a.mal_rank && <div className="bg-zinc-900 rounded-lg p-3 text-center"><div className="text-xl font-bold text-purple-400">#{a.mal_rank}</div><div className="text-xs text-zinc-500">MAL Rank</div></div>}
              {a.mal_members && <div className="bg-zinc-900 rounded-lg p-3 text-center"><div className="text-xl font-bold text-rose-400">{(a.mal_members / 1000000).toFixed(1)}M</div><div className="text-xs text-zinc-500">Members</div></div>}
            </div>

            {/* Streaming links */}
            {data.streaming?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 text-zinc-300">Where to Watch</h2>
                <div className="flex flex-wrap gap-2">
                  {data.streaming.map((s: any, i: number) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener" className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-rose-500/50 text-sm">
                      <Play className="w-3 h-3 text-rose-400" /> {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            {data.external?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {data.external.map((e: any, i: number) => (
                  <a key={i} href={e.url} target="_blank" rel="noopener" className="text-xs text-blue-400 hover:underline">{e.name}</a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Episodes */}
        {data.episodes?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Episodes ({data.episodes.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.episodes.slice(0, 30).map((ep: any) => (
                <div key={ep.id} className="flex gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-3 hover:border-zinc-700">
                  {ep.thumbnail_url && <img src={ep.thumbnail_url} alt="" className="w-24 h-14 object-cover rounded shrink-0" loading="lazy" />}
                  <div className="min-w-0">
                    <div className="text-xs font-medium">Episode {ep.number}</div>
                    {ep.title && <div className="text-xs text-zinc-400 truncate">{ep.title}</div>}
                    {ep.air_date && <div className="text-[10px] text-zinc-600">{ep.air_date}</div>}
                  </div>
                </div>
              ))}
            </div>
            {data.episodes.length > 30 && <div className="text-center mt-3 text-sm text-zinc-500">+ {data.episodes.length - 30} more episodes</div>}
          </div>
        )}

        {/* Characters */}
        {data.characters?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {data.characters.slice(0, 18).map((ch: any) => (
                <div key={ch.id} className="text-center">
                  {ch.image_url ? (
                    <img src={ch.image_url} alt={ch.name} className="w-full aspect-square object-cover rounded-lg border border-zinc-800" loading="lazy" />
                  ) : (
                    <div className="w-full aspect-square bg-zinc-900 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-700 text-xs">No img</div>
                  )}
                  <div className="text-xs mt-1 truncate">{ch.name}</div>
                  <div className="text-[10px] text-zinc-600">{ch.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Recommendations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {data.recommendations.slice(0, 12).map((r: any, i: number) => (
                <Link key={i} href={`/anime/${r.recommended_slug}`} className="group block">
                  {r.recommended_poster && <img src={r.recommended_poster} alt={r.recommended_title} className="w-full aspect-[2/3] object-cover rounded-lg border border-zinc-800 group-hover:border-rose-500/50" loading="lazy" />}
                  <div className="text-xs mt-1 truncate">{r.recommended_title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
