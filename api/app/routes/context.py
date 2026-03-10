"""Context API: PUT to update, GET to read. Stored in data/context.json."""

import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from ..schemas import ContextPayload

router = APIRouter()

CONTEXT_FILE = Path("/data/context.json")


def _read_context() -> dict | None:
    if not CONTEXT_FILE.exists():
        return None
    try:
        return json.loads(CONTEXT_FILE.read_text())
    except (json.JSONDecodeError, OSError):
        return None


@router.put("/context")
async def put_context(payload: ContextPayload):
    """Update context. Called by agents (e.g. OpenClaw) with JSON body."""
    data = payload.model_dump(exclude_none=True)
    try:
        CONTEXT_FILE.parent.mkdir(parents=True, exist_ok=True)
        CONTEXT_FILE.write_text(json.dumps(data, indent=2))
    except OSError as e:
        raise HTTPException(status_code=500, detail=f"Failed to write context: {e}")
    return {"ok": True, "source": payload.source}


@router.get("/context")
async def get_context():
    """Return current context. Used by Prisme frontend for dynamic dashboard."""
    data = _read_context()
    if data is None:
        raise HTTPException(status_code=404, detail="No context yet")
    if not isinstance(data.get("tags"), list):
        raise HTTPException(status_code=404, detail="Invalid context: tags required")
    return data
