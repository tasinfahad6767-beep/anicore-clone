import { NextRequest, NextResponse } from 'next/server';
import { getAnimeFullData } from '@/lib/anicore/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const data = getAnimeFullData(slug);
    if (!data) return NextResponse.json({ error: 'Anime not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
