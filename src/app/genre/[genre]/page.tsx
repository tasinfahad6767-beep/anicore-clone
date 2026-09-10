'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { AnimeGridSkeleton } from '@/components/anicore/AnimeGrid';
import { Footer } from '@/components/anicore/Footer';
import { Pagination } from '@/components/anicore/Pagination';
import type { Anime } from '@/lib/anicore/db';

export default function GenrePage() {
  const params = useParams();
  const rawGenre = params.genre as string;
  const genre = rawGenre.charAt(0).toUpperCase() + rawGenre.slice(1).replace(/-/g, ' ');
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/browse?genre=${encodeURIComponent(genre)}&page=${page}&perPage=36`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setTotal(d.pageInfo?.total || 0);
      setLoading(false);
    });
  }, [genre, page]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/" className="text-xs text-zinc-500 hover:text-rose-400 mb-1 inline-block">← Back to Library</Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-rose-400" /> {genre}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? 'Loading...' : `${total.toLocaleString()} anime in this genre`}
          </p>
        </div>

        {loading ? (
          <AnimeGridSkeleton count={36} />
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
              {items.map(a => <AnimeCard key={a.id} anime={a} />)}
            </div>
            <Pagination page={page} lastPage={Math.ceil(total / 36)} onPage={setPage} />
          </>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            <div className="text-lg mb-2">No anime found in "{genre}" genre</div>
            <Link href="/library" className="text-rose-400 hover:text-rose-300 text-sm">Browse all anime →</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
