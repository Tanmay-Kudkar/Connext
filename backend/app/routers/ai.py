# ── AI Router ─────────────────────────────────────────────────────────────────
# Prototype: keyword-based similarity (no real LLM/vector DB required)
# Production: replace with pgvector cosine similarity on embeddings
# Docs: Architecture.md §7 — AI features

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.data import get_store

router = APIRouter()

def _simple_similarity(query: str, text: str) -> float:
    """Keyword overlap score — prototype stand-in for cosine similarity."""
    q_words = set(query.lower().split())
    t_words = set(text.lower().split())
    if not q_words:
        return 0.0
    return len(q_words & t_words) / len(q_words)

class SimilarQuery(BaseModel):
    title: str
    limit: int = 3

class MatchQuery(BaseModel):
    skills: list[str]
    interests: list[str]
    limit: int = 3

@router.post("/similar-questions", summary="Find similar questions (AI dedup)")
async def similar_questions(body: SimilarQuery, store=Depends(get_store)):
    """
    Returns posts most similar to the draft title.
    Prototype: keyword overlap. Production: pgvector cosine with embeddings.
    """
    scored = []
    for post in store["posts"]:
        score = _simple_similarity(body.title, post["title"] + " " + post["body"])
        if score > 0.1:
            scored.append({**post, "_score": round(score, 3)})
    results = sorted(scored, key=lambda x: x["_score"], reverse=True)[: body.limit]
    return {"query": body.title, "results": results}

@router.post("/match-teammates", summary="Find teammate recommendations")
async def match_teammates(body: MatchQuery, store=Depends(get_store)):
    """
    Recommend users whose skills/interests overlap with the requester.
    Prototype: set overlap. Production: cosine similarity on skill embeddings.
    """
    query_skills = set(s.lower() for s in body.skills)
    query_interests = set(i.lower() for i in body.interests)
    scored = []
    for user in store["users"]:
        u_skills = set(s.lower() for s in user.get("skills", []))
        u_interests = set(i.lower() for i in user.get("interests", []))
        score = len(query_skills & u_skills) + len(query_interests & u_interests) * 0.5
        if score > 0:
            institution = next(
                (i for i in store["institutions"] if i["id"] == user["institution_id"]), {}
            )
            scored.append({
                "user_id": user["id"],
                "handle": user["handle"],
                "display_name": user["display_name"],
                "initials": user["initials"],
                "role": user["role"],
                "institution": institution.get("short", ""),
                "matching_skills": list(query_skills & u_skills),
                "matching_interests": list(query_interests & u_interests),
                "_score": round(score, 2),
            })
    results = sorted(scored, key=lambda x: x["_score"], reverse=True)[: body.limit]
    return {"results": results}

@router.get("/doubt-radar", summary="Doubt Radar — aggregated topic struggles (Staff view)")
async def doubt_radar(store=Depends(get_store)):
    """
    Anonymous aggregate of what topics appear in open posts.
    Staff-only in production (RBAC). Here returned openly for demo.
    """
    tag_counts: dict[str, int] = {}
    for post in store["posts"]:
        if post["status"] == "open":
            for tag in post.get("tags", []):
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
    sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
    return {
        "radar": [{"topic": tag, "open_questions": count} for tag, count in sorted_tags],
        "note": "Anonymous aggregate of open questions by tag. Faculty view only in production.",
    }
