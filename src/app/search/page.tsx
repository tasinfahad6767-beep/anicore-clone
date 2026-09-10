'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { AnimeGridSkeleton } from '@/components/anicore/AnimeGrid';
import { Footer } from '@/components/anicore/Footer';
import type { Anime } from '@/lib/anicore/db';

function SearchContent() {
  const search = useSearchParams();
  const q = search.get('q') || '';
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) { setItems([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=60`).then(r => r.json()).then(d => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, [q]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Search Results</div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <SearchIcon className="w-6 h-6 text-rose-400" /> &quot;{q}&quot;
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {loading ? 'Searching...' : `${items.length} anime found`}
          </p>
        </div>

        {loading ? (
          <AnimeGridSkeleton count={18} />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {items.map(a => <AnimeCard key={a.id} anime={a} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            <div className="text-lg mb-2">No anime match &quot;{q}&quot;</div>
            <Link href="/" className="text-rose-400 hover:text-rose-300 text-sm">← Back to Home</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f]" />}>
      <SearchContent />
    </Suspense>
  );
}
