import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

interface Stats {
  animeCount: number; episodeCount: number; characterCount: number; releasingCount: number;
}

export function Footer({ stats }: { stats?: Stats }) {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[var(--paper-strong)]">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-9 h-9 rounded-xl bg-[var(--cobalt)] text-white flex items-center justify-center font-display font-black text-lg">A</span>
              <span className="flex flex-col leading-none">
                <strong className="font-display font-bold text-[var(--ink)] text-base">AniCore</strong>
                <small className="font-mono text-[10px] text-[var(--ink-soft)] uppercase tracking-wider">the living index</small>
              </span>
            </div>
            <p className="text-sm text-[var(--ink-soft)] max-w-md leading-relaxed">
              A living anime index unified across Kitsu, TVDB, TMDB, AniList, and MyAnimeList. Self-hosted, fast, no ads, no tracking. The whole catalog, one interface.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider mb-3">Browse</h3>
            <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
              <li><Link href="/" className="hover:text-[var(--cobalt)]">Discover</Link></li>
              <li><Link href="/season" className="hover:text-[var(--cobalt)]">This season</Link></li>
              <li><Link href="/schedule" className="hover:text-[var(--cobalt)]">Schedule</Link></li>
              <li><Link href="/library" className="hover:text-[var(--cobalt)]">My library</Link></li>
              <li><Link href="/stats" className="hover:text-[var(--cobalt)]">Stats</Link></li>
            </ul>
          </div>
          {stats && (
            <div>
              <h3 className="font-mono text-[10px] font-bold text-[var(--ink-soft)] uppercase tracking-wider mb-3">Database</h3>
              <ul className="space-y-2 text-sm text-[var(--ink-soft)] font-mono">
                <li>{stats.animeCount.toLocaleString()} titles</li>
                <li>{stats.episodeCount.toLocaleString()} episodes</li>
                <li>{stats.characterCount.toLocaleString()} characters</li>
                <li>{stats.releasingCount.toLocaleString()} airing now</li>
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-[var(--line)] pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[var(--ink-soft)] flex items-center gap-1.5">
            Built with <Heart className="w-3 h-3 text-[var(--signal)] fill-[var(--signal)]" /> · Self-hosted · No ads, no tracking
          </div>
          <a href="https://github.com/tasinfahad6767-beep/anicore-clone" target="_blank" rel="noopener"
            className="flex items-center gap-1.5 text-xs text-[var(--ink-soft)] hover:text-[var(--ink)]">
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
