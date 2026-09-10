import { NextResponse } from 'next/server';
import { getTrending, getPopular, getTopRated, getNewest, getAiring, getUpcoming, getLatestSeason, getStats, getGenreStats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60; // cache for 60 seconds

export async function GET() {
  try {
    // Run all queries — they're fast now with indexes
    const [trending, popular, topRated, newest, airing, upcoming, latestSeason, stats, genres] = [
      getTrending(8), getPopular(20), getTopRated(20),
      getNewest(20), getAiring(10), getUpcoming(10), getLatestSeason(12), getStats(),
      getGenreStats(),
    ];

    const data = { trending, popular, topRated, newest, airing, upcoming, latestSeason, stats, genres };

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
