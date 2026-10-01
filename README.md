# Connext

**The Next Network for Learning & Collaboration**

> Ask without fear. Get known for what you give.

Connext is a Reddit-style academic network for students and staff across India. Communities and nested threads, verified-anonymous asking, credits for outcomes (not just likes), a gamified dashboard, a connection map, and one identity that switches between **Vibe** (Gen Z) and **Pro** (faculty / professional) modes.

Built for RepoForge 2026. Problem statement: *Nationwide Student & Staff Collaboration Portal*.

## Why it is different

1. **Verified-anonymous asking.** Institution-verified, but hidden from peers. Reveal later to claim credit.
2. **Outcome credits.** Credits come from "this unblocked me", accepted answers and teammate-confirmed milestones. Upvotes are capped and weighted.
3. **Vibe / Pro identity.** One account, two faces, same layout, different tokens.
4. **Syllabus-routed communities.** Questions reach students and staff on the same syllabus at other colleges.
5. **Doubt Radar for staff.** Anonymous aggregate of what students struggle with, per topic.

## Docs

- [docs/PRD.md](docs/PRD.md): problem, users, features, scope, success criteria
- [docs/Design.md](docs/Design.md): UI/UX direction, tokens, flows, states
- [docs/Architecture.md](docs/Architecture.md): stack, data model, services, security
- [docs/Phases.md](docs/Phases.md): build order and milestones

## Tech stack (planned)

Next.js, TypeScript, Tailwind, shadcn/ui, FastAPI or Node, PostgreSQL + pgvector, optional Redis, LLM + embeddings, Docker Compose.

## Integrations

LinkedIn and ResearchGate are **simulated** in the prototype (mock login/signup portals and a mock API). They are labelled as demo integrations in the UI. GitHub OAuth and ORCID public API are optional real integrations.

## Status

Planning complete, prototype in progress. Source material: `Connext_Idea.md`.

## Getting started

Not yet available. Setup instructions will be added in Phase 1 (see [docs/Phases.md](docs/Phases.md)).
