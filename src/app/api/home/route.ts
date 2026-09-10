import { NextResponse } from 'next/server';
import { getTrending, getPopular, getTopRated, getNewest, getAiring, getStats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [trending, popular, topRated, newest, airing, stats] = [
      getTrending(8), getPopular(20), getTopRated(20),
      getNewest(20), getAiring(30), getStats(),
    ];
    return NextResponse.json({ trending, popular, topRated, newest, airing, stats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
