import { NextRequest, NextResponse } from 'next/server';
import { listAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sort = req.nextUrl.searchParams.get('sort') || 'trending';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const perPage = parseInt(req.nextUrl.searchParams.get('perPage') || '24');
  const genre = req.nextUrl.searchParams.get('genre') || '';
  const year = req.nextUrl.searchParams.get('year') || '';
  const format = req.nextUrl.searchParams.get('format') || '';
  const status = req.nextUrl.searchParams.get('status') || '';

  try {
    const result = listAnime({ sort, page, perPage, genre, year, format, status });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message, items: [], pageInfo: { total: 0 } }, { status: 500 });
  }
}
