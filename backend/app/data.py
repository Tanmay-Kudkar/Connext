# ────────────────────────────────────────────────────────
# Connext Backend — Seeded in-memory data store
# Used during hackathon prototype (no DB required to demo)
# Maps to data model in docs/Architecture.md section 4
# ────────────────────────────────────────────────────────

from datetime import datetime, timezone
from typing import Optional

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

# ── Institutions ──────────────────────────────────────────
INSTITUTIONS = [
    {"id": "i1", "name": "Xavier Institute of Engineering", "short": "XIE",  "city": "Mumbai", "state": "Maharashtra", "domain": "xie.edu.in"},
    {"id": "i2", "name": "VJTI Mumbai",                     "short": "VJTI", "city": "Mumbai", "state": "Maharashtra", "domain": "vjti.ac.in"},
    {"id": "i3", "name": "COEP Pune",                       "short": "COEP", "city": "Pune",   "state": "Maharashtra", "domain": "coep.ac.in"},
    {"id": "i4", "name": "NIT Trichy",                      "short": "NIT",  "city": "Trichy", "state": "Tamil Nadu",  "domain": "nitt.edu"},
]

# ── Users ─────────────────────────────────────────────────
USERS = [
    {
        "id": "u1", "handle": "tanmay.kudkar", "display_name": "Tanmay Kudkar",
        "initials": "TK", "role": "student", "institution_id": "i1",
        "level": 7, "xp": 1420, "streak_days": 12, "credits": 380,
        "skills": ["React", "Next.js", "TypeScript", "Node.js"],
        "interests": ["Web Dev", "Open Source", "AI"],
        "bio": "Full-stack dev. Building Connext.",
    },
    {
        "id": "u2", "handle": "ritesh.gharat", "display_name": "Ritesh Gharat",
        "initials": "RG", "role": "student", "institution_id": "i1",
        "level": 9, "xp": 2100, "streak_days": 21, "credits": 820,
        "skills": ["Go", "Python", "System Design", "Docker"],
        "interests": ["Backend", "DevOps", "Distributed Systems"],
        "bio": "Team lead @ DarkShield. Systems engineer.",
    },
    {
        "id": "u5", "handle": "priya.sharma", "display_name": "Dr. Priya Sharma",
        "initials": "PS", "role": "faculty", "institution_id": "i2",
        "level": 15, "xp": 8400, "streak_days": 45, "credits": 3200,
        "skills": ["NLP", "Research", "Python", "Academic Mentoring"],
        "interests": ["Education Technology", "NLP", "AI Ethics"],
        "bio": "Prof. CS, VJTI. Research: NLP & Education Tech.",
    },
]

# ── Communities ───────────────────────────────────────────
COMMUNITIES = [
    {"id": "c1", "slug": "dbms",         "name": "r/DBMS",        "description": "Database management systems — SQL, NoSQL, indexing.", "syllabus_tag": "DBMS",                   "member_count": 1240, "post_count": 387, "category": "Academics"},
    {"id": "c2", "slug": "aiml",         "name": "r/AI-ML",       "description": "Artificial intelligence and machine learning.",       "syllabus_tag": "Artificial Intelligence", "member_count": 2870, "post_count": 914, "category": "Academics"},
    {"id": "c3", "slug": "open-source",  "name": "r/OpenSource",  "description": "Open-source contributions, GSoC, Hacktoberfest.",   "syllabus_tag": None,                     "member_count": 1590, "post_count": 603, "category": "Projects"},
    {"id": "c4", "slug": "cp-guild",     "name": "r/CP-Guild",    "description": "Competitive programming — Codeforces, LeetCode.",   "syllabus_tag": None,                     "member_count": 3200, "post_count": 1102,"category": "Academics"},
    {"id": "c5", "slug": "web-dev",      "name": "r/WebDev",      "description": "Frontend, backend, full-stack.",                     "syllabus_tag": None,                     "member_count": 1880, "post_count": 742, "category": "Projects"},
    {"id": "c6", "slug": "research",     "name": "r/Research",    "description": "Research papers, methodology, collaboration.",       "syllabus_tag": None,                     "member_count": 920,  "post_count": 281, "category": "Research"},
]

# ── Posts ─────────────────────────────────────────────────
POSTS = [
    {
        "id": "p1", "community_slug": "dbms", "author_id": "u1", "anon": True,
        "title": "Why does a full table scan happen even when I have an index on the column?",
        "body": "I created a B-tree index on `email` in PostgreSQL but EXPLAIN still shows Seq Scan. The table has 50k rows. Is the query planner broken?",
        "status": "resolved", "upvotes": 47, "comment_count": 12, "credits": 35,
        "tags": ["PostgreSQL", "indexing", "query-planner"],
        "created_at": "2026-10-02T04:30:00Z",
    },
    {
        "id": "p2", "community_slug": "aiml", "author_id": "u2", "anon": False,
        "title": "Implementing cosine similarity search with pgvector — step-by-step help?",
        "body": "Trying to build a similar-question feature using FastAPI + PostgreSQL + pgvector. Where do I start?",
        "status": "open", "upvotes": 31, "comment_count": 8, "credits": 0,
        "tags": ["pgvector", "embeddings", "PostgreSQL", "FastAPI"],
        "created_at": "2026-10-02T07:15:00Z",
    },
    {
        "id": "p5", "community_slug": "aiml", "author_id": "u5", "anon": False,
        "title": "📢 AICTE ML project positions open @ VJTI — Apply before Oct 15",
        "body": "Looking for 2 students (any college) with Python + ML background for a 6-month AICTE-funded NLP project.",
        "status": "open", "upvotes": 84, "comment_count": 23, "credits": 0,
        "tags": ["opportunity", "research", "NLP", "AICTE"],
        "created_at": "2026-10-01T10:00:00Z",
    },
]

# ── Credit events ─────────────────────────────────────────
CREDIT_EVENTS = [
    {"id": "e1", "user_id": "u1", "type": "accepted_answer", "source_id": "p1", "weight": 35, "created_at": "2026-10-02T06:00:00Z"},
]

# ── In-memory store ───────────────────────────────────────
store = {
    "institutions": INSTITUTIONS,
    "users": USERS,
    "communities": COMMUNITIES,
    "posts": POSTS,
    "credit_events": CREDIT_EVENTS,
}

def get_store():
    """Dependency injection helper — returns the in-memory store."""
    return store
