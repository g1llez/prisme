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
