import { NextResponse } from 'next/server';
import { getStats, getGenreStats, getYearDistribution, getDistinctFormats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function GET() {
  try {
    const [stats, genres, years, formats] = [getStats(), getGenreStats(), getYearDistribution(), getDistinctFormats()];
    return NextResponse.json({ stats, genres, years, formats }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
