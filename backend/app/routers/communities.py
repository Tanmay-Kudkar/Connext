# ── Communities Router ────────────────────────────────────────────────────────
from fastapi import APIRouter, HTTPException, Depends
from app.data import get_store

router = APIRouter()

@router.get("/", summary="List all communities")
async def list_communities(store=Depends(get_store)):
    return store["communities"]

@router.get("/{slug}", summary="Get community by slug")
async def get_community(slug: str, store=Depends(get_store)):
    community = next((c for c in store["communities"] if c["slug"] == slug), None)
    if not community:
        raise HTTPException(status_code=404, detail="Community not found.")
    posts = [p for p in store["posts"] if p["community_slug"] == slug]
    return {**community, "posts": posts}
