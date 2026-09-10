import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export function Footer({ stats }: { stats?: { animeCount: number; episodeCount: number; characterCount: number; releasingCount: number } }) {
  return (
    <footer className="mt-16 border-t border-zinc-800/80 bg-[#0a0a0f]">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center font-black text-white text-xs">A</div>
              <span className="text-base font-bold bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">AniCore</span>
            </div>
            <p className="text-xs text-zinc-500 max-w-md">
              A living anime index unified across Kitsu, TVDB, TMDB, AniList, and MyAnimeList. Self-hosted, fast, no ads.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wider">Browse</h3>
            <ul className="space-y-1 text-xs text-zinc-500">
              <li><Link href="/" className="hover:text-rose-400">Home</Link></li>
              <li><Link href="/library" className="hover:text-rose-400">Library</Link></li>
              <li><Link href="/schedule" className="hover:text-rose-400">Schedule</Link></li>
              <li><Link href="/random" className="hover:text-rose-400">Surprise me</Link></li>
            </ul>
          </div>
          {stats && (
            <div>
              <h3 className="text-xs font-bold text-zinc-300 mb-2 uppercase tracking-wider">Database</h3>
              <ul className="space-y-1 text-xs text-zinc-500">
                <li>{stats.animeCount.toLocaleString()} anime</li>
                <li>{stats.episodeCount.toLocaleString()} episodes</li>
                <li>{stats.characterCount.toLocaleString()} characters</li>
                <li>{stats.releasingCount.toLocaleString()} airing now</li>
              </ul>
            </div>
          )}
        </div>
        <div className="border-t border-zinc-900 pt-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-600 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> · Self-hosted · No ads, no tracking
          </div>
          <a href="https://github.com/tasinfahad6767-beep/anicore-clone" target="_blank" rel="noopener"
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-white">
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
