'use client';

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
    <div className="episode-pagination" style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '48px', flexWrap: 'wrap' }}>
      <button onClick={() => onPage(page - 1)} disabled={page === 1}>←</button>
      {start > 1 && (
        <>
          <button onClick={() => onPage(1)}>1</button>
          {start > 2 && <span style={{ alignSelf: 'center' }}>…</span>}
        </>
      )}
      {pages.map(p => (
        <button key={p} onClick={() => onPage(p)} style={p === page ? { background: 'var(--cobalt)', color: 'white', borderColor: 'var(--cobalt)' } : {}}>
          {p}
        </button>
      ))}
      {end < lastPage && (
        <>
          {end < lastPage - 1 && <span style={{ alignSelf: 'center' }}>…</span>}
          <button onClick={() => onPage(lastPage)}>{lastPage}</button>
        </>
      )}
      <button onClick={() => onPage(page + 1)} disabled={page >= lastPage}>→</button>
    </div>
  );
}
