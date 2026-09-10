import { NextResponse } from 'next/server';
import { getAiring } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const items = getAiring(30);
    return NextResponse.json({ items }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, items: [] }, { status: 500 });
  }
}
