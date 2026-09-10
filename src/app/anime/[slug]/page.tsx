'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Star, Play, Calendar, Clock, Tv, ChevronDown, ChevronUp,
  ExternalLink, Users, Heart, Film, Link2, Plus, Check, Shuffle
} from 'lucide-react';
import { EpisodeCard } from '@/components/anicore/EpisodeCard';
import { CharacterCard } from '@/components/anicore/CharacterCard';
import { AnimeCard } from '@/components/anicore/AnimeCard';
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
  const [inList, setInList] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/anime/${slug}`).then(r => r.json()).then(d => { setData(d); setLoading(false); });
    try {
      const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
      setInList(list.includes(d?.anime?.id || 0));
    } catch {}
  }, [slug]);

  useEffect(() => {
    if (!data?.anime?.id) return;
    try {
      const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
      setInList(list.includes(data.anime.id));
    } catch {}
  }, [data?.anime?.id]);

  const toggleList = () => {
    if (!data?.anime?.id) return;
    try {
      const list: number[] = JSON.parse(localStorage.getItem('anicore-list') || '[]');
      const idx = list.indexOf(data.anime.id);
      if (idx >= 0) list.splice(idx, 1); else list.push(data.anime.id);
      localStorage.setItem('anicore-list', JSON.stringify(list));
      setInList(idx < 0);
      window.dispatchEvent(new Event('anicore-list-changed'));
    } catch {}
  };

  if (loading) return <DetailSkeleton />;
  if (!data?.anime) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-3xl font-black text-[var(--ink)] mb-2">Not found</div>
        <p className="text-[var(--ink-soft)] mb-4">This anime isn&apos;t in our database yet.</p>
        <Link href="/" className="btn-primary"><ArrowLeft className="w-4 h-4" /> Back to library</Link>
      </div>
    </div>
  );

  const a = data.anime;
  const genres: string[] = a.genres || [];
  const synopsisLong = (a.synopsis?.length || 0) > 400;
  const filteredChars = data.characters.filter(c => charFilter === 'ALL' || c.role === charFilter);

  return (
    <div className="min-h-screen">
      {/* Hero with banner background */}
      <section className="relative h-[440px] md:h-[520px] w-full overflow-hidden">
        {a.banner_url && (
          <img src={a.banner_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, var(--paper) 0%, transparent 60%), linear-gradient(to right, var(--paper) 0%, transparent 50%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, var(--paper) 0%, transparent 60%), linear-gradient(to right, var(--paper) 0%, transparent 50%)'
        }} data-theme-dark />
      </section>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 -mt-72 md:-mt-80 relative pb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[var(--ink-soft)] hover:text-[var(--cobalt)] mb-4 text-sm bg-[var(--paper-strong)]/80 backdrop-blur px-3 py-1.5 rounded-full border border-[var(--line)]">
          <ArrowLeft className="w-4 h-4" /> Back to library
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="w-48 md:w-56 shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-[var(--line)] shadow-2xl shadow-[var(--cobalt)]/10">
              {a.poster_url && <img src={a.poster_url} alt={a.title} className="w-full h-full object-cover" />}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={`/anime/${a.slug}/watch`} className="btn-signal justify-center w-full">
                <Play className="w-4 h-4 fill-[var(--on-signal)]" /> Watch
              </Link>
              <button onClick={toggleList} className={`btn-outline justify-center ${inList ? '!border-[var(--signal)] !text-[var(--signal)]' : ''}`}>
                {inList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {inList ? 'Saved' : 'List'}
              </button>
            </div>
            {a.trailer_youtube_id && (
              <a href={`https://www.youtube.com/watch?v=${a.trailer_youtube_id}`} target="_blank" rel="noopener"
                className="btn-outline justify-center w-full mt-2">
                <Play className="w-4 h-4" /> Trailer
              </a>
            )}
          </div>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            {/* Title + quick stats */}
            <h1 className="font-display text-3xl md:text-5xl font-black text-[var(--ink)] leading-[1.05] mb-1">
              {a.title_english || a.title}
            </h1>
            {a.title_native && a.title_native !== a.title_english && (
              <p className="font-body text-[var(--ink-soft)] text-base md:text-lg mb-3">{a.title_native}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {a.score_average && (
                <span className="inline-flex items-center gap-1 font-mono font-bold text-[var(--ink)]">
                  <Star className="w-4 h-4 fill-[var(--yellow)] text-[var(--yellow)]" /> {a.score_average.toFixed(0)}
                  <span className="text-[var(--ink-soft)] font-normal text-xs">/100</span>
                </span>
              )}
              {a.format && <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)] flex items-center gap-1"><Tv className="w-3 h-3" /> {a.format}</span>}
              {a.season_year && <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)] flex items-center gap-1"><Calendar className="w-3 h-3" /> {a.season} {a.season_year}</span>}
              {a.duration_minutes && <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)] flex items-center gap-1"><Clock className="w-3 h-3" /> {a.duration_minutes}m</span>}
              {a.episode_count && <span className="font-mono text-xs uppercase tracking-wider text-[var(--ink-soft)]">{a.episode_count} eps</span>}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold"
                style={{
                  background: a.status === 'RELEASING' ? 'var(--mint)' : a.status === 'FINISHED' ? 'var(--lilac)' : 'var(--paper-strong)',
                  color: a.status === 'RELEASING' ? 'var(--mint-ink)' : 'var(--ink)',
                }}>
                {a.status === 'RELEASING' ? 'Airing' : a.status === 'FINISHED' ? 'Finished' : a.status === 'NOT_YET_RELEASED' ? 'Upcoming' : a.status}
              </span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {genres.map(g => (
                  <Link key={g} href={`/genre/${encodeURIComponent(g.toLowerCase())}`}
                    className="px-2.5 py-1 bg-[var(--paper-strong)] border border-[var(--line)] rounded-full text-[11px] font-mono uppercase tracking-wider text-[var(--ink-soft)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors">
                    {g}
                  </Link>
                ))}
              </div>
            )}

            {/* Score panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
              {a.score_anilist && (
                <Stat label="AniList" value={String(a.score_anilist)} color="var(--cobalt)" />
              )}
              {a.score_mal && (
                <Stat label="MAL Score" value={a.score_mal.toFixed(2)} color="var(--yellow)" />
              )}
              {a.mal_rank && (
                <Stat label="MAL Rank" value={`#${a.mal_rank}`} color="var(--signal)" />
              )}
              {a.mal_members && (
                <Stat label="Members" value={a.mal_members >= 1_000_000 ? `${(a.mal_members / 1_000_000).toFixed(1)}M` : `${(a.mal_members / 1000).toFixed(0)}K`} color="var(--mint)" />
              )}
            </div>

            {/* Synopsis */}
            {a.synopsis && (
              <div className="mb-6">
                <h2 className="section-kicker">Synopsis</h2>
                <p className={`text-sm md:text-base text-[var(--ink-soft)] leading-relaxed ${!synopsisExpanded && synopsisLong ? 'line-clamp-4' : ''}`}>{a.synopsis}</p>
                {synopsisLong && (
                  <button onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    className="text-xs font-mono uppercase tracking-wider text-[var(--cobalt)] hover:text-[var(--cobalt-dark)] mt-1 inline-flex items-center gap-1">
                    {synopsisExpanded ? 'Show less' : 'Read more'}
                    {synopsisExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
            )}

            {/* Streaming + External */}
            {(data.streaming?.length > 0 || data.external?.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {data.streaming.map((s, i) => (
                  <a key={`s${i}`} href={s.url} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--cobalt)] text-white rounded-full text-xs font-mono uppercase tracking-wider hover:bg-[var(--cobalt-dark)] transition-colors">
                    <Play className="w-3 h-3 fill-white" /> {s.name}
                    {s.quality && <span className="opacity-70">· {s.quality}</span>}
                  </a>
                ))}
                {data.external.map((e, i) => (
                  <a key={`e${i}`} href={e.url} target="_blank" rel="noopener"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-[var(--paper-strong)] border border-[var(--line)] rounded-full text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] transition-colors">
                    {e.name} <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Episodes */}
        {data.episodes?.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-kicker">Episode index</p>
                <h2 className="font-display text-2xl font-bold text-[var(--ink)] flex items-center gap-2">
                  <Film className="w-5 h-5 text-[var(--cobalt)]" /> Episodes
                  <span className="font-mono text-xs text-[var(--ink-soft)] font-normal">({data.episodes.length})</span>
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.episodes.slice(0, epLimit).map(ep => (
                <EpisodeCard key={ep.id} episode={ep} anime={a} />
              ))}
            </div>
            {data.episodes.length > epLimit && (
              <div className="text-center mt-4">
                <button onClick={() => setEpLimit(epLimit + 12)}
                  className="btn-outline">
                  Load more episodes ({data.episodes.length - epLimit} more)
                </button>
              </div>
            )}
          </section>
        )}

        {/* Characters */}
        {data.characters?.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="section-kicker">Cast</p>
                <h2 className="font-display text-2xl font-bold text-[var(--ink)] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[var(--cobalt)]" /> Characters
                  <span className="font-mono text-xs text-[var(--ink-soft)] font-normal">({data.characters.length})</span>
                </h2>
              </div>
              <div className="flex gap-1 bg-[var(--paper-strong)] border border-[var(--line)] rounded-full p-1">
                {(['ALL', 'MAIN', 'SUPPORTING'] as const).map(f => (
                  <button key={f} onClick={() => setCharFilter(f)}
                    className={`px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-colors ${charFilter === f ? 'bg-[var(--cobalt)] text-white' : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'}`}>
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
          </section>
        )}

        {/* Relations */}
        {data.relations?.length > 0 && (
          <section className="mt-12">
            <div className="mb-4">
              <p className="section-kicker">Connected titles</p>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)] flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[var(--cobalt)]" /> Relations
                <span className="font-mono text-xs text-[var(--ink-soft)] font-normal">({data.relations.length})</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {data.relations.map((r, i) => (
                <Link key={i} href={`/anime/${r.target_slug}`} className="group block">
                  <div className="aspect-[2/3] rounded-xl overflow-hidden border border-[var(--line)] group-hover:border-[var(--cobalt)]">
                    {r.target_poster ? (
                      <img src={r.target_poster} alt={r.target_title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-xs p-2 text-center font-mono">{r.target_title}</div>
                    )}
                  </div>
                  <div className="mt-1.5">
                    <div className="font-mono text-[9px] text-[var(--signal)] uppercase tracking-wider font-bold">{r.relation_type}</div>
                    <div className="font-body text-xs font-semibold truncate text-[var(--ink)]">{r.target_title}</div>
                    <div className="font-mono text-[10px] text-[var(--ink-soft)] uppercase">{r.target_format}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {data.recommendations?.length > 0 && (
          <section className="mt-12">
            <div className="mb-4">
              <p className="section-kicker">More like this</p>
              <h2 className="font-display text-2xl font-bold text-[var(--ink)] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[var(--cobalt)]" /> Recommendations
                <span className="font-mono text-xs text-[var(--ink-soft)] font-normal">({data.recommendations.length})</span>
              </h2>
            </div>
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
          </section>
        )}

        {/* Surprise me CTA */}
        <div className="mt-12 text-center">
          <Link href="/random" className="btn-outline">
            <Shuffle className="w-4 h-4" /> Pick another anime for me
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[var(--paper-strong)] border border-[var(--line)] rounded-xl p-3 text-center">
      <div className="font-display font-black text-2xl" style={{ color }}>{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-soft)] mt-0.5">{label}</div>
    </div>
  );
}
