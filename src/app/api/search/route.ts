import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');
  
  if (!q) return NextResponse.json({ items: [] });
  
  try {
    const db = getDb();
    const rows = db.prepare(
      `SELECT * FROM anime WHERE title LIKE ? OR title_english LIKE ? OR title_native LIKE ? ORDER BY score_average DESC LIMIT ?`
    ).all(`%${q}%`, `%${q}%`, `%${q}%`, limit);
    
    return NextResponse.json({ items: rows.map(parseAnime) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, items: [] }, { status: 500 });
  }
}
