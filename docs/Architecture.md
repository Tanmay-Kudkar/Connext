# Connext: Architecture

Hackathon-sized and modular. Production-grade pieces (Kafka, Kubernetes, Terraform) are roadmap only.

## 1. Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion (light), MapLibre or Leaflet for the map
- **Backend:** FastAPI (preferred, keeps AI in Python) or Node, REST, SSE/WebSocket for notifications and channels
- **Database:** PostgreSQL with pgvector. Redis optional for leaderboards and streaks (start with SQL).
- **AI:** LLM API for suggestions and summaries, embeddings stored in pgvector
- **Auth:** email OTP (mock acceptable), JWT sessions, optional GitHub OAuth
- **Deployment:** Docker Compose for dev and demo; GitHub Actions CI

## 2. System overview

```text
Browser (Next.js)
      |
   API (FastAPI)
      |
 +----+---------------------------------+
 |    |            |           |        |
Identity  Community  Contribution  AI    Integrations
Service   Service    Engine        Svc   (mock LinkedIn,
 |        (posts,    (credits,     (dedupe,  mock ResearchGate,
 |         threads)   quests)       match)    GitHub/ORCID)
 +----+---------------------------------+
      |
 PostgreSQL + pgvector  (Redis optional)
```

## 3. Services (modules in one codebase)

- **Identity:** users, institutions, verification, roles, Vibe/Pro profile, avatars, Passport.
- **Community:** communities, channels, posts, nested comments, votes, reports, moderation.
- **Contribution engine:** credit events, ledger, caps, decay, quests, streaks, badges, leaderboard.
- **AI:** embeddings, similar-question search, tagging, teammate matcher, thread summary, community bot.
- **Integrations:** mock LinkedIn and ResearchGate portals and API, GitHub OAuth, ORCID public API.
- **Insights:** Doubt Radar aggregation by syllabus unit.
- **Map:** opt-in coarse location (college/city), cluster and recommendation queries.

## 4. Data model (core tables)

- `users` (id, handle, display_name, mode, accent, avatar_pack, institution_id, role, verified_at)
- `institutions` (id, name, domain, city, state)
- `syllabus_units` (id, board, subject, unit)
- `communities` (id, slug, name, syllabus_unit_id nullable, visibility)
- `memberships` (user_id, community_id, role)
- `channels` (id, community_id, type: qa | projects | announce | chat)
- `posts` (id, channel_id, author_id, anon bool, title, body, status: open | resolved, syllabus_unit_id, embedding vector)
- `comments` (id, post_id, parent_id, path, author_id, anon bool, body)
- `votes` (user_id, target_type, target_id, value)
- `credit_events` (id, user_id, type, source_id, confirmer_id, weight, created_at)
- `credit_ledger` (user_id, balance, level, streak_days, last_active)
- `quests`, `user_quests`, `badges`, `user_badges`
- `projects`, `project_members`, `milestones`
- `connections` (user_id, other_id, status)
- `mock_links` (user_id, provider: linkedin | researchgate, payload jsonb)
- `reports` (id, target, reason, status)

Nested comments: `parent_id` plus materialized `path` (or ltree) for fast subtree queries.

## 5. Anonymity model

- Anonymous posts store `author_id` server-side, but API responses never return it to peers.
- Display is "Verified student" only. No college, branch, or timestamps precise enough to deanonymize.
- Moderators with a reason log can resolve identity for abuse cases.
- "Reveal" flips the anon flag and attributes past credit.
- Rate limits and report flow apply equally to anonymous content.

## 6. Contribution engine rules

- Credits awarded on: asker confirms "this unblocked me", accepted answer, teammate-confirmed milestone, mentoring session confirmed.
- Upvotes count weakly, with a per-day cap and weight by voter reputation.
- Anti-collusion: same-pair cap per week, decay over time, flag unusual patterns.
- Every award is an immutable `credit_events` row; balances derive from the ledger.
- Levels and badges are derived from credits and streaks.

## 7. AI features

- On compose: embed draft, return top similar threads (pgvector cosine).
- Auto-suggest syllabus unit and tags.
- Teammate matcher: embed skills/interests/project need, rank candidates, explain the match.
- Community bot: welcome, dedupe, thread summary, daily quest post.
- Guardrails: AI suggests and routes only. Peers and staff provide answers.

## 8. Mock integrations

- `/mock/linkedin` and `/mock/researchgate`: pages that mimic login, signup and consent, clearly labelled **Demo integration (simulated)**.
- Mock API returns seeded profile, experience, papers and citations, stored in `mock_links.payload`.
- Importer maps payload into the Academic Passport and Pro view.
- Production note: would use official partner APIs or user-uploaded data.

## 9. Security and privacy

- OAuth/OTP auth, signed sessions, role-based access
- Input validation and output sanitization for posts and markdown
- Per-IP and per-user rate limits, anti-spam
- Opt-in, coarse location only (college or city). No live GPS.
- Reports, mute, block, moderation queue, AI-assisted toxicity filter
- Secrets in environment, no tokens in client code

## 10. Performance and scale notes

- Paginate feeds and threads; load comment subtrees lazily
- Index: `posts(channel_id, created_at)`, `comments(post_id, path)`, `credit_events(user_id, created_at)`, vector index on embeddings
- Cache leaderboards in Redis if needed
- Roadmap: event bus (Kafka/RabbitMQ), search engine, analytics warehouse, Kubernetes, Terraform

## 11. Testing

- Unit: credits engine rules, anonymity serialization, comment tree building
- Integration: post, reply, confirm, credit flow; mock OAuth import
- E2E: golden demo path
- Manual QA on mobile and desktop, light and dark, Vibe and Pro

## 12. Repo layout (proposed)

```text
/apps/web        Next.js frontend
/apps/api        FastAPI backend
/packages/ui     shared components and tokens
/docs            PRD, Design, Architecture, Phases
/docker-compose.yml
```
