'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Heart, Menu, X, ArrowUpRight } from 'lucide-react';

interface Anime {
  id: number; slug: string; title: string; title_english: string | null;
  poster_url: string | null; season_year: number | null;
}

const NAV = [
  { href: '/', label: 'Discover', num: '01' },
  { href: '/season', label: 'This Season', num: '02' },
  { href: '/schedule', label: 'Schedule', num: '03' },
  { href: '/library', label: 'Library', num: '04' },
  { href: '/stats', label: 'Stats', num: '05' },
  { href: '/lab', label: 'API Lab', num: '06' },
];

export function Header() {
  const path = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [listCount, setListCount] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 24));
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
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`)
        .then(r => r.json())
        .then(d => { setResults(d.items || []); setSearchOpen(true); });
    }, 220);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [q]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(10, 16, 32, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--line)' : '1px solid transparent',
        transition: 'background 280ms, backdrop-filter 280ms, border-color 280ms',
      }}>
        <div className="container" style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 32,
        }}>
          {/* Brand */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="font-display" style={{
              fontSize: 22,
              fontWeight: 500,
              color: 'var(--cream)',
              letterSpacing: '-0.04em',
            }}>AniCore</span>
            <span className="meta" style={{ fontSize: 9, opacity: 0.5 }}>the living archive</span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
            {NAV.map(l => {
              const active = path === l.href || (l.href !== '/' && path?.startsWith(l.href));
              return (
                <Link key={l.href} href={l.href}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: 999,
                    fontFamily: 'var(--body)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: active ? 'var(--gold)' : 'var(--cream-dim)',
                    background: active ? 'rgba(224, 176, 86, 0.08)' : 'transparent',
                    transition: 'all 200ms',
                  }}>
                  <span className="font-mono" style={{ fontSize: 9, opacity: 0.5 }}>{l.num}</span>
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div ref={searchRef} style={{ position: 'relative', width: 220 }}>
            <form onSubmit={submitSearch}>
              <div style={{ position: 'relative' }}>
                <Search style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 14, height: 14, color: 'var(--cream-mute)',
                }} />
                <input
                  type="text" value={q} onChange={(e) => setQ(e.target.value)}
                  onFocus={() => results.length && setSearchOpen(true)}
                  placeholder="Search archive…"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--line)',
                    borderRadius: 999,
                    paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                    color: 'var(--cream)',
                    fontFamily: 'var(--body)',
                    fontSize: 13,
                    outline: 'none',
                  }}
                  onFocusCapture={e => (e.target.style.borderColor = 'var(--line-gold)')}
                  onBlurCapture={e => (e.target.style.borderColor = 'var(--line)')}
                />
              </div>
            </form>
            {searchOpen && results.length > 0 && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: 'var(--surface)', border: '1px solid var(--line-strong)',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                zIndex: 100,
              }}>
                {results.map(a => (
                  <Link key={a.id} href={`/anime/${a.slug}`}
                    onClick={() => { setQ(''); setSearchOpen(false); }}
                    style={{
                      textDecoration: 'none',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: 10,
                      borderBottom: '1px solid var(--line)',
                      transition: 'background 120ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {a.poster_url && (
                      <img src={a.poster_url} alt="" style={{ width: 28, height: 40, objectFit: 'cover', borderRadius: 3 }} loading="lazy" />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="font-body" style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {a.title_english || a.title}
                      </div>
                      <div className="meta" style={{ fontSize: 9, marginTop: 2 }}>{a.season_year || '—'}</div>
                    </div>
                    <ArrowUpRight style={{ width: 12, height: 12, color: 'var(--cream-mute)' }} />
                  </Link>
                ))}
                <button onClick={submitSearch} className="font-mono" style={{
                  width: '100%', background: 'transparent', border: 0,
                  padding: '10px', cursor: 'pointer',
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
                  color: 'var(--gold)',
                }}>View all →</button>
              </div>
            )}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/list" style={{
              textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '8px 12px',
              borderRadius: 999,
              border: '1px solid var(--line-strong)',
              color: 'var(--cream)',
              fontFamily: 'var(--mono)', fontSize: 11,
              position: 'relative',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--cream)'; }}>
              <Heart style={{ width: 12, height: 12 }} />
              {listCount > 0 && (
                <span style={{
                  background: 'var(--gold)', color: 'var(--ink)',
                  fontSize: 9, fontWeight: 700,
                  borderRadius: 999, padding: '1px 5px', minWidth: 14, textAlign: 'center',
                }}>{listCount}</span>
              )}
            </Link>
            <button onClick={toggleTheme} aria-label="Switch theme" style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--line-strong)',
              borderRadius: 999,
              cursor: 'pointer',
              color: 'var(--cream)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 200ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-strong)'; e.currentTarget.style.color = 'var(--cream)'; }}>
              {theme === 'light' ? <Moon style={{ width: 14, height: 14 }} /> : <Sun style={{ width: 14, height: 14 }} />}
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu" style={{
              display: 'none',
              width: 36, height: 36,
              background: 'transparent',
              border: '1px solid var(--line-strong)',
              borderRadius: 999,
              cursor: 'pointer', color: 'var(--cream)',
              alignItems: 'center', justifyContent: 'center',
            }} className="mobile-only">
              {mobileMenu ? <X style={{ width: 14, height: 14 }} /> : <Menu style={{ width: 14, height: 14 }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileMenu && (
        <div style={{
          position: 'fixed', top: 72, left: 0, right: 0, bottom: 0,
          background: 'var(--ink-deep)',
          padding: 24,
          zIndex: 40,
          overflowY: 'auto',
        }}>
          {NAV.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileMenu(false)}
              style={{
                textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '20px 0',
                borderBottom: '1px solid var(--line)',
                fontFamily: 'var(--display)', fontSize: 28, color: 'var(--cream)',
              }}>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--gold)' }}>{l.num}</span>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
