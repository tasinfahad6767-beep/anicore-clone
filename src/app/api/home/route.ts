import { NextResponse } from 'next/server';
import { getTrending, getPopular, getTopRated, getNewest, getAiring, getUpcoming, getLatestSeason, getStats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [trending, popular, topRated, newest, airing, upcoming, latestSeason, stats] = [
      getTrending(8), getPopular(20), getTopRated(20),
      getNewest(20), getAiring(10), getUpcoming(10), getLatestSeason(12), getStats(),
    ];
    return NextResponse.json({ trending, popular, topRated, newest, airing, upcoming, latestSeason, stats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
