# ── Posts Router ──────────────────────────────────────────────────────────────
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.data import get_store

router = APIRouter()

class PostCreate(BaseModel):
    community_slug: str
    author_id: str
    anon: bool = True
    title: str
    body: str
    tags: list[str] = []

class PostResolve(BaseModel):
    confirmer_id: str   # the user who was unblocked

@router.get("/", summary="List all posts (optionally filter by community)")
async def list_posts(community: Optional[str] = None, store=Depends(get_store)):
    posts = store["posts"]
    if community:
        posts = [p for p in posts if p["community_slug"] == community]
    return sorted(posts, key=lambda p: p["created_at"], reverse=True)

@router.get("/{post_id}", summary="Get a single post")
async def get_post(post_id: str, store=Depends(get_store)):
    post = next((p for p in store["posts"] if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    return post

@router.post("/", summary="Create a new post", status_code=201)
async def create_post(body: PostCreate, store=Depends(get_store)):
    from datetime import datetime, timezone
    new_post = {
        "id": f"p{len(store['posts']) + 1}",
        "community_slug": body.community_slug,
        "author_id": body.author_id,
        "anon": body.anon,
        "title": body.title,
        "body": body.body,
        "status": "open",
        "upvotes": 0,
        "comment_count": 0,
        "credits": 0,
        "tags": body.tags,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    store["posts"].append(new_post)
    return new_post

@router.post("/{post_id}/resolve", summary="Mark post as resolved (This unblocked me)")
async def resolve_post(post_id: str, body: PostResolve, store=Depends(get_store)):
    """
    Core contribution engine trigger:
    - Marks post as resolved
    - Awards credits to the author of the best answer
    Based on Architecture.md §6: Contribution engine rules
    """
    post = next((p for p in store["posts"] if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    if post["status"] == "resolved":
        raise HTTPException(status_code=400, detail="Post already resolved.")

    post["status"] = "resolved"
    post["credits"] = 35   # Fixed award for demo

    # Log credit event
    from datetime import datetime, timezone
    event = {
        "id": f"e{len(store['credit_events']) + 1}",
        "user_id": post["author_id"],
        "type": "this_unblocked_me",
        "source_id": post_id,
        "confirmer_id": body.confirmer_id,
        "weight": 35,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    store["credit_events"].append(event)

    return {"message": "Post resolved. Credits awarded.", "post": post, "event": event}

@router.post("/{post_id}/upvote", summary="Upvote a post")
async def upvote_post(post_id: str, store=Depends(get_store)):
    post = next((p for p in store["posts"] if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found.")
    post["upvotes"] += 1
    return {"upvotes": post["upvotes"]}
