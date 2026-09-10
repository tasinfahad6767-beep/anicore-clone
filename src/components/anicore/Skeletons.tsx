export function RowSkeleton() {
  return (
    <section className="my-8 md:my-12">
      <div className="h-7 bg-[var(--paper-strong)] rounded w-64 mb-3 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-[170px] shrink-0">
            <div className="aspect-[2/3] bg-[var(--paper-strong)] rounded-xl animate-pulse" />
            <div className="h-3 bg-[var(--paper-strong)] rounded mt-2 w-3/4 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DetailSkeleton() {
  return (
    <div>
      <div className="h-[400px] bg-[var(--paper-strong)] animate-pulse rounded-3xl" />
      <div className="max-w-[1480px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="w-48 h-72 bg-[var(--paper-strong)] rounded-xl animate-pulse shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-9 bg-[var(--paper-strong)] rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-[var(--paper-strong)] rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-[var(--paper-strong)] rounded w-1/3 animate-pulse" />
            <div className="h-24 bg-[var(--paper-strong)] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
