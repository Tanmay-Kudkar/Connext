# Connext 🚀

> **Ask without fear. Get known for what you give.**

**Connext** is a nationwide, unified academic collaboration and learning network for students, faculty, researchers, and mentors across India. Built to bridge campus silos, Connext combines verified-anonymous Q&A, AI-powered teammate & mentor matching, outcome-based gamified credits, and a dual-identity system (**Vibe** vs **Pro**) backed by a **Proof-of-Contribution Graph**.

Developed by **Team DarkShield** for **RepoForge 2026** (*XIE – CSI Student Chapter*).
**Problem Statement No.:** 004 – *Nationwide Student & Staff Collaboration Portal*.

---

## 👥 Team DarkShield

* **Team Leader:** Ritesh Gharat
* **Team Members:**
  * Tanmay Vijay Kudkar
  * Atharva Mangesh Raut
  * Ved Kumare
* **Institution & Event:** Xavier Institute of Engineering (XIE) – CSI Student Chapter (RepoForge 2026)

---

## ❓ The Problem

Academic collaboration in higher education is fragmented across classrooms, WhatsApp/Telegram groups, Discord, LinkedIn, GitHub, and scattered research platforms:
- **Hesitation to Ask:** Students often fear judgment when asking basic or complex doubts in class or open forums.
- **Siloed Teams:** Finding the right project teammates or cross-campus mentors with complementary skills is difficult.
- **Disjointed Identities:** There is no single verified academic profile that showcases a student's real contributions, publications, code repositories, and peer-help outcomes.

---

## 💡 The Solution & 3 Pillars

Connext provides a single contribution and collaboration layer for academic life:

```
                          ┌────────────────────────┐
                          │   ACADEMIC PASSPORT    │
                          │ Verified Identity &    │
                          │ Proof of Contribution  │
                          └───────────┬────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
┌─────────────────────────────┐               ┌─────────────────────────────┐
│     SMART COLLABORATION     │               │  CONTRIBUTION & COMMUNITY   │
│ AI-Powered Team & Mentor    │               │  Matching + Skill Graph     │
│ Outcome Credits & Guilds    │               │  Verified-Anonymous Q&A     │
└─────────────────────────────┘               └─────────────────────────────┘
```

### 1. 🎓 Academic Passport
Combines verified education, skills, projects, achievements, GitHub repositories, ORCID research data, and simulated LinkedIn/ResearchGate profiles into **one unified academic identity**.

### 2. 🤖 Smart Collaboration & Proof-of-Contribution Graph
- **AI Matchmaker:** Recommends relevant questions, project collaborators, mentors, and academic communities based on skill vectors, interests, and syllabus requirements.
- **Proof-of-Contribution Graph:** Connects `Skills → Projects → Contributions → Repositories → Research → Achievements`, building a profile based on verifiable evidence rather than surface popularity.

### 3. 🏆 Contribution & Community
- **Verified-Anonymous Asking:** Students can post questions anonymously (verified by college email). Peer helpers never see personal handles; askers can reveal their identity later to claim credit.
- **Outcome-Based Credits:** Credits are awarded when the asker confirms *"This unblocked me"*, when code milestones are accepted, or when mentoring is verified. Upvotes are weighted with anti-collusion caps.
- **Gamified Dashboard:** Features XP, level progression, daily quests, streak flames, achievement badges, and heatmaps to transform learning into measurable contribution.

---

## 🎨 Dual Identity: Vibe vs Pro Mode

Connext features a seamless, 200ms crossfade identity toggle allowing users to adapt their experience:

| Feature | ⚡ Vibe Mode (Gen Z / Student) | 💼 Pro Mode (Faculty / Professional / CV) |
| :--- | :--- | :--- |
| **Target Audience** | Undergraduates, peer collaborators, study guilds | Faculty, researchers, mentors, recruiters |
| **Aesthetics** | Dynamic themes, custom avatars, larger radius, expressive copy | Clean CV-style layout, neutral palette, structured cards |
| **Surfaced Highlights**| Streaks, XP, guild badges, active project posts | Publications, ORCID, research papers, department credentials |

---

## 🛠️ Technical Stack & Architecture

### High-Level Architecture
```text
                          Browser (Next.js 14 / React / TypeScript)
                                         │
                                   REST / WS / SSE
                                         │
                               FastAPI / Node.js Backend
                                         │
     ┌───────────────────┬───────────────┴───────────────┬──────────────────┐
     ▼                   ▼                               ▼                  ▼
Identity Service    Community Service            Contribution Engine    AI Engine
(Auth & Passport)   (Channels & Threads)         (Credits & Quests)     (pgvector & Matching)
     │                   │                               │                  │
     └───────────────────┴───────────────┬───────────────┴──────────────────┘
                                         │
                     PostgreSQL + pgvector (Optional Redis Cache)
```

### Stack Components
- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Leaflet / MapLibre (Connection Map).
- **Backend:** FastAPI (Python) / Node.js with REST APIs and WebSockets/SSE for real-time notifications.
- **Database:** PostgreSQL with `pgvector` for semantic search and embeddings. Redis for caching & leaderboards.
- **AI & ML:** LLM embedding models, cosine similarity matching for duplicate detection and candidate recommendation.
- **Integrations:** GitHub OAuth, ORCID API, and simulated demo integration portals for LinkedIn & ResearchGate.
- **Security & Deployment:** Docker, Cloudflare, GitHub Actions, OAuth2, JWT sessions, role-based access control (RBAC).

---

## 🔄 End-to-End Workflow & Prototype Flow

```text
1. Sign Up & Onboard ──► 2. Build Academic Passport ──► 3. AI Discovery & Matching
   (Email OTP & College)     (Link GitHub / ORCID / Mock)  (Syllabus & Skill Vectors)
                                                                     │
                                                                     ▼
6. Career & Research ◄── 5. Contribution Engine ◄─────── 4. Collaboration & Q&A
   Opportunities            (XP, Streaks, Credits,          (Nested Threads & Anonymous
                            Unblocked Milestones)            Doubt Radar for Staff)
```

### 🛰️ Special Feature: Staff "Doubt Radar"
Allows faculty and mentors to view an anonymous, aggregated heat-map of concepts students struggle with, broken down by syllabus unit, enabling targeted academic support without invading student privacy.

---

## 📁 Repository Structure

```text
Connext/
├── frontend/              # Next.js frontend application
├── backend/               # FastAPI / Node.js backend services
├── docs/                  # Detailed design and product specifications
│   ├── Connext.pdf        # RepoForge 2026 Presentation Deck
│   ├── PRD.md             # Product Requirements Document
│   ├── Architecture.md    # System Architecture & Schema Specification
│   ├── Design.md          # UI/UX & Design Token System
│   ├── Phases.md          # Development Roadmap & Sprint Milestones
│   └── Connext_Idea.md    # Original Concept & Vision Specifications
└── docker-compose.yml     # Local multi-container development environment
```

---

## 🗺️ Roadmap & Build Phases

- [x] **Phase 0: Foundations** – System architecture, design tokens, repository scaffolding.
- [x] **Phase 1: Shell & Identity** – Multi-column layout, mock OTP auth, Vibe/Pro identity switch.
- [ ] **Phase 2: Communities & Threads** – Nested comments, verified-anonymous Q&A, syllabus routing.
- [ ] **Phase 3: Contribution Engine** – Outcome credit ledger, daily quests, streak tracker, dashboard.
- [ ] **Phase 4: Academic Passport** – Mock LinkedIn/ResearchGate portals, GitHub/ORCID import.
- [ ] **Phase 5: AI & Discovery** – `pgvector` deduplication, AI teammate matcher, Doubt Radar.
- [ ] **Phase 6: Verification & Polish** – Golden demo path seeding, accessibility sweep, mobile pass.

---

## 📚 Research & References

1. **APAAR (One Nation, One Student ID):** [apaar.education.gov.in](https://apaar.education.gov.in/about)
2. **Stack Overflow Reputation System:** [stackoverflow.com/help/whats-reputation](https://stackoverflow.com/help/whats-reputation)
3. **PLOS ONE Student Question-Participation Study:** [doi:10.1371/journal.pone.0243731](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0243731)
4. **Student Team Formation Research:** [doi:10.1016/j.learninstruc.2024.101931](https://doi.org/10.1016/j.learninstruc.2024.101931)
5. **Gamification & Student Engagement Review:** [doi:10.3389/feduc.2024.1466926](https://doi.org/10.3389/feduc.2024.1466926)
6. **ORCID Persistent Researcher Identifier:** [orcid.org](https://orcid.org/)

---

## 📄 License & Attribution

Built for **RepoForge 2026** by **Team DarkShield** (XIE – CSI Student Chapter). All rights reserved.
