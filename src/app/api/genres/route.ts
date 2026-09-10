import { NextResponse } from 'next/server';
import { getDistinctGenres } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({ genres: getDistinctGenres() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, genres: [] }, { status: 500 });
  }
}
