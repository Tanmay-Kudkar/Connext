# ====================================================================
# Connext Backend — FastAPI entry point
# Architecture: docs/Architecture.md
# Services: Identity, Community, Contribution Engine, AI, Integrations
# ====================================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, users, communities, posts, credits, ai

app = FastAPI(
    title="Connext API",
    description="Backend for Connext — Academic Collaboration Platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api/auth",        tags=["Auth"])
app.include_router(users.router,       prefix="/api/users",       tags=["Users"])
app.include_router(communities.router, prefix="/api/communities",  tags=["Communities"])
app.include_router(posts.router,       prefix="/api/posts",       tags=["Posts"])
app.include_router(credits.router,     prefix="/api/credits",     tags=["Credits"])
app.include_router(ai.router,          prefix="/api/ai",          tags=["AI"])

# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health() -> dict:
    """Liveness probe — returns 200 if the API is up."""
    return {"status": "ok", "service": "connext-api"}
