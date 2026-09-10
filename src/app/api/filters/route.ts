import { NextResponse } from 'next/server';
import { getDistinctYears, getDistinctFormats } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      years: getDistinctYears(),
      formats: getDistinctFormats(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, years: [], formats: [] }, { status: 500 });
  }
}
