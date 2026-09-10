import { NextResponse } from 'next/server';
import { getRandomAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = getRandomAnime(1);
    if (!items.length) return NextResponse.json({ error: 'No anime found' }, { status: 404 });
    return NextResponse.json({ anime: items[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
