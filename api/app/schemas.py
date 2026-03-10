"""Pydantic schemas for Prisme API."""

from typing import Any, Optional

from pydantic import BaseModel, Field


class ContextSummary(BaseModel):
    brief: Optional[str] = None
    primary_focus: Optional[str] = None


class ContextPayload(BaseModel):
    """Context payload for PUT /api/v1/context. Source = agent/system name."""

    source: str = Field(..., description="Agent or system name (e.g. openclaw)")
    conversation_id: Optional[str] = None
    timestamp: Optional[str] = None
    transition_urgency: Optional[int] = None
    summary: Optional[ContextSummary] = None
    tags: list[str] = Field(default_factory=list)
