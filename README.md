# Mocro — News Platform

Mocro is a modern news platform delivering breaking news and in-depth coverage across politics, economy, sports, culture & arts, technology, health, local and world affairs.

## Stack
- **Frontend**: Cloudflare Pages (static HTML/CSS/JS)
- **Backend / Data**: Supabase (Postgres)
- **Deployment**: `wrangler pages deploy .`

## Structure
```
├── index.html          # Home page
├── robots.txt
├── sitemap.xml
├── news-sitemap.xml
├── favicon.svg
├── assets/
│   ├── css/            # base, components, fonts, layout, pages, tokens
│   └── js/             # config, api, main, search, shared, home
```

## Backup
Articles live in Supabase. To export them, run:
```
node scripts/backup-articles.mjs
```

This repository is a mirror/backup of the live site at https://mocro.co.
