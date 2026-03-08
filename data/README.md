# Data mounted in the container

This folder is mounted into the Prisme container. Files here are served without rebuild.

**First time / fresh clone:** these files are not versioned (they contain your links and config). Create them from the examples:

```bash
cp docs/config.json.example data/config.json
cp docs/context.json.example data/context.json
# Then edit data/config.json and data/context.json with your URLs / tags.
```

- **config.json**: Widget configuration (only place it’s read from). Edit then reload the page.
- **context.json**: Context for the dynamic dashboard (`/d/dynamic`). Must contain at least `tags`. Displayed widgets are those with at least one tag in common with `context.tags`.
