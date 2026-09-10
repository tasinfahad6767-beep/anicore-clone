import { NextRequest, NextResponse } from 'next/server';
import { getDb, parseAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sort = req.nextUrl.searchParams.get('sort') || 'trending';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const perPage = parseInt(req.nextUrl.searchParams.get('perPage') || '24');
  const genre = req.nextUrl.searchParams.get('genre');
  const year = req.nextUrl.searchParams.get('year');
  const offset = (page - 1) * perPage;

  try {
    const db = getDb();
    
    let where = ['1=1'];
    let params: any[] = [];
    
    if (genre) {
      where.push('genres LIKE ?');
      params.push(`%"${genre}"%`);
    }
    if (year) {
      where.push('season_year = ?');
      params.push(parseInt(year));
    }
    
    const whereClause = where.join(' AND ');
    
    let orderClause = 'score_average DESC';
    if (sort === 'trending') orderClause = 'anilist_popularity DESC';
    else if (sort === 'popular') orderClause = 'mal_members DESC';
    else if (sort === 'newest') orderClause = 'season_year DESC, season DESC';
    else if (sort === 'score') orderClause = 'score_average DESC';
    
    const countRow = db.prepare(`SELECT COUNT(*) as total FROM anime WHERE ${whereClause}`).get(...params) as any;
    const total = countRow.total;
    
    const rows = db.prepare(
      `SELECT * FROM anime WHERE ${whereClause} ORDER BY ${orderClause} LIMIT ? OFFSET ?`
    ).all(...params, perPage, offset);
    
    const items = rows.map(parseAnime);
    
    return NextResponse.json({
      pageInfo: { page, perPage, total, lastPage: Math.ceil(total / perPage), hasNextPage: page * perPage < total },
      items,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, items: [] }, { status: 500 });
  }
}
