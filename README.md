# Prisme

Dynamic dashboard that adapts to context (tags/conversation). See `docs/project-summary.md`.

## Getting started

```bash
# 1. Create config files from examples (not versioned)
cp docs/config.json.example data/config.json
cp docs/context.json.example data/context.json
# Edit data/config.json and data/context.json (URLs, tags).

# 2. Run
docker compose up -d --build
```

Access: http://localhost:3080 (or via reverse proxy, e.g. prisme.sarius.ca).

Routes: `/` redirects to `/d/static`; `/d/static`, `/d/dynamic`, `/d/focus`.

**API:** `PUT /api/v1/context` (agents push context with JSON body); `GET /api/v1/context` (frontend polls).

**Tests:** `npm run test` (unit tests with Vitest). CI runs on push/PR to `main`.
