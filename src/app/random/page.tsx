'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RandomPage() {
  const router = useRouter();
  useEffect(() => {
    fetch('/api/random').then(r => r.json()).then(d => {
      if (d.anime?.slug) router.push(`/anime/${d.anime.slug}`);
      else router.push('/');
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-zinc-800 border-t-rose-500 rounded-full animate-spin" />
        <div className="text-zinc-400 text-sm">Picking a random anime...</div>
      </div>
    </div>
  );
}
