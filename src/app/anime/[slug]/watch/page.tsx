'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, List, Play, X } from 'lucide-react';
import { HlsPlayer } from '@/components/anicore/HlsPlayer';
import { Footer } from '@/components/anicore/Footer';
import { DetailSkeleton } from '@/components/anicore/Skeletons';
import type { Anime, Episode, StreamingLink } from '@/lib/anicore/db';

interface Data {
  anime: Anime;
  episodes: Episode[];
  streaming: StreamingLink[];
}

function WatchContent() {
  const params = useParams();
  const search = useSearchParams();
  const slug = params.slug as string;
  const epParam = search.get('ep');

  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEp, setCurrentEp] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/anime/${slug}`).then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
      const firstEp = d.episodes?.[0];
      const initial = epParam ? parseInt(epParam) : (firstEp?.absolute_number || firstEp?.number || 1);
      setCurrentEp(initial);
    });
  }, [slug, epParam]);

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
  const episodes = data.episodes || [];
  const currentIdx = episodes.findIndex(e => (e.absolute_number || e.number) === currentEp);
  const current = episodes[currentIdx];

  const streamLink = data.streaming?.[0];
  const streamUrl = streamLink?.url || '';

  const goToEp = (num: number) => {
    setCurrentEp(num);
    setShowSidebar(false);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/anime/${slug}/watch?ep=${num}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goNext = currentIdx < episodes.length - 1 ? () => {
    const next = episodes[currentIdx + 1];
    goToEp(next.absolute_number || next.number);
  } : undefined;

  const goPrev = currentIdx > 0 ? () => {
    const prev = episodes[currentIdx - 1];
    goToEp(prev.absolute_number || prev.number);
  } : undefined;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <Link href={`/anime/${a.slug}`}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm bg-zinc-900/50 backdrop-blur px-3 py-1.5 rounded-lg border border-zinc-800">
            <ArrowLeft className="w-4 h-4" /> Back to {a.title_english || a.title}
          </Link>
          {episodes.length > 0 && (
            <button onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden inline-flex items-center gap-2 text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs">
              <List className="w-4 h-4" /> Episodes
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-4">
          <div className="min-w-0">
            {streamUrl ? (
              <HlsPlayer
                src={streamUrl}
                poster={current?.thumbnail_url || a.banner_url || undefined}
                title={current ? `EP ${current.number} · ${current.title || a.title_english || a.title}` : (a.title_english || a.title)}
                onNext={goNext}
                onPrev={goPrev}
              />
            ) : (
              <div className="aspect-video bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center flex-col">
                <div className="text-zinc-500 text-lg mb-2">No streaming source available</div>
                <p className="text-zinc-600 text-xs max-w-md text-center px-4">
                  This anime doesn&apos;t have a streaming link in our database yet. Check the detail page for external links.
                </p>
                <Link href={`/anime/${a.slug}`}
                  className="mt-4 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm hover:bg-zinc-700">
                  View Anime Details
                </Link>
              </div>
            )}

            {current && (
              <div className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <div className="text-xs text-rose-400 font-semibold mb-1">
                  Episode {current.number}{current.season_number ? ` · Season ${current.season_number}` : ''}
                </div>
                <h1 className="text-xl font-bold mb-2">{current.title || a.title_english || a.title}</h1>
                {current.synopsis && (
                  <p className="text-sm text-zinc-400 leading-relaxed">{current.synopsis}</p>
                )}
                {current.air_date && (
                  <div className="text-xs text-zinc-500 mt-2">Aired: {current.air_date}</div>
                )}
              </div>
            )}

            {episodes.length > 0 && (
              <div className="mt-4 flex gap-2">
                <button onClick={goPrev} disabled={currentIdx <= 0}
                  className="flex items-center gap-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm disabled:opacity-30 hover:border-zinc-700">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button onClick={goNext} disabled={currentIdx >= episodes.length - 1}
                  className="flex items-center gap-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm disabled:opacity-30 hover:border-zinc-700 ml-auto">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {episodes.length > 0 && (
            <aside className={`${showSidebar ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none' : 'hidden lg:block'}`}>
              <div className={`${showSidebar ? 'absolute right-0 top-0 bottom-0 w-[320px] bg-[#0a0a0f] border-l border-zinc-800 lg:relative lg:w-auto' : ''} h-full`}>
                <div className="flex items-center justify-between p-3 border-b border-zinc-800">
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">Episodes</div>
                    <div className="text-sm font-bold">{episodes.length} total</div>
                  </div>
                  {showSidebar && (
                    <button onClick={() => setShowSidebar(false)} className="p-2 text-zinc-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto p-2 space-y-1.5 max-h-[calc(100vh-80px)] lg:max-h-[600px]">
                  {episodes.map((ep) => {
                    const epNum = ep.absolute_number || ep.number;
                    const active = epNum === currentEp;
                    return (
                      <button key={ep.id} onClick={() => goToEp(epNum)}
                        className={`w-full flex gap-2 p-2 rounded-lg text-left transition-colors ${
                          active ? 'bg-rose-500/10 border border-rose-500/40' : 'border border-transparent hover:bg-zinc-900'
                        }`}>
                        <div className="relative w-16 h-10 shrink-0 rounded overflow-hidden bg-zinc-800">
                          {ep.thumbnail_url && <img src={ep.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                          {active && <div className="absolute inset-0 bg-rose-500/30 flex items-center justify-center"><Play className="w-3 h-3 text-white fill-white" /></div>}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-medium ${active ? 'text-rose-400' : 'text-zinc-300'}`}>EP {ep.number}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{ep.title || 'Untitled'}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <WatchContent />
    </Suspense>
  );
}
