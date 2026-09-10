'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  lastPage: number;
  onPage: (p: number) => void;
}

export function Pagination({ page, lastPage, onPage }: Props) {
  if (lastPage <= 1) return null;
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(lastPage, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex justify-center items-center gap-1.5 mt-8">
      <button onClick={() => onPage(page - 1)} disabled={page === 1}
        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:border-zinc-700 text-zinc-300">
        <ChevronLeft className="w-4 h-4" />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPage(1)} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 text-xs">1</button>
          {start > 2 && <span className="text-zinc-600 px-1">…</span>}
        </>
      )}
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`min-w-[32px] px-2.5 py-1.5 rounded-lg text-xs font-medium ${
            p === page ? 'bg-rose-500 text-white' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
          }`}>
          {p}
        </button>
      ))}
      {end < lastPage && (
        <>
          {end < lastPage - 1 && <span className="text-zinc-600 px-1">…</span>}
          <button onClick={() => onPage(lastPage)} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 text-xs">{lastPage}</button>
        </>
      )}
      <button onClick={() => onPage(page + 1)} disabled={page >= lastPage}
        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 disabled:opacity-30 hover:border-zinc-700 text-zinc-300">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
