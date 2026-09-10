'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Home, Library, Calendar, Shuffle, Menu, X } from 'lucide-react';

interface Anime {
  id: number; slug: string; title: string; title_english: string | null;
  poster_url: string | null; season_year: number | null;
}

export function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
        .then(r => r.json())
        .then(d => { setResults(d.items || []); setOpen(true); });
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/library', label: 'Library', icon: Library },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-zinc-800/80">
      <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center font-black text-white text-sm">A</div>
          <span className="text-lg font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">AniCore</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
              <l.icon className="w-3.5 h-3.5" /> {l.label}
            </Link>
          ))}
          <Link href="/api/random" onClick={(e) => { e.preventDefault(); router.push('/random'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
            <Shuffle className="w-3.5 h-3.5" /> Surprise
          </Link>
        </nav>

        <div ref={containerRef} className="flex-1 max-w-md ml-auto relative">
          <form onSubmit={submit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text" value={q} onChange={(e) => setQ(e.target.value)}
                onFocus={() => results.length && setOpen(true)}
                placeholder="Search anime..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-rose-500/50 focus:outline-none"
              />
            </div>
          </form>
          {open && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl shadow-black/50 max-h-[70vh] overflow-y-auto">
              {results.map(a => (
                <Link key={a.id} href={`/anime/${a.slug}`}
                  onClick={() => { setQ(''); setOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0">
                  <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-zinc-800">
                    {a.poster_url && <img src={a.poster_url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate text-white">{a.title_english || a.title}</div>
                    <div className="text-xs text-zinc-500">{a.season_year || ''}</div>
                  </div>
                </Link>
              ))}
              <button onClick={submit}
                className="w-full text-center text-xs text-rose-400 hover:bg-zinc-800 py-2">View all results →</button>
            </div>
          )}
        </div>

        <button onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden p-2 text-zinc-400 hover:text-white">
          {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileMenu && (
        <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0f] px-4 py-3">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileMenu(false)}
              className="flex items-center gap-2 py-2 text-zinc-300 hover:text-white">
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
          <Link href="/random" onClick={() => setMobileMenu(false)}
            className="flex items-center gap-2 py-2 text-zinc-300 hover:text-white">
            <Shuffle className="w-4 h-4" /> Surprise me
          </Link>
        </div>
      )}
    </header>
  );
}
