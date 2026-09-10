'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, Sun, Moon, Heart, Shuffle, Compass, Calendar, Library, BarChart3 } from 'lucide-react';

interface Anime {
  id: number; slug: string; title: string; title_english: string | null;
  poster_url: string | null; season_year: number | null;
}

const NAV = [
  { href: '/', label: 'Discover', icon: Compass },
  { href: '/season', label: 'This Season', icon: Calendar },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/library', label: 'My Library', icon: Library },
  { href: '/stats', label: 'Stats', icon: BarChart3 },
];

export function Header() {
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [listCount, setListCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('anicore-theme')) as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
    const updateCount = () => {
      try { setListCount(JSON.parse(localStorage.getItem('anicore-list') || '[]').length); } catch {}
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('anicore-list-changed', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('anicore-list-changed', updateCount);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('anicore-theme', next); } catch {}
  };

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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
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

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]/85 backdrop-blur-xl border-b border-[var(--line)]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-[var(--cobalt)] text-white flex items-center justify-center font-display font-black text-lg shadow-md shadow-[var(--cobalt)]/30">A</span>
          <span className="hidden sm:flex flex-col leading-none">
            <strong className="font-display font-bold text-[var(--ink)] text-base">AniCore</strong>
            <small className="font-mono text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">the living index</small>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map(l => {
            const active = path === l.href || (l.href !== '/' && path?.startsWith(l.href));
            return (
              <Link key={l.href + l.label} href={l.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-[var(--cobalt)] text-white' : 'text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper-strong)]'
                }`}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div ref={containerRef} className="flex-1 max-w-md ml-auto relative">
          <form onSubmit={submit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-soft)]" />
              <input
                type="text" value={q} onChange={(e) => setQ(e.target.value)}
                onFocus={() => results.length && setOpen(true)}
                placeholder="Search the AniCore database"
                className="w-full bg-[var(--paper-strong)] border border-[var(--line)] rounded-full pl-10 pr-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--cobalt)] focus:outline-none"
              />
            </div>
          </form>
          {open && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-[var(--paper-strong)] border border-[var(--line)] rounded-xl overflow-hidden shadow-2xl shadow-[var(--cobalt)]/10 max-h-[70vh] overflow-y-auto">
              {results.map(a => (
                <Link key={a.id} href={`/anime/${a.slug}`}
                  onClick={() => { setQ(''); setOpen(false); }}
                  className="flex items-center gap-3 p-2 hover:bg-[var(--paper)] transition-colors border-b border-[var(--line)]/50 last:border-0">
                  <div className="w-10 h-14 shrink-0 rounded overflow-hidden bg-[var(--paper)]">
                    {a.poster_url && <img src={a.poster_url} alt="" className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate text-[var(--ink)]">{a.title_english || a.title}</div>
                    <div className="text-xs text-[var(--ink-soft)]">{a.season_year || ''}</div>
                  </div>
                </Link>
              ))}
              <button onClick={submit} className="w-full text-center text-xs text-[var(--cobalt)] hover:bg-[var(--paper)] py-2 font-mono uppercase tracking-wider">View all →</button>
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Link href="/random" className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] hover:border-[var(--cobalt)] hover:text-[var(--cobalt)] text-[var(--ink-soft)]" title="Surprise me">
            <Shuffle className="w-4 h-4" />
          </Link>
          <Link href="/list" className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] hover:border-[var(--signal)] hover:text-[var(--signal)] text-[var(--ink-soft)]" title="My List">
            <Heart className="w-4 h-4" />
            {listCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--signal)] text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">{listCount}</span>
            )}
          </Link>
          <button onClick={toggleTheme} className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] hover:border-[var(--cobalt)] text-[var(--ink-soft)] hover:text-[var(--cobalt)]" title="Switch theme">
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 text-[var(--ink)]">
          {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileMenu && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper-strong)] px-4 py-3">
          {NAV.map(l => (
            <Link key={l.href + l.label} href={l.href} onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 py-2.5 text-[var(--ink)] hover:text-[var(--cobalt)]">
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
          <Link href="/random" onClick={() => setMobileMenu(false)}
            className="flex items-center gap-3 py-2.5 text-[var(--ink)] hover:text-[var(--cobalt)]">
            <Shuffle className="w-4 h-4" /> Surprise me
          </Link>
        </div>
      )}
    </header>
  );
}
