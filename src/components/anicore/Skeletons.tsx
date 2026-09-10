export function RowSkeleton() {
  return (
    <section className="mb-8">
      <div className="h-6 bg-zinc-900 rounded w-48 mb-3 animate-pulse" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="w-[140px] md:w-[160px] shrink-0">
            <div className="aspect-[2/3] bg-zinc-900 rounded-lg animate-pulse" />
            <div className="h-3 bg-zinc-900 rounded mt-2 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="h-[300px] bg-zinc-900 animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 py-6 -mt-32 relative">
        <div className="flex gap-6">
          <div className="w-48 h-72 bg-zinc-900 rounded-lg animate-pulse shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-zinc-900 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-zinc-900 rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-zinc-900 rounded w-1/3 animate-pulse" />
            <div className="h-20 bg-zinc-900 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
