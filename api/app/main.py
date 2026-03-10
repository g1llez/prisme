from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import context

app = FastAPI(
    title="Prisme API",
    description="Context API for Prisme dashboard",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(context.router, prefix="/api/v1", tags=["context"])


@app.get("/")
async def root():
    return {"message": "Prisme API", "version": "0.1.0", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
