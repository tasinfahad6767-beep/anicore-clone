# AniCore Clone

A self-hosted anime index, clone of [anicore.dpdns.org](https://anicore.dpdns.org). Built with Next.js 16, TypeScript, Tailwind CSS, and SQLite.

## Features

- **Home page**: Hero carousel + horizontal rows (Trending, Popular, Top Rated, Newest, Airing Now) + library browser
- **Anime detail page**: Banner hero, poster, scores (AniList/MAL), synopsis (expandable), genres, streaming links, external links, characters grid (filtered by role), relations, recommendations, episodes with thumbnails + synopsis, watch button
- **Watch page**: HLS.js video player with quality selector, episode sidebar with thumbnails, prev/next navigation
- **Library page**: Full grid view with sort (trending/popular/score/newest/A-Z) + filters (genre, year, format, status)
- **Schedule page**: Currently airing anime
- **Search**: Live dropdown results in header + dedicated search results page
- **Genre browse**: Browse anime by genre (`/genre/[genre]`)
- **Surprise me**: Random anime redirect

## Tech Stack

- **Framework**: Next.js 16 (App Router, standalone output)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (read-only via better-sqlite3)
- **Video**: HLS.js for streaming
- **Fonts**: Inter

## Database

The app reads from a SQLite database at `/var/lib/luffytv/anicore.db` (production) or `./anicore.db` (local dev). Override with `ANICORE_DB` env var.

Tables: `anime`, `episodes`, `characters`, `streaming_links`, `external_links`, `recommendations`, `relations`.

Run the scraper (`/scraper/scrape_anicore.py`) to populate the database from the AniCore API.

## Development

```bash
# Install deps
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Run production
bun run start
```

## Deployment (VPS via Coolify)

This app uses `better-sqlite3` (native C++ module) — **Vercel/serverless won't work**. Deploy on your VPS:

```bash
# On your VPS
git clone https://github.com/tasinfahad6767-beep/anicore-clone.git
cd anicore-clone
bun install
bun run build
PORT=3000 bun .next/standalone/server.js
```

Or via Coolify: New Resource → App from GitHub → select repo → set port 3000 → mount DB path → deploy.

## Layout

```
src/
  app/
    layout.tsx              # Root layout with Header
    page.tsx                # Home page
    globals.css             # Global styles
    anime/[slug]/page.tsx   # Anime detail
    anime/[slug]/watch/page.tsx  # Watch page
    library/page.tsx        # Browse library
    schedule/page.tsx       # Airing schedule
    search/page.tsx         # Search results
    genre/[genre]/page.tsx  # Genre browse
    random/page.tsx         # Random redirect
    api/                    # API routes
  components/anicore/       # All AniCore components
  lib/anicore/db.ts         # DB connection + queries + types
```
