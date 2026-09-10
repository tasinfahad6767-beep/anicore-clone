import { NextResponse } from 'next/server';
import { getTrending, getPopular, getTopRated, getNewest, getAiring, getUpcoming, getLatestSeason, getStats, getGenreStats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const t0 = performance.now();
  try {
    const trending = getTrending(8);
    const t1 = performance.now();
    const popular = getPopular(20);
    const t2 = performance.now();
    const topRated = getTopRated(20);
    const t3 = performance.now();
    const newest = getNewest(20);
    const t4 = performance.now();
    const airing = getAiring(10);
    const t5 = performance.now();
    const upcoming = getUpcoming(10);
    const t6 = performance.now();
    const latestSeason = getLatestSeason(12);
    const t7 = performance.now();
    const stats = getStats();
    const t8 = performance.now();
    const genres = getGenreStats();
    const t9 = performance.now();

    const data = { trending, popular, topRated, newest, airing, upcoming, latestSeason, stats, genres };

    const t10 = performance.now();
    const json = JSON.stringify(data);
    const t11 = performance.now();

    console.log(`[api/home] trending:${(t1-t0).toFixed(0)}ms popular:${(t2-t1).toFixed(0)}ms topRated:${(t3-t2).toFixed(0)}ms newest:${(t4-t3).toFixed(0)}ms airing:${(t5-t4).toFixed(0)}ms upcoming:${(t6-t5).toFixed(0)}ms season:${(t7-t6).toFixed(0)}ms stats:${(t8-t7).toFixed(0)}ms genres:${(t9-t8).toFixed(0)}ms stringify:${(t11-t10).toFixed(0)}ms total:${(t11-t0).toFixed(0)}ms size:${(json.length/1024).toFixed(0)}KB`);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
