# ── Credits Router ────────────────────────────────────────────────────────────
# Credit ledger — XP, streak, levels
# Based on Architecture.md §6: Contribution engine rules

from fastapi import APIRouter, HTTPException, Depends
from app.data import get_store

router = APIRouter()

LEVEL_THRESHOLDS = [0, 200, 500, 900, 1400, 2000, 2700, 3500, 4500, 5700, 7000]

def xp_to_level(xp: int) -> int:
    for lvl, threshold in enumerate(reversed(LEVEL_THRESHOLDS)):
        if xp >= threshold:
            return len(LEVEL_THRESHOLDS) - 1 - lvl
    return 1

@router.get("/leaderboard", summary="Top 10 users by XP")
async def leaderboard(store=Depends(get_store)):
    ranked = sorted(store["users"], key=lambda u: u["xp"], reverse=True)[:10]
    return [
        {
            "rank": i + 1,
            "handle": u["handle"],
            "display_name": u["display_name"],
            "initials": u["initials"],
            "level": u["level"],
            "xp": u["xp"],
            "credits": u["credits"],
            "streak_days": u["streak_days"],
        }
        for i, u in enumerate(ranked)
    ]

@router.get("/events/{user_id}", summary="Credit events for a user")
async def user_events(user_id: str, store=Depends(get_store)):
    events = [e for e in store["credit_events"] if e["user_id"] == user_id]
    return events

@router.get("/stats/{user_id}", summary="XP, level and streak for a user")
async def user_stats(user_id: str, store=Depends(get_store)):
    user = next((u for u in store["users"] if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return {
        "user_id": user_id,
        "xp": user["xp"],
        "level": xp_to_level(user["xp"]),
        "streak_days": user["streak_days"],
        "credits": user["credits"],
    }
