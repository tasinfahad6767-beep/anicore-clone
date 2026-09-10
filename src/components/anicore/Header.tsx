'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Heart, Menu, X, Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface Anime {
  id: number; slug: string; title: string; title_english: string | null;
  poster_url: string | null; season_year: number | null;
}

const NAV = [
  { href: '/', label: 'Discover' },
  { href: '/season', label: 'This season' },
  { href: '/schedule', label: 'Schedule' },
  { href: '/library', label: 'My library' },
  { href: '/stats', label: 'Stats' },
  { href: '/lab', label: 'API Lab' },
];

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [listCount, setListCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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
    if (!q.trim()) { setResults([]); setSearchOpen(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`)
        .then(r => r.json())
        .then(d => { setResults(d.items || []); setSearchOpen(true); });
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcut: / to focus search, Esc to close
  useEffect(() => {
    const input = searchRef.current?.querySelector('input');
    const onKey = (e: KeyboardEvent) => {
      // Don't trigger if user is already typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') {
        if (e.key === 'Escape' && input) {
          input.blur();
          setSearchOpen(false);
        }
        return;
      }
      if (e.key === '/' && input) {
        e.preventDefault();
        input.focus();
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenu(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="AniCore home" style={{ textDecoration: 'none' }}>
          <span className="brand-mark">A</span>
          <span>
            <strong>AniCore</strong>
            <small>the living index</small>
          </span>
        </Link>

        <nav id="site-navigation" className={mobileMenu ? 'open' : ''}>
          {NAV.map(l => {
            const active = path === l.href || (l.href !== '/' && path?.startsWith(l.href));
            return (
              <Link key={l.href + l.label} href={l.href}
                className={active ? 'active' : ''}
                style={{ textDecoration: 'none' }}
                onClick={() => setMobileMenu(false)}>
                {l.label}
              </Link>
            );
          })}

          <div className="mobile-nav-utilities">
            <div className="mobile-nav-heading">
              <span>Personal controls</span>
              <small>Guest session</small>
            </div>
            <button type="button" className="mobile-utility" onClick={() => setSoundOn(s => !s)}>
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span><strong>Interface sound</strong><small>{soundOn ? 'On' : 'Off'}</small></span>
            </button>
            <button type="button" className="mobile-utility" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span><strong>Appearance</strong><small>Switch to {theme === 'light' ? 'dark' : 'light'}</small></span>
            </button>
            <Link href="/list" className="mobile-utility" style={{ textDecoration: 'none' }}>
              <Heart className="w-4 h-4" />
              <span><strong>My list</strong><small>{listCount} saved titles</small></span>
              <b>{listCount}</b>
            </Link>
            <Link href="/" className="mobile-account" style={{ textDecoration: 'none' }}>
              <span><strong>Sign in or create account</strong><small>Sync lists across devices</small></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <button
            className="sound-toggle desktop-header-control"
            type="button"
            aria-label={soundOn ? 'Mute interface sounds' : 'Unmute interface sounds'}
            aria-pressed={!soundOn}
            onClick={() => setSoundOn(s => !s)}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button className="theme-toggle desktop-header-control" type="button" aria-label="Switch theme" onClick={toggleTheme}>
            <span className="theme-toggle-icon">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </span>
            <span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
          <Link href="/list" className="my-list-button desktop-header-control" style={{ textDecoration: 'none' }}>
            <Heart className="w-3.5 h-3.5" /> My List <span>{listCount}</span>
          </Link>
          <Link href="/" className="account-button desktop-header-control" style={{ textDecoration: 'none' }}>
            Sign in
          </Link>
          <button className="mobile-menu" aria-label="Toggle menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {searchOpen && results.length > 0 && (
        <div ref={searchRef} className="search-results" style={{ position: 'fixed', top: '76px', left: '50%', transform: 'translateX(-50%)', width: 'min(600px, calc(100vw - 32px))', zIndex: 100 }}>
          <div className="search-results-head">
            <span>Results for "{q}"</span>
            <button onClick={() => setSearchOpen(false)}>Close</button>
          </div>
          {results.map(a => (
            <Link key={a.id} href={`/anime/${a.slug}`} className="search-result"
              style={{ textDecoration: 'none' }}
              onClick={() => { setQ(''); setSearchOpen(false); }}>
              {a.poster_url ? (
                <img src={a.poster_url} alt="" loading="lazy" />
              ) : (
                <div className="result-fallback">?</div>
              )}
              <div>
                <strong>{a.title_english || a.title}</strong>
                <span>{a.season_year || ''}</span>
              </div>
            </Link>
          ))}
          <button className="see-all" onClick={submitSearch}>View all results</button>
        </div>
      )}
    </>
  );
}
