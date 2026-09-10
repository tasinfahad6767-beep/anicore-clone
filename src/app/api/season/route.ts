import { NextResponse } from 'next/server';
import { getLatestSeason, getAiring, getUpcoming } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [season, airing, upcoming] = [getLatestSeason(24), getAiring(30), getUpcoming(20)];
    const year = season[0]?.season_year || new Date().getFullYear();
    const seasonName = season[0]?.season || 'Current';
    return NextResponse.json({
      season: `${seasonName} ${year}`,
      year,
      items: season,
      airing,
      upcoming,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
