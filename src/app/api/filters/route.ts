import { NextResponse } from 'next/server';
import { getDistinctYears, getDistinctFormats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function GET() {
  try {
    return NextResponse.json({ years: getDistinctYears(), formats: getDistinctFormats() }, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, years: [], formats: [] }, { status: 500 });
  }
}
