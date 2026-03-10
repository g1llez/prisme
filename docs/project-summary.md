# Prisme — Project Summary

## Concept

Prisme is a dynamic dashboard that adapts in real time based on the context of a conversation with OpenClaw (an LLM). The analogy: a conversation (white light) passes through a prism and is refracted into multiple coloured widgets (visual spectrum of data).

## Architecture

Two main components:

- **OpenClaw**: Analyses the conversation and produces a `context.json` file with tags and context.
- **Prisme** (this project): Dashboard that reads the context, computes relevance scores, and displays the appropriate widgets.

**Data flow:**  
OpenClaw conversation → `context.json` → Prisme reads → Score widgets → Display grid

## Data structure

**Input: `context.json`** (produced by OpenClaw)

- Brief summary of the conversation
- Extracted tags (e.g. "bitcoin", "firmware", "s21")
- Primary focus
- Transition urgency (1–5): controls how quickly the dashboard changes

**Config: `config.json`** (e.g. `docs/config.json.example`) — Prisme configuration

- List of available widgets with their tags
- Scoring rules (weights, bonuses, multipliers)
- Display config (thresholds, limits, `focus_score_threshold`)

## Scoring system

Score is calculated from context (e.g. tag matching, primary focus, urgency), not from widget type.
Score is computed elsewhere; only widgets above the display threshold are shown.

## Display — Three dashboards

1. **Permanent**: Widgets always visible (e.g. calendar, global monitoring).
2. **Dynamic**: Widgets that appear or disappear based on context (score ≥ threshold).
3. **Focus**: Widget(s) with score ≥ 85 highlighted (larger, centred) — dedicated third screen.  
Which widgets appear on which screen is determined elsewhere (not in config).

**Transitions** (when the dynamic dashboard is in place):

- Urgency 1–2: Gradual, smooth changes
- Urgency 4–5: Fast, immediate changes (e.g. critical incident)

## Widget types

For the POC: iframes only, displaying external web pages.

- TradingView (charts)
- Grafana (monitoring)
- Google Docs (documentation)
- Mempool.space (blockchain data)
- Google Calendar
- News sites

## POC — Phase 1 (minimal)

1. **Static dashboard**: Show a set of widgets in iframes in a grid (config file = `config.json` / e.g. `config.json.example`).
2. When that works → **dynamic display**: read context, scoring, show/hide according to the three dashboards (Permanent, Dynamic, Focus). `context.json` provided manually at first, then fetched from another server.
3. **Backend**: To be added when implementing the dynamic dashboard (fetching context, polling, etc.).

No smooth transitions in Phase 1 (show/hide only).

## Suggested tech stack

- Frontend: HTML/CSS/JS vanilla or simple React
- Grid layout: CSS Grid or a light library
- Polling (dynamic phase): Read `context.json` every 3–5 seconds (or via backend)
- Docker: Standalone container for Prisme

## Example use case

**Conversation:** “I’m working on my Bitcoin project, I need to install firmware on my S21.”

OpenClaw produces a `context.json` (see `docs/context.json.example`):

- `summary.brief`, `summary.primary_focus`, `tags[]`, `transition_urgency`

Prisme displays:

- **Focus**: S21 Firmware doc (score ≥ 85)
- **Dynamic**: Bitcoin Price Chart, Grafana BTC Monitoring, Mempool (score ≥ 60)
- **Permanent**: e.g. Calendar, monitoring (selection done elsewhere)

## POC goals

Validate that the “tags → scoring → dynamic display” concept works before adding:

- Smooth transitions
- Custom widgets (non-iframe)
- User preference learning
- Backend to fetch context from another server
