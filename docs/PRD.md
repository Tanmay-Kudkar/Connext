# Connext: Product Requirements Document

## 1. Problem

There is no platform connecting students and staff across India to share problems, contribute to projects, seek academic help and stay current with curriculum changes. Many students hesitate to ask questions in class for fear of judgment. Academic collaboration is scattered across WhatsApp/Telegram groups, Discord, LinkedIn, GitHub and research sites, and there is no single profile that shows real contribution.

**PS (verbatim intent):** Build a portal where students and staff nationwide can post projects, ask questions freely, contribute ideas and collaborate on academic or personal work, with a gamified credit/upvote system (similar to Quora) that rewards contributions.

## 2. Vision and positioning

> Reddit's openness, LinkedIn's credibility, Duolingo's progress, one student identity.

Tagline: **Ask without fear. Get known for what you give.**

Connext is a contribution and collaboration layer for academic life, not just another social network.

## 3. Users

- **Student** (primary): asks, answers, joins communities, builds projects.
- **Faculty / staff:** answers, mentors, posts curriculum updates, views Doubt Radar.
- **Researcher / mentor:** shares research, mentors, finds collaborators.
- **Institution admin** (light): verifies domains, views aggregate activity.

## 4. Core user stories

- As a student, I can ask a question anonymously (still verified) so I am not judged.
- As a student, I can reveal my identity later to claim credit for a useful contribution.
- As a student, I can join communities and channels, and reply in nested threads.
- As a helper, I earn credits when the asker confirms the answer unblocked them.
- As a user, I can switch between Vibe and Pro mode and customize avatar and theme.
- As a user, I can connect GitHub, LinkedIn (mock) and ResearchGate (mock) to build an Academic Passport.
- As a student, I can find teammates and mentors via recommendations and a connection map.
- As faculty, I can see anonymous aggregate topics students struggle with.
- As a user, I can see streaks, quests, badges and a contribution heatmap.

## 5. Feature scope

### Must have (prototype)
- Auth with college email verification (mock OTP acceptable)
- Communities, channels, posts, nested comments, votes
- Verified-anonymous posting and reveal
- Outcome-based credits engine with anti-gaming caps
- Gamified dashboard: XP, level, streak, daily quests, heatmap, badges, leaderboard
- Vibe / Pro mode and avatar/icon customizer
- Mock LinkedIn and ResearchGate login/signup portals plus mock API feeding the Academic Passport
- Syllabus tags and cross-college routing
- AI: similar-question suggestions (pgvector), teammate matching
- Doubt Radar page for staff

### Should have
- Connection map (opt-in, college/city level)
- Community bot (welcome, dedupe, thread summary, daily quest)
- Project posting with milestones

### Not in scope
- Live GPS location sharing, video, Stories, native mobile apps, real LinkedIn/ResearchGate APIs, payments, media-heavy DMs

## 6. Differentiators

1. Verified-anonymous asking.
2. Outcome credits, not applause.
3. Vibe / Pro identity modes.
4. Syllabus-anchored cross-campus routing.
5. Doubt Radar for staff.

## 7. Non-functional requirements

- Responsive web: desktop (3-column) and mobile (bottom nav)
- Accessible: WCAG AA contrast, 44px touch targets, keyboard navigation, reduced-motion support
- Privacy: no live location, anonymous posts never expose college or branch, opt-in map
- Safety: report, mute, block, moderation queue, AI-assisted moderation
- Performance: feed first paint under 2s on mid-range mobile on seeded data

## 8. Risks and mitigations

- **Cold start:** syllabus routing across colleges plus seeded content for the demo.
- **Fake contributions:** institution verification, confirmer-weighted credits, collusion caps.
- **Karma farming:** upvote caps, decay, same-pair limits.
- **Anonymity abuse:** verified identity stored server-side, moderators can act, rate limits.
- **AI errors:** AI only suggests and routes, never replaces peers or auto-answers as truth.
- **Integration honesty:** LinkedIn/ResearchGate are labelled simulated everywhere.
- **Scope sprawl:** strict build order (see Phases.md).

## 9. Success criteria (hackathon)

- A 3-minute live demo of the golden path with no dead screens.
- Judges can name the differentiator after the demo.
- Working frontend and backend with seeded multi-college data.

## 10. Golden demo path

1. Onboard: verify, pick Vibe or Pro, choose avatar, join communities.
2. Connect mock LinkedIn, Passport fills.
3. Open a community, scroll a nested thread.
4. Post an anonymous question, bot suggests similar threads, peer from another college answers.
5. Asker marks "this unblocked me", credits and streak update, quest completes.
6. Switch to Pro mode, see CV-style profile with mock ResearchGate papers.
7. Open the map and see a recommended teammate.
8. Staff view: Doubt Radar.

## 11. Open questions

- Team size and split (frontend, backend, design)
- Final demo date and judging weights
- Whether the map must be a real map or a cluster list
- Syllabus set to seed (AICTE core, a state university, GATE)
