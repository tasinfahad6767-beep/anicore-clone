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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
      <div style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
        <div className="skeleton" style={{ width: 48, height: 48, margin: '0 auto 16px', borderRadius: 999 }} />
        <p style={{ fontFamily: 'var(--utility)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Picking a random anime…</p>
      </div>
    </div>
  );
}
