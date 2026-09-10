import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    // Get currently airing anime (status = RELEASING)
    const rows = db.prepare(
      `SELECT * FROM anime WHERE status = 'RELEASING' ORDER BY anilist_popularity DESC LIMIT 20`
    ).all();
    
    return NextResponse.json({ items: rows.map(parseAnime) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, items: [] }, { status: 500 });
  }
}
