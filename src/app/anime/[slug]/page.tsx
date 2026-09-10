'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Play, Calendar, Clock, Tv, ChevronDown, ChevronUp, ExternalLink, Users, Heart, Film, Link2 } from 'lucide-react';
import { EpisodeCard } from '@/components/anicore/EpisodeCard';
import { CharacterCard } from '@/components/anicore/CharacterCard';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { Footer } from '@/components/anicore/Footer';
import { DetailSkeleton } from '@/components/anicore/Skeletons';
import type { Anime, Episode, Character, StreamingLink, ExternalLink, Recommendation, Relation } from '@/lib/anicore/db';

interface FullData {
  anime: Anime;
  episodes: Episode[];
  characters: Character[];
  streaming: StreamingLink[];
  external: ExternalLink[];
  recommendations: Recommendation[];
  relations: Relation[];
}

export default function AnimeDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<FullData | null>(null);
  const [loading, setLoading] = useState(true);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [epLimit, setEpLimit] = useState(12);
  const [charFilter, setCharFilter] = useState<'ALL' | 'MAIN' | 'SUPPORTING'>('ALL');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/anime/${slug}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  if (!data?.anime) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="text-zinc-500 text-lg mb-4">Anime not found</div>
        <Link href="/" className="text-rose-400 hover:text-rose-300 text-sm">← Back to Library</Link>
      </div>
    </div>
  );

  const a = data.anime;
  const genres: string[] = a.genres || [];
  const synopsisLong = (a.synopsis?.length || 0) > 400;

  const filteredChars = data.characters.filter(c => {
    if (charFilter === 'ALL') return true;
    return c.role === charFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero banner */}
      {a.banner_url && (
        <div className="relative h-[400px] w-full overflow-hidden">
          <img src={a.banner_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/60 to-transparent" />
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-4 py-6 -mt-32 relative">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 text-sm bg-zinc-900/50 backdrop-blur px-3 py-1.5 rounded-lg border border-zinc-800">
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="w-48 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800 shadow-2xl shadow-black/50">
              {a.poster_url && <img src={a.poster_url} alt={a.title} className="w-full h-full object-cover" />}
            </div>
            {a.trailer_youtube_id && (
              <a href={`https://www.youtube.com/watch?v=${a.trailer_youtube_id}`} target="_blank" rel="noopener"
                className="mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-rose-500/50 text-sm text-zinc-300">
                <Play className="w-3 h-3 text-rose-400" /> Watch Trailer
              </a>
            )}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-black mb-1 leading-tight">{a.title_english || a.title}</h1>
            {a.title_native && a.title_native !== a.title_english && (
              <p className="text-zinc-500 text-sm mb-3">{a.title_native}</p>
            )}

            {/* Quick stats */}
            <div className="flex flex-wrap gap-3 mb-4 text-sm">
              {a.score_average && (
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {a.score_average.toFixed(2)}
                </span>
              )}
              {a.format && <span className="flex items-center gap-1 text-zinc-300"><Tv className="w-4 h-4" /> {a.format}</span>}
              {a.season_year && <span className="flex items-center gap-1 text-zinc-300"><Calendar className="w-4 h-4" /> {a.season} {a.season_year}</span>}
              {a.duration_minutes && <span className="flex items-center gap-1 text-zinc-300"><Clock className="w-4 h-4" /> {a.duration_minutes}m</span>}
              <span className="text-zinc-300">{a.episode_count || a.episodes_known || '?'} eps</span>
              <span className={`px-2 py-0.5 rounded text-xs ${
                a.status === 'RELEASING' ? 'bg-green-500/20 text-green-400' :
                a.status === 'FINISHED' ? 'bg-blue-500/20 text-blue-400' :
                a.status === 'NOT_YET_RELEASED' ? 'bg-purple-500/20 text-purple-400' :
                'bg-zinc-800 text-zinc-400'
              }`}>{a.status}</span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {genres.map(g => (
                  <Link key={g} href={`/genre/${encodeURIComponent(g.toLowerCase())}`}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-400 hover:border-rose-500/50 hover:text-rose-400">
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {a.synopsis && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Synopsis</h2>
                <p className={`text-sm text-zinc-400 leading-relaxed ${!synopsisExpanded && synopsisLong ? 'line-clamp-4' : ''}`}>{a.synopsis}</p>
                {synopsisLong && (
                  <button onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="text-xs text-rose-400 hover:text-rose-300 mt-1 flex items-center gap-1">
                    {synopsisExpanded ? 'Show less' : 'Read more'}
                    {synopsisExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
            )}

            {/* Score panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {a.score_anilist && (
                <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                  <div className="text-2xl font-bold text-blue-400">{a.score_anilist}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">AniList</div>
                </div>
              )}
              {a.score_mal && (
                <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                  <div className="text-2xl font-bold text-amber-400">{a.score_mal?.toFixed(2)}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">MAL Score</div>
                </div>
              )}
              {a.mal_rank && (
                <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                  <div className="text-2xl font-bold text-purple-400">#{a.mal_rank}</div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">MAL Rank</div>
                </div>
              )}
              {a.mal_members && (
                <div className="bg-zinc-900 rounded-lg p-3 text-center border border-zinc-800">
                  <div className="text-2xl font-bold text-rose-400">
                    {a.mal_members >= 1_000_000 ? `${(a.mal_members / 1_000_000).toFixed(1)}M` : `${(a.mal_members / 1000).toFixed(0)}K`}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500">Members</div>
                </div>
              )}
            </div>

            {/* Streaming links */}
            {data.streaming?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                  <Play className="w-3 h-3 text-rose-400" /> Where to Watch
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.streaming.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener"
                      className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-rose-500/50 text-sm">
                      <Play className="w-3 h-3 text-rose-400" />
                      <span className="text-white">{s.name}</span>
                      {s.quality && <span className="text-xs text-zinc-500">· {s.quality}</span>}
                      {s.language && <span className="text-xs text-zinc-500">· {s.language}</span>}
                      <ExternalLink className="w-3 h-3 text-zinc-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External links */}
            {data.external?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-2">
                  <Link2 className="w-3 h-3 text-blue-400" /> External Links
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.external.map((e, i) => (
                    <a key={i} href={e.url} target="_blank" rel="noopener"
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-500/5 border border-blue-500/20 rounded">
                      {e.name} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Watch button */}
        {data.episodes?.length > 0 && (
          <div className="mt-6 flex gap-3">
            <Link href={`/anime/${a.slug}/watch`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium text-sm transition-colors">
              <Play className="w-4 h-4 fill-white" /> Watch Now
            </Link>
            <Link href={`/anime/${a.slug}/watch?ep=${data.episodes[0].absolute_number || data.episodes[0].number}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-lg font-medium text-sm">
              Start from EP 1
            </Link>
          </div>
        )}

        {/* Episodes */}
        {data.episodes?.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Film className="w-4 h-4 text-rose-400" /> Episodes
                <span className="text-xs text-zinc-500">({data.episodes.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.episodes.slice(0, epLimit).map((ep) => (
                <EpisodeCard key={ep.id} episode={ep} anime={a} />
              ))}
            </div>
            {data.episodes.length > epLimit && (
              <div className="text-center mt-4">
                <button onClick={() => setEpLimit(epLimit + 12)}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:border-zinc-700">
                  Load more episodes ({data.episodes.length - epLimit} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Characters */}
        {data.characters?.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" /> Characters
                <span className="text-xs text-zinc-500">({data.characters.length})</span>
              </h2>
              <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                {(['ALL', 'MAIN', 'SUPPORTING'] as const).map(f => (
                  <button key={f} onClick={() => setCharFilter(f)}
                    className={`px-3 py-1 rounded-md text-xs font-medium ${charFilter === f ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'}`}>
                    {f === 'ALL' ? 'All' : f === 'MAIN' ? 'Main' : 'Supporting'}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredChars.slice(0, 24).map(ch => (
                <CharacterCard key={ch.id} character={ch} />
              ))}
            </div>
          </div>
        )}

        {/* Relations */}
        {data.relations?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-rose-400" /> Relations
              <span className="text-xs text-zinc-500">({data.relations.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {data.relations.map((r, i) => (
                <Link key={i} href={`/anime/${r.target_slug}`} className="group block">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden border border-zinc-800 group-hover:border-rose-500/50">
                    {r.target_poster ? (
                      <img src={r.target_poster} alt={r.target_title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs text-center p-2">{r.target_title}</div>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <div className="text-[10px] text-rose-400 uppercase">{r.relation_type}</div>
                    <div className="text-xs font-medium truncate">{r.target_title}</div>
                    <div className="text-[10px] text-zinc-500">{r.target_format}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" /> Recommendations
              <span className="text-xs text-zinc-500">({data.recommendations.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {data.recommendations.slice(0, 16).map((r, i) => (
                <AnimeCard key={`rec-${i}`} anime={{
                  id: r.recommended_id,
                  slug: r.recommended_slug,
                  title: r.recommended_title,
                  title_english: null, title_native: null,
                  format: null, status: null, season: null, season_year: null,
                  start_date: null, end_date: null, episode_count: null, episodes_known: null,
                  duration_minutes: null, poster_url: r.recommended_poster, cover_url: null,
                  banner_url: null, logo_url: null, trailer_url: null, trailer_youtube_id: null,
                  score_average: null, score_anilist: null, score_mal: null,
                  mal_rank: null, mal_members: null, anilist_popularity: null,
                  is_adult: 0, genres: [], sources: [], synopsis: null,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
