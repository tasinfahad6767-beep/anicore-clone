'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Tv, Clock, Star } from 'lucide-react';
import { AnimeCard } from '@/components/anicore/AnimeCard';
import { Footer } from '@/components/anicore/Footer';
import { AnimeGridSkeleton } from '@/components/anicore/AnimeGrid';
import type { Anime } from '@/lib/anicore/db';

export default function SchedulePage() {
  const [items, setItems] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/airing').then(r => r.json()).then(d => {
      setItems(d.items || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-rose-400" /> Currently Airing
          </h1>
          <p className="text-sm text-zinc-500">Anime with new episodes coming out right now</p>
        </div>

        {loading ? (
          <AnimeGridSkeleton count={18} />
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {items.map(a => <AnimeCard key={a.id} anime={a} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-500">
            <div className="text-lg mb-2">No currently airing anime in database</div>
            <Link href="/" className="text-rose-400 hover:text-rose-300 text-sm">← Back to Home</Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
