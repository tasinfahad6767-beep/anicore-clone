import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

function getDbPath() {
  // On VPS: /var/lib/luffytv/anicore.db
  // Local dev: ./anicore.db
  if (process.env.ANICORE_DB) return process.env.ANICORE_DB;
  if (process.env.NODE_ENV === 'production') return '/var/lib/luffytv/anicore.db';
  return path.join(process.cwd(), 'anicore.db');
}

export function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    db = new Database(dbPath, { readonly: true, fileMustExist: false });
  }
  return db;
}

export interface Anime {
  id: number;
  slug: string;
  title: string;
  title_english: string | null;
  title_native: string | null;
  format: string | null;
  status: string | null;
  season: string | null;
  season_year: number | null;
  episode_count: number | null;
  episodes_known: number | null;
  duration_minutes: number | null;
  poster_url: string | null;
  cover_url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  score_average: number | null;
  score_anilist: number | null;
  score_mal: number | null;
  mal_rank: number | null;
  mal_members: number | null;
  is_adult: number;
  genres: string; // JSON array
  sources: string; // JSON array
  synopsis: string | null;
}

export function parseAnime(row: any): Anime {
  return {
    ...row,
    genres: typeof row.genres === 'string' ? JSON.parse(row.genres || '[]') : row.genres || [],
    sources: typeof row.sources === 'string' ? JSON.parse(row.sources || '[]') : row.sources || [],
  };
}
