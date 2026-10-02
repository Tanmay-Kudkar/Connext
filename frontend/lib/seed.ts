// Seeded data for the prototype demo
// Based on Architecture.md data model + Phases.md seeding requirements

export type College = {
  id: string;
  name: string;
  short: string;
  city: string;
  state: string;
  domain: string;
};

export type User = {
  id: string;
  handle: string;
  displayName: string;
  initials: string;
  role: "student" | "faculty" | "researcher" | "mentor";
  college: College;
  level: number;
  xp: number;
  streakDays: number;
  bio: string;
  skills: string[];
  interests: string[];
};

export type Community = {
  id: string;
  slug: string;
  name: string;
  description: string;
  syllabusTag?: string;
  memberCount: number;
  postCount: number;
  category: string;
};

export type Post = {
  id: string;
  communitySlug: string;
  authorId: string;
  anon: boolean;
  title: string;
  body: string;
  status: "open" | "resolved";
  upvotes: number;
  commentCount: number;
  credits: number;
  tags: string[];
  createdAt: string;
};

// ── Colleges ─────────────────────────────────────────────────────────────────
export const colleges: College[] = [
  { id: "c1", name: "Xavier Institute of Engineering", short: "XIE", city: "Mumbai", state: "Maharashtra", domain: "xie.edu.in" },
  { id: "c2", name: "VJTI Mumbai",                    short: "VJTI", city: "Mumbai", state: "Maharashtra", domain: "vjti.ac.in" },
  { id: "c3", name: "COEP Pune",                      short: "COEP", city: "Pune",   state: "Maharashtra", domain: "coep.ac.in" },
  { id: "c4", name: "NIT Trichy",                     short: "NIT",  city: "Trichy", state: "Tamil Nadu",  domain: "nitt.edu" },
];

// ── Users ────────────────────────────────────────────────────────────────────
export const users: User[] = [
  {
    id: "u1", handle: "tanmay.kudkar", displayName: "Tanmay Kudkar", initials: "TK",
    role: "student", college: colleges[0], level: 7, xp: 1420, streakDays: 12,
    bio: "Full-stack dev. Building Connext.",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    interests: ["Web Dev", "Open Source", "AI"],
  },
  {
    id: "u2", handle: "ritesh.gharat", displayName: "Ritesh Gharat", initials: "RG",
    role: "student", college: colleges[0], level: 9, xp: 2100, streakDays: 21,
    bio: "Team lead @ DarkShield. Systems engineer.",
    skills: ["Go", "Python", "System Design", "Docker"],
    interests: ["Backend", "DevOps", "Distributed Systems"],
  },
  {
    id: "u3", handle: "atharva.raut", displayName: "Atharva Raut", initials: "AR",
    role: "student", college: colleges[0], level: 6, xp: 980, streakDays: 8,
    bio: "UI/UX nerd. Loves design systems.",
    skills: ["Figma", "React", "Tailwind", "Framer Motion"],
    interests: ["Product Design", "Frontend"],
  },
  {
    id: "u4", handle: "ved.kumare", displayName: "Ved Kumare", initials: "VK",
    role: "student", college: colleges[0], level: 5, xp: 760, streakDays: 5,
    bio: "ML enthusiast.",
    skills: ["Python", "PyTorch", "FastAPI", "Postgres"],
    interests: ["Machine Learning", "NLP", "Research"],
  },
  {
    id: "u5", handle: "priya.sharma", displayName: "Dr. Priya Sharma", initials: "PS",
    role: "faculty", college: colleges[1], level: 15, xp: 8400, streakDays: 45,
    bio: "Prof. CS, VJTI. Research: NLP & Education Tech.",
    skills: ["NLP", "Research", "Python", "Academic Mentoring"],
    interests: ["Education Technology", "NLP", "AI Ethics"],
  },
  {
    id: "u6", handle: "arjun.nair", displayName: "Arjun Nair", initials: "AN",
    role: "student", college: colleges[2], level: 4, xp: 590, streakDays: 3,
    bio: "Competitive programmer, CP addict.",
    skills: ["C++", "Algorithms", "Data Structures"],
    interests: ["Competitive Programming", "Problem Solving"],
  },
  {
    id: "u7", handle: "meera.iyer", displayName: "Meera Iyer", initials: "MI",
    role: "researcher", college: colleges[3], level: 11, xp: 3800, streakDays: 18,
    bio: "PhD Candidate, Compiler Design @ NIT Trichy.",
    skills: ["LLVM", "Compilers", "C", "Rust"],
    interests: ["Compilers", "PL Theory", "Systems"],
  },
];

// ── Communities ───────────────────────────────────────────────────────────────
export const communities: Community[] = [
  {
    id: "com1", slug: "dbms", name: "r/DBMS",
    description: "Database management systems — SQL, NoSQL, indexing, transactions.",
    syllabusTag: "DBMS", memberCount: 1240, postCount: 387, category: "Academics",
  },
  {
    id: "com2", slug: "aiml", name: "r/AI-ML",
    description: "Artificial intelligence and machine learning across campuses.",
    syllabusTag: "Artificial Intelligence", memberCount: 2870, postCount: 914, category: "Academics",
  },
  {
    id: "com3", slug: "open-source", name: "r/OpenSource",
    description: "Open-source contributions, GSoC, Hacktoberfest, and more.",
    memberCount: 1590, postCount: 603, category: "Projects",
  },
  {
    id: "com4", slug: "cp-guild", name: "r/CP-Guild",
    description: "Competitive programming — Codeforces, LeetCode, contests.",
    memberCount: 3200, postCount: 1102, category: "Academics",
  },
  {
    id: "com5", slug: "web-dev", name: "r/WebDev",
    description: "Frontend, backend, full-stack — React, Next.js, Node, and more.",
    memberCount: 1880, postCount: 742, category: "Projects",
  },
  {
    id: "com6", slug: "research", name: "r/Research",
    description: "Research papers, methodologies, collaboration, and mentorship.",
    memberCount: 920, postCount: 281, category: "Research",
  },
  {
    id: "com7", slug: "cybersec", name: "r/CyberSec",
    description: "Security, CTF, ethical hacking, and cryptography.",
    memberCount: 1140, postCount: 456, category: "Academics",
  },
  {
    id: "com8", slug: "women-in-tech", name: "r/WomenInTech",
    description: "Safe space for women in tech — mentorship, opportunities, support.",
    memberCount: 780, postCount: 194, category: "Community",
  },
];

// ── Posts / Threads ───────────────────────────────────────────────────────────
export const posts: Post[] = [
  {
    id: "p1", communitySlug: "dbms", authorId: "u6", anon: true,
    title: "Why does a full table scan happen even when I have an index on the column?",
    body: "I created a B-tree index on `email` in PostgreSQL but EXPLAIN still shows Seq Scan. The table has 50k rows. Is the query planner broken?",
    status: "resolved", upvotes: 47, commentCount: 12, credits: 35,
    tags: ["PostgreSQL", "indexing", "query-planner"],
    createdAt: "2026-10-02T04:30:00Z",
  },
  {
    id: "p2", communitySlug: "aiml", authorId: "u4", anon: false,
    title: "Implementing cosine similarity search with pgvector — step-by-step help?",
    body: "I'm trying to implement a similar-question suggestion feature (like Connext does internally). Using FastAPI + PostgreSQL. Where do I start?",
    status: "open", upvotes: 31, commentCount: 8, credits: 0,
    tags: ["pgvector", "embeddings", "PostgreSQL", "FastAPI"],
    createdAt: "2026-10-02T07:15:00Z",
  },
  {
    id: "p3", communitySlug: "web-dev", authorId: "u3", anon: false,
    title: "Best way to structure a Next.js 14 App Router project for a mid-size team?",
    body: "We're 4 devs building a platform. Should we use feature folders or route-based grouping? Any real-world examples?",
    status: "open", upvotes: 28, commentCount: 15, credits: 0,
    tags: ["Next.js", "App Router", "architecture"],
    createdAt: "2026-10-01T18:00:00Z",
  },
  {
    id: "p4", communitySlug: "cp-guild", authorId: "u6", anon: false,
    title: "Codeforces Round 982 — Div 2 D — Segment tree approach explanation",
    body: "I solved it with a lazy segment tree but I want to understand if there's a simpler BIT approach. Anyone?",
    status: "open", upvotes: 19, commentCount: 6, credits: 0,
    tags: ["Codeforces", "segment-tree", "BIT"],
    createdAt: "2026-10-02T08:00:00Z",
  },
  {
    id: "p5", communitySlug: "aiml", authorId: "u5", anon: false,
    title: "📢 [Faculty Post] AICTE-sponsored ML project positions open @ VJTI — Apply before Oct 15",
    body: "Looking for 2 motivated students (any college) with Python + basic ML background for a 6-month AICTE-funded NLP research project. DM to apply.",
    status: "open", upvotes: 84, commentCount: 23, credits: 0,
    tags: ["opportunity", "research", "NLP", "AICTE"],
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "p6", communitySlug: "open-source", authorId: "u2", anon: false,
    title: "Hacktoberfest 2026 — Connext is participating! Check our issues 🎃",
    body: "We're opening up good-first-issues on the Connext repo. All contributions count toward your Academic Passport. Come build with us.",
    status: "open", upvotes: 112, commentCount: 34, credits: 0,
    tags: ["Hacktoberfest", "open-source", "Connext"],
    createdAt: "2026-10-01T06:00:00Z",
  },
];

// ── Quests ────────────────────────────────────────────────────────────────────
export const dailyQuests = [
  { id: "q1", title: "Ask or answer once", progress: 0, target: 1, xpReward: 50, icon: "💬" },
  { id: "q2", title: "Join a new community", progress: 0, target: 1, xpReward: 25, icon: "🏘️" },
  { id: "q3", title: "Mark an answer as helpful", progress: 0, target: 1, xpReward: 75, icon: "✅" },
];

// ── Helper functions ──────────────────────────────────────────────────────────
export const getUserById   = (id: string) => users.find(u => u.id === id);
export const getCommunity  = (slug: string) => communities.find(c => c.slug === slug);
export const getPostsBySlug = (slug: string) => posts.filter(p => p.communitySlug === slug);
export const getPostById   = (id: string) => posts.find(p => p.id === id);

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};
