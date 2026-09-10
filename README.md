# AniCore Clone — The Living Anime Index

A self-hosted anime database with 32,372 anime, episodes, characters, and more.
Scraped from [anicore.dpdns.org](https://anicore.dpdns.org) API.

## What it does

1. **Scraper** (`scraper/scrape_anicore.py`) — Downloads all anime metadata from AniCore's API into SQLite (~3 GB)
2. **Frontend** (Next.js) — Browse, search, and view anime details
3. **API** — REST API serving from local SQLite (no external dependencies)

## Quick Start

### 1. Run the scraper (on VPS)
```bash
python3 scraper/scrape_anicore.py --limit 100  # Test with 100 first
python3 scraper/scrape_anicore.py --resume     # Then scrape all 32k
```

### 2. Run the frontend
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Data stored (SQLite ~3 GB)

| Table | Records |
|-------|---------|
| anime | 32,372 |
| episodes | ~970,000 |
| characters | ~100,000 |
| streaming_links | ~15,000 |
| external_links | ~160,000 |
| recommendations | ~50,000 |
| relations | ~30,000 |

Images are NOT downloaded — URLs point to Kitsu/AniList/TMDB CDN (free).

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/browse?sort=trending&page=1&perPage=24` | Browse anime |
| `GET /api/anime/{slug}` | Anime details + episodes + characters |
| `GET /api/search?q=one+piece` | Search by title |
| `GET /api/airing` | Currently airing anime |
