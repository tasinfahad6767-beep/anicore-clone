import { NextResponse } from 'next/server';
import { getStats, getGenreStats, getYearDistribution, getDistinctFormats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [stats, genres, years, formats] = [getStats(), getGenreStats(), getYearDistribution(), getDistinctFormats()];
    return NextResponse.json({ stats, genres, years, formats });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
