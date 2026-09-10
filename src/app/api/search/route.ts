import { NextRequest, NextResponse } from 'next/server';
import { listAnime } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

  if (!q) return NextResponse.json({ items: [] });

  try {
    const result = listAnime({ query: q, perPage: limit, sort: 'popular' });
    return NextResponse.json({ items: result.items });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, items: [] }, { status: 500 });
  }
}
