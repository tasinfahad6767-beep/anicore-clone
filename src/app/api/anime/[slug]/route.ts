import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM anime WHERE slug = ?').get(slug);
    if (!row) {
      return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    }
    const anime = parseAnime(row);
    const id = (row as any).id;
    
    const episodes = db.prepare('SELECT * FROM episodes WHERE anime_id = ? ORDER BY number').all(id);
    const characters = db.prepare('SELECT * FROM characters WHERE anime_id = ? ORDER BY CASE role WHEN "MAIN" THEN 0 WHEN "SUPPORTING" THEN 1 ELSE 2 END, name').all(id);
    const streaming = db.prepare('SELECT * FROM streaming_links WHERE anime_id = ?').all(id);
    const external = db.prepare('SELECT * FROM external_links WHERE anime_id = ?').all(id);
    const recommendations = db.prepare('SELECT * FROM recommendations WHERE anime_id = ?').all(id);
    const relations = db.prepare('SELECT * FROM relations WHERE anime_id = ?').all(id);
    
    return NextResponse.json({ anime, episodes, characters, streaming, external, recommendations, relations });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
