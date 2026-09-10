import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

function getDbPath() {
  if (process.env.ANICORE_DB) return process.env.ANICORE_DB;
  if (process.env.NODE_ENV === 'production') return '/var/lib/luffytv/anicore.db';
  return path.join(process.cwd(), 'anicore.db');
}

export function getDb() {
  if (!db) {
    const dbPath = getDbPath();
    db = new Database(dbPath, { readonly: true, fileMustExist: false });
    // Note: journal_mode pragma requires write access, skip for readonly
    db.pragma('cache_size = -32000'); // 32MB cache
  }
  return db;
}

// ===================== TYPES =====================
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
  start_date: string | null;
  end_date: string | null;
  episode_count: number | null;
  episodes_known: number | null;
  duration_minutes: number | null;
  poster_url: string | null;
  cover_url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  trailer_url: string | null;
  trailer_youtube_id: string | null;
  score_average: number | null;
  score_anilist: number | null;
  score_mal: number | null;
  mal_rank: number | null;
  mal_members: number | null;
  anilist_popularity: number | null;
  is_adult: number;
  genres: string[];
  sources: string[];
  synopsis: string | null;
}

export interface Episode {
  id: number;
  anime_id: number;
  number: number;
  season_number: number | null;
  absolute_number: number | null;
  title: string | null;
  synopsis: string | null;
  air_date: string | null;
  runtime_minutes: number | null;
  thumbnail_url: string | null;
  thumbnail_source: string | null;
}

export interface Character {
  id: number;
  anime_id: number;
  name: string;
  role: string;
  image_url: string | null;
  description: string | null;
  favorites: number | null;
}

export interface StreamingLink {
  id: number;
  anime_id: number;
  name: string;
  url: string;
  quality: string | null;
  language: string | null;
}

export interface ExternalLink {
  id: number;
  anime_id: number;
  name: string;
  url: string;
  type: string | null;
}

export interface Recommendation {
  id: number;
  anime_id: number;
  recommended_id: number;
  recommended_slug: string;
  recommended_title: string;
  recommended_poster: string | null;
}

export interface Relation {
  id: number;
  anime_id: number;
  relation_type: string;
  target_id: number;
  target_slug: string;
  target_title: string;
  target_poster: string | null;
  target_format: string | null;
}

// ===================== HELPERS =====================
export function parseAnime(row: any): Anime {
  if (!row) return row;
  return {
    ...row,
    genres: typeof row.genres === 'string' ? JSON.parse(row.genres || '[]') : row.genres || [],
    sources: typeof row.sources === 'string' ? JSON.parse(row.sources || '[]') : row.sources || [],
  };
}

// ===================== QUERIES =====================
export function getAnimeBySlug(slug: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM anime WHERE slug = ?').get(slug);
  return row ? parseAnime(row) : null;
}

export function getAnimeFullData(slug: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM anime WHERE slug = ?').get(slug) as any;
  if (!row) return null;
  const anime = parseAnime(row);
  const id = row.id;

  const episodes = db.prepare(
    'SELECT * FROM episodes WHERE anime_id = ? ORDER BY COALESCE(absolute_number, number) ASC'
  ).all(id) as Episode[];

  const characters = db.prepare(
    `SELECT * FROM characters WHERE anime_id = ? ORDER BY CASE role WHEN 'MAIN' THEN 0 WHEN 'SUPPORTING' THEN 1 ELSE 2 END, name`
  ).all(id) as Character[];

  const streaming = db.prepare(
    'SELECT * FROM streaming_links WHERE anime_id = ? ORDER BY name'
  ).all(id) as StreamingLink[];

  const external = db.prepare(
    'SELECT * FROM external_links WHERE anime_id = ? ORDER BY name'
  ).all(id) as ExternalLink[];

  const recommendations = db.prepare(
    'SELECT * FROM recommendations WHERE anime_id = ? LIMIT 24'
  ).all(id) as Recommendation[];

  const relations = db.prepare(
    'SELECT * FROM relations WHERE anime_id = ? ORDER BY relation_type'
  ).all(id) as Relation[];

  return { anime, episodes, characters, streaming, external, recommendations, relations };
}

export function listAnime(opts: {
  sort?: string; page?: number; perPage?: number;
  genre?: string; year?: string; format?: string; status?: string;
  query?: string;
}) {
  const db = getDb();
  const {
    sort = 'trending', page = 1, perPage = 24,
    genre, year, format, status, query,
  } = opts;
  const offset = (page - 1) * perPage;

  const where: string[] = ['1=1'];
  const params: any[] = [];

  if (genre) {
    where.push('genres LIKE ?');
    params.push(`%"${genre}"%`);
  }
  if (year) {
    where.push('season_year = ?');
    params.push(parseInt(year));
  }
  if (format) {
    where.push('format = ?');
    params.push(format);
  }
  if (status) {
    where.push('status = ?');
    params.push(status);
  }
  if (query) {
    where.push('(title LIKE ? OR title_english LIKE ? OR title_native LIKE ?)');
    params.push(`%${query}%`, `%${query}%`, `%${query}%`);
  }

  const whereClause = where.join(' AND ');

  let orderClause = 'score_average DESC NULLS LAST';
  if (sort === 'trending') orderClause = 'anilist_popularity DESC NULLS LAST';
  else if (sort === 'popular') orderClause = 'mal_members DESC NULLS LAST';
  else if (sort === 'newest') orderClause = 'season_year DESC, season DESC';
  else if (sort === 'score') orderClause = 'score_average DESC NULLS LAST';
  else if (sort === 'az') orderClause = 'title COLLATE NOCASE ASC';

  const countRow = db.prepare(`SELECT COUNT(*) as total FROM anime WHERE ${whereClause}`).get(...params) as any;
  const total = countRow?.total ?? 0;

  const rows = db.prepare(
    `SELECT * FROM anime WHERE ${whereClause} ORDER BY ${orderClause} LIMIT ? OFFSET ?`
  ).all(...params, perPage, offset);

  return {
    items: rows.map(parseAnime),
    pageInfo: {
      page, perPage, total,
      lastPage: Math.max(1, Math.ceil(total / perPage)),
      hasNextPage: page * perPage < total,
    },
  };
}

export function getTrending(limit = 12) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM anime WHERE banner_url IS NOT NULL AND anilist_popularity IS NOT NULL ORDER BY anilist_popularity DESC LIMIT ?`
  ).all(limit).map(parseAnime);
}

export function getPopular(limit = 20) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM anime WHERE mal_members IS NOT NULL ORDER BY mal_members DESC LIMIT ?`
  ).all(limit).map(parseAnime);
}

export function getTopRated(limit = 20) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM anime WHERE score_average IS NOT NULL ORDER BY score_average DESC LIMIT ?`
  ).all(limit).map(parseAnime);
}

export function getNewest(limit = 20) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM anime WHERE season_year IS NOT NULL ORDER BY season_year DESC, season DESC LIMIT ?`
  ).all(limit).map(parseAnime);
}

export function getAiring(limit = 30) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM anime WHERE status = 'RELEASING' ORDER BY anilist_popularity DESC LIMIT ?`
  ).all(limit).map(parseAnime);
}

export function getDistinctGenres(): string[] {
  const db = getDb();
  const rows = db.prepare(`SELECT DISTINCT genres FROM anime WHERE genres IS NOT NULL`).all() as any[];
  const set = new Set<string>();
  for (const r of rows) {
    try {
      const arr: string[] = JSON.parse(r.genres || '[]');
      arr.forEach(g => set.add(g));
    } catch {}
  }
  return Array.from(set).sort();
}

export function getDistinctYears(): number[] {
  const db = getDb();
  const rows = db.prepare(
    `SELECT DISTINCT season_year FROM anime WHERE season_year IS NOT NULL ORDER BY season_year DESC`
  ).all() as any[];
  return rows.map(r => r.season_year);
}

export function getDistinctFormats(): string[] {
  const db = getDb();
  const rows = db.prepare(
    `SELECT DISTINCT format FROM anime WHERE format IS NOT NULL ORDER BY format`
  ).all() as any[];
  return rows.map(r => r.format);
}

export function getRandomAnime(limit = 1) {
  const db = getDb();
  return db.prepare(
    `SELECT * FROM anime WHERE poster_url IS NOT NULL ORDER BY RANDOM() LIMIT ?`
  ).all(limit).map(parseAnime);
}

export function getStats() {
  const db = getDb();
  const animeCount = (db.prepare('SELECT COUNT(*) as c FROM anime').get() as any)?.c ?? 0;
  const episodeCount = (db.prepare('SELECT COUNT(*) as c FROM episodes').get() as any)?.c ?? 0;
  const characterCount = (db.prepare('SELECT COUNT(*) as c FROM characters').get() as any)?.c ?? 0;
  const releasingCount = (db.prepare(`SELECT COUNT(*) as c FROM anime WHERE status = 'RELEASING'`).get() as any)?.c ?? 0;
  return { animeCount, episodeCount, characterCount, releasingCount };
}
