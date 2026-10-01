# Connext: Phases

Build order is chosen so the demo is never empty and the most visible UX lands first. If time is short, cut from the bottom.

## Phase 0: Foundations
- Finalize decisions: accent colour, name and wordmark, backend choice
- Repo setup (web, api, docs), Docker Compose, lint, CI
- Design tokens file and UI primitives (Vibe and Pro token sets)
- **Done when:** app boots locally with a themed empty shell

## Phase 1: Shell and identity
- Layout: desktop three columns, mobile bottom nav
- Auth with email OTP (mock), institution verification
- First-run flow: entry, verify, pick your face, join communities
- Vibe / Pro toggle and avatar/icon customizer
- **Done when:** a new user can onboard and land on an empty feed in either mode

## Phase 2: Communities and threads
- Communities, channels, posts, nested comments, votes
- Verified-anonymous posting and reveal
- Syllabus tags and cross-college routing
- Compose screen, empty/loading/error states
- **Done when:** multi-user threaded discussion works across seeded colleges

## Phase 3: Contribution engine and dashboard
- Credit events, ledger, caps and decay
- "This unblocked me", accepted answers, resolved state
- Dashboard: XP, level, streak, daily quests, heatmap, badges, leaderboard
- **Done when:** resolving a question awards credits and updates the dashboard live

## Phase 4: Passport and mock integrations
- `/mock/linkedin` and `/mock/researchgate` portals plus mock API
- Academic Passport and Pro profile view
- Optional: GitHub OAuth, ORCID public API
- **Done when:** connecting a mock account fills the Passport and Pro view

## Phase 5: AI and discovery
- pgvector similar-question suggestions on compose
- Teammate matcher with explanation
- Community bot (welcome, dedupe, summary, daily quest)
- Connection map (list-first, map toggle, opt-in, coarse location)
- **Done when:** compose shows relevant suggestions and the map recommends a teammate

## Phase 6: Staff and polish
- Doubt Radar for faculty
- Seed data: about 4 colleges, 15 users, 40 questions, projects, quests
- Mobile pass, accessibility pass (contrast, focus, reduced motion)
- Error, offline and empty state sweep
- **Done when:** the full golden path runs with no dead ends

## Phase 7: Demo and pitch
- Rehearse the 3-minute golden path
- Update slides: wedge, trimmed stack, honest "simulated integrations" note
- Backup recording of the demo
- **Done when:** two clean dry runs

## Cut order if time runs out
1. Map becomes a cluster list
2. Community bot becomes static welcome posts
3. Optional real GitHub/ORCID dropped
4. Projects and milestones simplified
5. Leaderboard dropped

Never cut: threads, anonymous posting, outcome credits, Vibe / Pro toggle, dashboard, mock integrations.

## Milestones
- M1: onboarding and shell (end of Phase 1)
- M2: threaded discussion live (end of Phase 2)
- M3: credits and dashboard (end of Phase 3)
- M4: full feature demo (end of Phase 6)
- M5: pitch ready (end of Phase 7)
