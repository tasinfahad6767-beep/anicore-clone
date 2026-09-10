#!/usr/bin/env python3
"""
AniCore Scraper — Downloads all anime metadata from anicore.dpdns.org API
Saves to SQLite database (no images, just URLs).

Usage:
    python3 scrape_anicore.py                    # Scrape all 32k anime
    python3 scrape_anicore.py --limit 100        # Scrape only 100 (testing)
    python3 scrape_anicore.py --resume            # Resume from last position
"""
import os
import sys
import json
import time
import sqlite3
import logging
import argparse
import requests
from datetime import datetime

BASE_URL = "https://anicore.dpdns.org/v1"
DB_FILE = os.environ.get("ANICORE_DB", "/var/lib/luffytv/anicore.db")
STATE_FILE = os.environ.get("ANICORE_STATE", "/var/lib/luffytv/anicore-scraper-state.json")
LOG_FILE = "/var/log/anicore-scraper.log"
DELAY = 0.3  # 300ms between requests = ~3 req/sec (safe)

os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler(LOG_FILE), logging.StreamHandler(sys.stdout)]
)
log = logging.getLogger("anicore-scraper")

session = requests.Session()
session.headers.update({"User-Agent": "AniCore-Scraper/1.0", "Accept": "application/json"})

# ============================================================
# DATABASE
# ============================================================
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    c.execute("""CREATE TABLE IF NOT EXISTS anime (
        id INTEGER PRIMARY KEY,
        slug TEXT UNIQUE,
        title TEXT, title_english TEXT, title_native TEXT,
        format TEXT, status TEXT, season TEXT, season_year INTEGER,
        start_date TEXT, end_date TEXT, start_date_precision TEXT,
        episode_count INTEGER, episodes_known INTEGER, duration_minutes INTEGER,
        poster_url TEXT, cover_url TEXT, banner_url TEXT, logo_url TEXT,
        trailer_url TEXT, trailer_youtube_id TEXT,
        score_average REAL, score_anilist INTEGER, score_mal REAL,
        mal_rank INTEGER, mal_members INTEGER, anilist_popularity INTEGER,
        is_adult INTEGER, data_quality INTEGER, hiatus TEXT,
        sources TEXT, genres TEXT, synopsis TEXT,
        scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS episodes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anime_id INTEGER, number INTEGER, season_number INTEGER,
        absolute_number INTEGER, title TEXT, synopsis TEXT,
        air_date TEXT, runtime_minutes INTEGER,
        thumbnail_url TEXT, thumbnail_source TEXT,
        title_source TEXT, air_date_source TEXT,
        FOREIGN KEY (anime_id) REFERENCES anime(id)
    )""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anime_id INTEGER, name TEXT, role TEXT, image_url TEXT,
        description TEXT, favorites INTEGER,
        FOREIGN KEY (anime_id) REFERENCES anime(id)
    )""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS streaming_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anime_id INTEGER, name TEXT, url TEXT, source TEXT,
        FOREIGN KEY (anime_id) REFERENCES anime(id)
    )""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS external_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anime_id INTEGER, name TEXT, url TEXT,
        FOREIGN KEY (anime_id) REFERENCES anime(id)
    )""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anime_id INTEGER, recommended_id INTEGER,
        recommended_title TEXT, recommended_slug TEXT,
        recommended_poster TEXT, recommended_format TEXT,
        FOREIGN KEY (anime_id) REFERENCES anime(id)
    )""")
    
    c.execute("""CREATE TABLE IF NOT EXISTS relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        anime_id INTEGER, relation_type TEXT,
        related_id INTEGER, related_title TEXT, related_slug TEXT,
        related_poster TEXT, related_format TEXT,
        FOREIGN KEY (anime_id) REFERENCES anime(id)
    )""")
    
    # Indexes for fast queries
    c.execute("CREATE INDEX IF NOT EXISTS idx_anime_slug ON anime(slug)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_anime_year ON anime(season_year)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_anime_score ON anime(score_average DESC)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_episodes_anime ON episodes(anime_id)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_chars_anime ON characters(anime_id)")
    
    conn.commit()
    conn.close()
    log.info(f"Database initialized: {DB_FILE}")

# ============================================================
# STATE MANAGEMENT
# ============================================================
def load_state():
    try:
        with open(STATE_FILE) as f:
            return json.load(f)
    except:
        return {"last_page": 1, "total_scraped": 0, "started_at": datetime.now().isoformat()}

def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)

# ============================================================
# API FETCHING
# ============================================================
def api_get(path, timeout=20):
    url = f"{BASE_URL}{path}"
    try:
        r = session.get(url, timeout=timeout)
        if r.status_code == 200:
            return r.json()
        elif r.status_code == 429:
            log.warning(f"Rate limited, waiting 10s...")
            time.sleep(10)
            return api_get(path, timeout)
        else:
            log.warning(f"HTTP {r.status_code} for {path}")
            return None
    except Exception as e:
        log.error(f"Error fetching {path}: {e}")
        return None

def fetch_anime_list(page, per_page=50):
    return api_get(f"/anime?sort=trending&page={page}&perPage={per_page}")

def fetch_anime_detail(slug):
    return api_get(f"/anime/{slug}")

def fetch_episodes(slug):
    all_eps = []
    page = 1
    while True:
        data = api_get(f"/anime/{slug}/episodes?page={page}&perPage=100")
        if not data or not data.get("items"):
            break
        all_eps.extend(data["items"])
        if not data.get("pageInfo", {}).get("hasNextPage"):
            break
        page += 1
        time.sleep(DELAY)
    return all_eps

def fetch_characters(slug):
    data = api_get(f"/anime/{slug}/characters?limit=200")
    return data.get("items", []) if data else []

def fetch_streaming(slug):
    data = api_get(f"/anime/{slug}/streaming")
    return data.get("items", []) if data else []

def fetch_external(slug):
    data = api_get(f"/anime/{slug}/external")
    return data.get("items", []) if data else []

def fetch_recommendations(slug):
    data = api_get(f"/anime/{slug}/recommendations?limit=20")
    return data.get("items", []) if data else []

def fetch_relations(slug):
    data = api_get(f"/anime/{slug}/relations")
    return data.get("items", []) if data else []

# ============================================================
# DATABASE SAVING
# ============================================================
def save_anime(conn, anime_data):
    c = conn.cursor()
    images = anime_data.get("images", {}) or {}
    scores = anime_data.get("scores", {}) or {}
    trailer = anime_data.get("trailer", {}) or {}
    start_date = anime_data.get("startDate", "")
    
    c.execute("""INSERT OR REPLACE INTO anime (
        id, slug, title, title_english, title_native,
        format, status, season, season_year,
        start_date, end_date, start_date_precision,
        episode_count, episodes_known, duration_minutes,
        poster_url, cover_url, banner_url, logo_url,
        trailer_url, trailer_youtube_id,
        score_average, score_anilist, score_mal,
        mal_rank, mal_members, anilist_popularity,
        is_adult, data_quality, hiatus,
        sources, genres, synopsis
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
    (
        anime_data.get("id"), anime_data.get("slug"),
        anime_data.get("title"), anime_data.get("titleEnglish"),
        anime_data.get("titleNative"),
        anime_data.get("format"), anime_data.get("status"),
        anime_data.get("season"), anime_data.get("seasonYear"),
        str(start_date) if start_date else None,
        anime_data.get("endDate"), anime_data.get("startDatePrecision"),
        anime_data.get("episodeCount"), anime_data.get("episodesKnown"),
        anime_data.get("durationMinutes"),
        images.get("poster"), images.get("cover"),
        images.get("banner"), images.get("logo"),
        trailer.get("url"), trailer.get("youtubeId"),
        scores.get("average"), scores.get("anilist"), scores.get("mal"),
        scores.get("malRank"), scores.get("malMembers"),
        scores.get("anilistPopularity"),
        1 if anime_data.get("isAdult") else 0,
        anime_data.get("dataQuality"), anime_data.get("hiatus"),
        json.dumps(anime_data.get("sources", [])),
        json.dumps(anime_data.get("genres", [])),
        anime_data.get("synopsis") or anime_data.get("description")
    ))
    conn.commit()

def save_episodes(conn, anime_id, episodes):
    c = conn.cursor()
    c.execute("DELETE FROM episodes WHERE anime_id = ?", (anime_id,))
    for ep in episodes:
        c.execute("""INSERT INTO episodes (
            anime_id, number, season_number, absolute_number,
            title, synopsis, air_date, runtime_minutes,
            thumbnail_url, thumbnail_source, title_source, air_date_source
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)""",
        (anime_id, ep.get("number"), ep.get("seasonNumber"),
         ep.get("absoluteNumber"), ep.get("title"), ep.get("synopsis"),
         ep.get("airDate"), ep.get("runtimeMinutes"),
         ep.get("thumbnail"), ep.get("thumbnailSource"),
         ep.get("titleSource"), ep.get("airDateSource")))
    conn.commit()

def save_characters(conn, anime_id, characters):
    c = conn.cursor()
    c.execute("DELETE FROM characters WHERE anime_id = ?", (anime_id,))
    for ch in characters:
        c.execute("""INSERT INTO characters (anime_id, name, role, image_url, description, favorites)
        VALUES (?,?,?,?,?,?)""",
        (anime_id, ch.get("name"), ch.get("role"),
         ch.get("image") or ch.get("image_url"),
         ch.get("description"), ch.get("favorites")))
    conn.commit()

def save_streaming(conn, anime_id, links):
    c = conn.cursor()
    c.execute("DELETE FROM streaming_links WHERE anime_id = ?", (anime_id,))
    for link in links:
        c.execute("INSERT INTO streaming_links (anime_id, name, url, source) VALUES (?,?,?,?)",
                  (anime_id, link.get("name"), link.get("url"), link.get("source")))
    conn.commit()

def save_external(conn, anime_id, links):
    c = conn.cursor()
    c.execute("DELETE FROM external_links WHERE anime_id = ?", (anime_id,))
    for link in links:
        c.execute("INSERT INTO external_links (anime_id, name, url) VALUES (?,?,?)",
                  (anime_id, link.get("name"), link.get("url")))
    conn.commit()

def save_recommendations(conn, anime_id, recs):
    c = conn.cursor()
    c.execute("DELETE FROM recommendations WHERE anime_id = ?", (anime_id,))
    for rec in recs:
        c.execute("""INSERT INTO recommendations (anime_id, recommended_id, recommended_title, recommended_slug, recommended_poster, recommended_format)
        VALUES (?,?,?,?,?,?)""",
        (anime_id, rec.get("id"), rec.get("title"), rec.get("slug"),
         rec.get("poster") or (rec.get("images",{}) or {}).get("poster"),
         rec.get("format")))
    conn.commit()

def save_relations(conn, anime_id, relations):
    c = conn.cursor()
    c.execute("DELETE FROM relations WHERE anime_id = ?", (anime_id,))
    for rel in relations:
        c.execute("""INSERT INTO relations (anime_id, relation_type, related_id, related_title, related_slug, related_poster, related_format)
        VALUES (?,?,?,?,?,?,?)""",
        (anime_id, rel.get("type") or rel.get("relationType"),
         rel.get("id"), rel.get("title"), rel.get("slug"),
         (rel.get("images",{}) or {}).get("poster"),
         rel.get("format")))
    conn.commit()

# ============================================================
# MAIN SCRAPE LOOP
# ============================================================
def scrape_anime_full(conn, slug, anime_id=None):
    """Scrape all data for one anime (detail + episodes + characters + etc)."""
    detail = fetch_anime_detail(slug)
    if not detail:
        return False
    
    save_anime(conn, detail)
    anime_id = detail.get("id")
    
    # Episodes
    episodes = fetch_episodes(slug)
    if episodes:
        save_episodes(conn, anime_id, episodes)
    
    time.sleep(DELAY)
    
    # Characters
    characters = fetch_characters(slug)
    if characters:
        save_characters(conn, anime_id, characters)
    
    time.sleep(DELAY)
    
    # Streaming
    streaming = fetch_streaming(slug)
    if streaming:
        save_streaming(conn, anime_id, streaming)
    
    # External links
    external = fetch_external(slug)
    if external:
        save_external(conn, anime_id, external)
    
    time.sleep(DELAY)
    
    # Recommendations
    recs = fetch_recommendations(slug)
    if recs:
        save_recommendations(conn, anime_id, recs)
    
    # Relations
    relations = fetch_relations(slug)
    if relations:
        save_relations(conn, anime_id, relations)
    
    return True

def main():
    parser = argparse.ArgumentParser(description="AniCore Scraper")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of anime (0 = all)")
    parser.add_argument("--resume", action="store_true", help="Resume from last position")
    args = parser.parse_args()
    
    init_db()
    conn = sqlite3.connect(DB_FILE)
    
    state = load_state() if args.resume else {"last_page": 1, "total_scraped": 0, "started_at": datetime.now().isoformat()}
    start_page = state.get("last_page", 1)
    total_scraped = state.get("total_scraped", 0)
    
    log.info("=" * 60)
    log.info("AniCore Scraper — Starting")
    log.info(f"Database: {DB_FILE}")
    log.info(f"Starting at page {start_page}")
    log.info(f"Already scraped: {total_scraped}")
    log.info("=" * 60)
    
    # Get total count
    first_page = fetch_anime_list(1, per_page=1)
    total_anime = first_page.get("pageInfo", {}).get("total", 0) if first_page else 0
    log.info(f"Total anime in AniCore: {total_anime}")
    
    limit = args.limit if args.limit > 0 else total_anime
    per_page = 50
    
    for page in range(start_page, (limit // per_page) + 2):
        log.info(f"\n--- Page {page} ---")
        data = fetch_anime_list(page, per_page=per_page)
        if not data or not data.get("items"):
            log.info("No more results")
            break
        
        items = data["items"]
        log.info(f"Got {len(items)} anime on this page")
        
        for i, item in enumerate(items):
            slug = item.get("slug")
            anime_id = item.get("id")
            title = item.get("title", "?")
            
            if not slug:
                continue
            
            log.info(f"  [{total_scraped + 1}/{limit}] {title} (slug: {slug})")
            
            try:
                success = scrape_anime_full(conn, slug, anime_id)
                if success:
                    total_scraped += 1
                    log.info(f"    ✅ Saved (episodes, characters, streaming, recs, relations)")
                else:
                    log.warning(f"    ⚠️ Failed")
            except Exception as e:
                log.error(f"    ❌ Error: {e}")
            
            time.sleep(DELAY)
            
            if total_scraped >= limit:
                log.info(f"\nReached limit of {limit}")
                break
        
        # Save state
        state["last_page"] = page + 1
        state["total_scraped"] = total_scraped
        save_state(state)
        
        if total_scraped >= limit:
            break
        
        time.sleep(1)
    
    # Final stats
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM anime")
    db_anime_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM episodes")
    db_ep_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM characters")
    db_char_count = c.fetchone()[0]
    
    db_size = os.path.getsize(DB_FILE) / 1024 / 1024
    
    log.info("\n" + "=" * 60)
    log.info("SCRAPING COMPLETE!")
    log.info(f"  Anime in DB:     {db_anime_count:,}")
    log.info(f"  Episodes in DB:  {db_ep_count:,}")
    log.info(f"  Characters:      {db_char_count:,}")
    log.info(f"  Database size:   {db_size:.1f} MB")
    log.info("=" * 60)
    
    conn.close()

if __name__ == "__main__":
    main()
