import { sql } from "drizzle-orm";
import { db, pool, isInMemoryDb } from "./index.js";
import { migrate } from "./migrate.js";
import {
  badges,
  channels,
  comments,
  communities,
  creditEvents,
  creditLedger,
  institutions,
  memberships,
  mockLinks,
  posts,
  quests,
  userBadges,
  userQuests,
  users,
  votes,
} from "./schema.js";
import { hashEmbed, toVectorLiteral } from "../services/embeddings.js";
import { UNBLOCK_WEIGHT, xpToLevel } from "../services/credits.js";

const INSTITUTIONS = [
  { id: "i1", name: "Xavier Institute of Engineering", short: "XIE", city: "Mumbai", state: "Maharashtra", domain: "xie.edu.in" },
  { id: "i2", name: "VJTI Mumbai", short: "VJTI", city: "Mumbai", state: "Maharashtra", domain: "vjti.ac.in" },
  { id: "i3", name: "COEP Pune", short: "COEP", city: "Pune", state: "Maharashtra", domain: "coep.ac.in" },
  { id: "i4", name: "NIT Trichy", short: "NIT", city: "Trichy", state: "Tamil Nadu", domain: "nitt.edu" },
];

type SeedUser = {
  id: string;
  handle: string;
  displayName: string;
  initials: string;
  email: string;
  role: string;
  institutionId: string;
  bio: string;
  skills: string[];
  interests: string[];
  xp: number;
  streak: number;
};

const USERS: SeedUser[] = [
  { id: "u1", handle: "tanmay.kudkar", displayName: "Tanmay Kudkar", initials: "TK", email: "tanmay@xie.edu.in", role: "student", institutionId: "i1", bio: "Full-stack dev. Building Connext.", skills: ["React", "Next.js", "TypeScript", "Node.js"], interests: ["Web Dev", "Open Source", "AI"], xp: 1420, streak: 12 },
  { id: "u2", handle: "ritesh.gharat", displayName: "Ritesh Gharat", initials: "RG", email: "ritesh@xie.edu.in", role: "student", institutionId: "i1", bio: "Team lead @ DarkShield. Systems engineer.", skills: ["Go", "Python", "System Design", "Docker"], interests: ["Backend", "DevOps", "Distributed Systems"], xp: 2100, streak: 21 },
  { id: "u3", handle: "atharva.raut", displayName: "Atharva Raut", initials: "AR", email: "atharva@xie.edu.in", role: "student", institutionId: "i1", bio: "UI/UX nerd. Loves design systems.", skills: ["Figma", "React", "Tailwind", "Framer Motion"], interests: ["Product Design", "Frontend"], xp: 980, streak: 8 },
  { id: "u4", handle: "ved.kumare", displayName: "Ved Kumare", initials: "VK", email: "ved@xie.edu.in", role: "student", institutionId: "i1", bio: "ML enthusiast.", skills: ["Python", "PyTorch", "Postgres", "NLP"], interests: ["Machine Learning", "NLP", "Research"], xp: 760, streak: 5 },
  { id: "u5", handle: "priya.sharma", displayName: "Dr. Priya Sharma", initials: "PS", email: "priya.sharma@vjti.ac.in", role: "faculty", institutionId: "i2", bio: "Prof. CS, VJTI. Research: NLP & Education Tech.", skills: ["NLP", "Research", "Python", "Academic Mentoring"], interests: ["Education Technology", "NLP", "AI Ethics"], xp: 8400, streak: 45 },
  { id: "u6", handle: "arjun.nair", displayName: "Arjun Nair", initials: "AN", email: "arjun@coep.ac.in", role: "student", institutionId: "i3", bio: "Competitive programmer.", skills: ["C++", "Algorithms", "Data Structures"], interests: ["Competitive Programming", "Problem Solving"], xp: 590, streak: 3 },
  { id: "u7", handle: "meera.iyer", displayName: "Meera Iyer", initials: "MI", email: "meera@nitt.edu", role: "researcher", institutionId: "i4", bio: "PhD Candidate, Compiler Design @ NIT Trichy.", skills: ["LLVM", "Compilers", "C", "Rust"], interests: ["Compilers", "PL Theory", "Systems"], xp: 3800, streak: 18 },
  { id: "u8", handle: "anaya.desai", displayName: "Anaya Desai", initials: "AD", email: "anaya@xie.edu.in", role: "student", institutionId: "i1", bio: "DBMS TA and puzzle addict.", skills: ["SQL", "PostgreSQL", "Java"], interests: ["Databases", "Teaching"], xp: 640, streak: 4 },
  { id: "u9", handle: "kabir.joshi", displayName: "Kabir Joshi", initials: "KJ", email: "kabir@vjti.ac.in", role: "student", institutionId: "i2", bio: "Open source weekend warrior.", skills: ["Rust", "Git", "Linux"], interests: ["Open Source", "Systems"], xp: 1100, streak: 9 },
  { id: "u10", handle: "nisha.patel", displayName: "Nisha Patel", initials: "NP", email: "nisha@coep.ac.in", role: "student", institutionId: "i3", bio: "Security club lead.", skills: ["C", "Cryptography", "Linux"], interests: ["Cybersecurity", "CTF"], xp: 870, streak: 6 },
  { id: "u11", handle: "rohan.menon", displayName: "Rohan Menon", initials: "RM", email: "rohan@nitt.edu", role: "student", institutionId: "i4", bio: "Web + ML hybrid.", skills: ["Python", "React", "Postgres"], interests: ["AI", "Web Dev"], xp: 720, streak: 2 },
  { id: "u12", handle: "sanya.kapoor", displayName: "Sanya Kapoor", initials: "SK", email: "sanya@xie.edu.in", role: "student", institutionId: "i1", bio: "Women in tech organiser.", skills: ["Product", "Figma", "React"], interests: ["Community", "Product Design"], xp: 540, streak: 7 },
  { id: "u13", handle: "vikram.rao", displayName: "Dr. Vikram Rao", initials: "VR", email: "vikram.rao@coep.ac.in", role: "faculty", institutionId: "i3", bio: "COEP faculty. Compilers and OS.", skills: ["C", "OS", "Mentoring"], interests: ["Systems", "Curriculum"], xp: 6200, streak: 30 },
  { id: "u14", handle: "isha.banerjee", displayName: "Isha Banerjee", initials: "IB", email: "isha@alumni.nitt.edu", role: "mentor", institutionId: "i4", bio: "Industry mentor. Ex-researcher.", skills: ["Mentoring", "Research", "Python"], interests: ["Career", "Research"], xp: 2500, streak: 11 },
  { id: "u15", handle: "leo.fernandes", displayName: "Leo Fernandes", initials: "LF", email: "leo@vjti.ac.in", role: "student", institutionId: "i2", bio: "Full-stack intern hunter.", skills: ["Node.js", "TypeScript", "Docker"], interests: ["Web Dev", "DevOps"], xp: 430, streak: 1 },
];

const COMMUNITIES = [
  { id: "com1", slug: "dbms", name: "r/DBMS", description: "Database management systems — SQL, NoSQL, indexing, transactions.", syllabusTag: "DBMS", category: "Academics" },
  { id: "com2", slug: "aiml", name: "r/AI-ML", description: "Artificial intelligence and machine learning across campuses.", syllabusTag: "Artificial Intelligence", category: "Academics" },
  { id: "com3", slug: "open-source", name: "r/OpenSource", description: "Open-source contributions, GSoC, Hacktoberfest, and more.", syllabusTag: null, category: "Projects" },
  { id: "com4", slug: "cp-guild", name: "r/CP-Guild", description: "Competitive programming — Codeforces, LeetCode, contests.", syllabusTag: null, category: "Academics" },
  { id: "com5", slug: "web-dev", name: "r/WebDev", description: "Frontend, backend, full-stack — React, Next.js, Node, and more.", syllabusTag: null, category: "Projects" },
  { id: "com6", slug: "research", name: "r/Research", description: "Research papers, methodologies, collaboration, and mentorship.", syllabusTag: null, category: "Research" },
  { id: "com7", slug: "cybersec", name: "r/CyberSec", description: "Security, CTF, ethical hacking, and cryptography.", syllabusTag: "Cyber Security", category: "Academics" },
  { id: "com8", slug: "women-in-tech", name: "r/WomenInTech", description: "Safe space for women in tech — mentorship, opportunities, support.", syllabusTag: null, category: "Community" },
];

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000);
}

type PostSeed = {
  id: string;
  slug: string;
  authorId: string;
  anon: boolean;
  title: string;
  body: string;
  status: "open" | "resolved";
  tags: string[];
  createdAt: Date;
};

function generatePosts(): PostSeed[] {
  const crafted: PostSeed[] = [
    {
      id: "p1",
      slug: "dbms",
      authorId: "u6",
      anon: true,
      title: "Why does a full table scan happen even when I have an index on the column?",
      body: "I created a B-tree index on email in PostgreSQL but EXPLAIN still shows Seq Scan. The table has 50k rows. Is the query planner broken?",
      status: "resolved",
      tags: ["PostgreSQL", "indexing", "query-planner"],
      createdAt: new Date("2026-10-02T04:30:00Z"),
    },
    {
      id: "p2",
      slug: "aiml",
      authorId: "u4",
      anon: false,
      title: "Implementing cosine similarity search with pgvector — step-by-step help?",
      body: "Trying to build a similar-question feature using Node + PostgreSQL + pgvector. Where do I start?",
      status: "open",
      tags: ["pgvector", "embeddings", "PostgreSQL"],
      createdAt: new Date("2026-10-02T07:15:00Z"),
    },
    {
      id: "p3",
      slug: "web-dev",
      authorId: "u3",
      anon: false,
      title: "Best way to structure a Next.js 14 App Router project for a mid-size team?",
      body: "We're 4 devs building a platform. Feature folders or route-based grouping?",
      status: "open",
      tags: ["Next.js", "App Router", "architecture"],
      createdAt: new Date("2026-10-01T18:00:00Z"),
    },
    {
      id: "p4",
      slug: "cp-guild",
      authorId: "u6",
      anon: false,
      title: "Codeforces Round 982 — Div 2 D — Segment tree approach explanation",
      body: "Solved with a lazy segment tree. Is there a simpler BIT approach?",
      status: "open",
      tags: ["Codeforces", "segment-tree", "BIT"],
      createdAt: new Date("2026-10-02T08:00:00Z"),
    },
    {
      id: "p5",
      slug: "aiml",
      authorId: "u5",
      anon: false,
      title: "[Faculty] AICTE-sponsored ML project positions open @ VJTI — Apply before Oct 15",
      body: "Looking for 2 students (any college) with Python + basic ML for a 6-month NLP project.",
      status: "open",
      tags: ["opportunity", "research", "NLP", "AICTE"],
      createdAt: new Date("2026-10-01T10:00:00Z"),
    },
    {
      id: "p6",
      slug: "open-source",
      authorId: "u2",
      anon: false,
      title: "Hacktoberfest 2026 — Connext is participating. Check our issues",
      body: "Good-first-issues on the Connext repo. Contributions count toward Academic Passport.",
      status: "open",
      tags: ["Hacktoberfest", "open-source", "Connext"],
      createdAt: new Date("2026-10-01T06:00:00Z"),
    },
  ];

  const extras: Array<[string, string, string[], string]> = [
    ["dbms", "Does Postgres ignore my index when I wrap the column in lower()?", ["PostgreSQL", "indexing"], "u8"],
    ["dbms", "How do I pick a fillfactor for a heavily updated btree index?", ["PostgreSQL", "indexing"], "u1"],
    ["dbms", "Serializable vs repeatable read — when does campus DBMS lab expect which?", ["transactions", "DBMS"], "u9"],
    ["dbms", "EXPLAIN ANALYZE says Seq Scan on 50k rows with an email index. Why?", ["query-planner", "PostgreSQL"], "u15"],
    ["dbms", "Normalisation to 3NF vs BCNF for our library schema assignment", ["DBMS", "normalisation"], "u11"],
    ["aiml", "Which embedding model dimension should I pin for pgvector?", ["embeddings", "pgvector"], "u4"],
    ["aiml", "Fine-tuning vs RAG for a campus FAQ bot?", ["RAG", "LLM"], "u11"],
    ["aiml", "My cosine similarity ranks unrelated DBMS posts above indexing posts", ["embeddings", "similarity"], "u8"],
    ["aiml", "How do you store 768-d vectors without blowing the row size?", ["pgvector", "PostgreSQL"], "u2"],
    ["aiml", "Is keyword overlap good enough for a hackathon similar-question feature?", ["embeddings", "search"], "u1"],
    ["web-dev", "Cookie SameSite=Lax + Next.js rewrites — login works locally, fails in Docker", ["Next.js", "auth", "cookies"], "u15"],
    ["web-dev", "Should Fastify plugins map 1:1 to Architecture.md modules?", ["Fastify", "architecture"], "u2"],
    ["web-dev", "Tailwind tokens for Vibe/Pro without duplicating components", ["Tailwind", "design-tokens"], "u3"],
    ["web-dev", "RSC fetch does not forward my session cookie. What am I missing?", ["Next.js", "cookies"], "u1"],
    ["web-dev", "Zod response schemas to strip author_id — is this overkill?", ["Zod", "privacy"], "u2"],
    ["cp-guild", "BIT vs segment tree for range add + point query?", ["BIT", "segment-tree"], "u6"],
    ["cp-guild", "Codeforces Div2 C greedy proof sketch please", ["Codeforces", "greedy"], "u10"],
    ["cp-guild", "How do you debug TLE when N=2e5 and you already used a Fenwick?", ["BIT", "complexity"], "u6"],
    ["open-source", "Good first issues that actually teach git rebase?", ["git", "open-source"], "u9"],
    ["open-source", "Does contributing docs count for GSoC prep?", ["GSoC", "open-source"], "u12"],
    ["research", "How do I write a related work section without sounding like a survey paper?", ["writing", "research"], "u7"],
    ["research", "ORCID vs Google Scholar for a third-year undergrad?", ["ORCID", "identity"], "u14"],
    ["research", "IRB-equivalent for a campus survey on anonymous asking?", ["ethics", "research"], "u5"],
    ["cybersec", "Is storing author_id on anonymous posts a deanonymization risk in logs?", ["privacy", "logging"], "u10"],
    ["cybersec", "Rate limiting OTP without locking out a shared lab NAT", ["rate-limit", "auth"], "u15"],
    ["cybersec", "CTF crypto 101: why is ECB on student IDs a bad demo?", ["cryptography", "CTF"], "u10"],
    ["women-in-tech", "How do you ask a 'basic' DBMS doubt without getting piled on?", ["community", "asking"], "u12"],
    ["women-in-tech", "Looking for a research mentor in NLP who actually replies", ["mentoring", "NLP"], "u12"],
    ["research", "Citation graph vs contribution graph — are we reinventing ResearchGate?", ["identity", "research"], "u7"],
    ["dbms", "Hash indexes vs btree for equality-only email lookups", ["indexing", "PostgreSQL"], "u8"],
    ["aiml", "HNSW vs IVFFlat for 10k campus questions", ["pgvector", "HNSW"], "u4"],
    ["web-dev", "Mobile bottom nav vs a FAB for Ask — Design.md says no FAB", ["mobile", "IA"], "u3"],
    ["cp-guild", "Practice set for segment trees that is not 50 identical problems", ["segment-tree"], "u6"],
    ["open-source", "DCO vs CLA for a student-run org", ["open-source", "legal"], "u9"],
  ];

  const generated = extras.map((item, i) => ({
    id: `p${i + 7}`,
    slug: item[0],
    authorId: item[3],
    anon: i % 3 === 0,
    title: item[1],
    body: `Context from ${item[0]}: ${item[1]} I already searched older threads. Looking for a concrete next step, not a link dump.`,
    status: "open" as const,
    tags: item[2],
    createdAt: daysAgo((i % 20) + 1),
  }));

  return [...crafted, ...generated];
}

export async function seed() {
  await migrate();

  const tableNames = [
    "mock_links", "reports", "user_badges", "badges", "user_quests", "quests",
    "credit_events", "credit_ledger", "votes", "comments", "posts", "memberships",
    "channels", "communities", "users", "institutions"
  ];
  for (const table of tableNames) {
    try {
      await db.execute(sql.raw(`DELETE FROM ${table}`));
    } catch (e) {}
  }

  await db.insert(institutions).values(INSTITUTIONS);
  await db.insert(users).values(
    USERS.map((u) => ({
      id: u.id,
      handle: u.handle,
      displayName: u.displayName,
      initials: u.initials,
      email: u.email,
      role: u.role,
      institutionId: u.institutionId,
      mode: u.role === "faculty" || u.role === "researcher" ? "pro" : "vibe",
      verifiedAt: new Date(),
      bio: u.bio,
      skills: u.skills,
      interests: u.interests,
    })),
  );

  await db.insert(communities).values(
    COMMUNITIES.map((c) => ({
      ...c,
      syllabusTag: c.syllabusTag,
    })),
  );

  const channelRows = COMMUNITIES.flatMap((c) => [
    { id: `${c.id}-qa`, communityId: c.id, type: "qa", name: "Q&A" },
    { id: `${c.id}-projects`, communityId: c.id, type: "projects", name: "Projects" },
    { id: `${c.id}-announce`, communityId: c.id, type: "announce", name: "Announcements" },
    { id: `${c.id}-chat`, communityId: c.id, type: "chat", name: "Chat" },
  ]);
  await db.insert(channels).values(channelRows);

  const membershipRows = USERS.flatMap((u) =>
    COMMUNITIES.slice(0, u.role === "faculty" ? 8 : 4).map((c) => ({
      userId: u.id,
      communityId: c.id,
      role: u.role === "faculty" ? "moderator" : "member",
    })),
  );
  await db.insert(memberships).values(membershipRows);

  const postSeeds = generatePosts();
  const slugToQa = new Map(COMMUNITIES.map((c) => [c.slug, `${c.id}-qa`]));
  const slugToAnnounce = new Map(COMMUNITIES.map((c) => [c.slug, `${c.id}-announce`]));

  for (const p of postSeeds) {
    const channelId = p.authorId === "u5" && p.id === "p5" ? slugToAnnounce.get(p.slug)! : slugToQa.get(p.slug)!;
    await db.insert(posts).values({
      id: p.id,
      channelId,
      authorId: p.authorId,
      anon: p.anon,
      title: p.title,
      body: p.body,
      status: p.status,
      tags: p.tags,
      createdAt: p.createdAt,
    });
    const vec = hashEmbed(`${p.title} ${p.body}`);
    if (isInMemoryDb) {
      await db.execute(sql`UPDATE posts SET embedding = ${toVectorLiteral(vec)} WHERE id = ${p.id}`);
    } else {
      await db.execute(sql`UPDATE posts SET embedding = ${toVectorLiteral(vec)}::vector WHERE id = ${p.id}`);
    }
  }

  const cm1 = "cm1";
  const cm2 = "cm2";
  const cm3 = "cm3";
  const cm1b = "cm1b";
  await db.insert(comments).values([
    {
      id: cm1,
      postId: "p1",
      parentId: null,
      path: `${cm1}/`,
      authorId: "u5",
      anon: false,
      body: "The planner uses statistics. If the table is small relative to what ANALYZE thinks, seq scan can win. Run ANALYZE, then EXPLAIN ANALYZE again. Also avoid wrapping the indexed column in lower().",
      createdAt: new Date("2026-10-02T05:00:00Z"),
    },
    {
      id: cm1b,
      postId: "p1",
      parentId: cm1,
      path: `${cm1}/${cm1b}/`,
      authorId: "u8",
      anon: false,
      body: "That matches what we saw in lab — function on the column defeats the btree.",
      createdAt: new Date("2026-10-02T05:20:00Z"),
    },
    {
      id: cm2,
      postId: "p1",
      parentId: null,
      path: `${cm2}/`,
      authorId: "u2",
      anon: false,
      body: "Temporarily SET enable_seqscan = off to see if the index plan is actually faster. If yes, tune random_page_cost.",
      createdAt: new Date("2026-10-02T05:45:00Z"),
    },
    {
      id: cm3,
      postId: "p2",
      parentId: null,
      path: `${cm3}/`,
      authorId: "u4",
      anon: false,
      body: "CREATE EXTENSION vector; add a vector(768) column; query with embedding <=> $1. Pin the dimension at boot.",
      createdAt: new Date("2026-10-02T08:00:00Z"),
    },
  ]);

  await db.insert(creditEvents).values({
    id: "e1",
    userId: "u5",
    type: "this_unblocked_me",
    commentId: cm1,
    confirmerId: "u6",
    weight: UNBLOCK_WEIGHT,
    createdAt: new Date("2026-10-02T06:00:00Z"),
  });

  await db.insert(creditLedger).values(
    USERS.map((u) => ({
      userId: u.id,
      balance: u.id === "u5" ? u.xp / 4 + UNBLOCK_WEIGHT : Math.round(u.xp / 4),
      xp: u.id === "u5" ? u.xp : u.xp,
      level: xpToLevel(u.xp),
      streakDays: u.streak,
      lastActive: new Date(),
    })),
  );

  await db.insert(quests).values([
    { id: "q1", title: "Ask or answer once", target: 1, xpReward: 50, icon: "chat", kind: "ask_or_answer" },
    { id: "q2", title: "Join a new community", target: 1, xpReward: 25, icon: "community", kind: "join_community" },
    { id: "q3", title: "Mark an answer as helpful", target: 1, xpReward: 75, icon: "check", kind: "mark_helpful" },
  ]);

  await db.insert(userQuests).values(
    USERS.flatMap((u) =>
      ["q1", "q2", "q3"].map((qid) => ({
        userId: u.id,
        questId: qid,
        progress: qid === "q2" ? 1 : 0,
        completedAt: qid === "q2" ? new Date() : null,
      })),
    ),
  );
  await db
    .insert(userQuests)
    .values({ userId: "u6", questId: "q3", progress: 1, completedAt: new Date() })
    .onConflictDoUpdate({
      target: [userQuests.userId, userQuests.questId],
      set: { progress: 1, completedAt: new Date() },
    });

  await db.insert(badges).values([
    { id: "streak7", name: "7-Day Streak", icon: "flame" },
    { id: "first-answer", name: "First Answer", icon: "chat" },
    { id: "accepted", name: "Accepted Answer", icon: "check" },
    { id: "ten", name: "10 Contributions", icon: "rocket" },
    { id: "cross-campus", name: "Cross-Campus", icon: "globe" },
    { id: "top", name: "Top Contributor", icon: "crown" },
  ]);
  await db.insert(userBadges).values([
    { userId: "u5", badgeId: "accepted" },
    { userId: "u5", badgeId: "first-answer" },
    { userId: "u2", badgeId: "streak7" },
    { userId: "u1", badgeId: "first-answer" },
  ]);

  await db.insert(votes).values([
    { userId: "u1", targetType: "post", targetId: "p1", value: 1 },
    { userId: "u2", targetType: "post", targetId: "p1", value: 1 },
    { userId: "u8", targetType: "comment", targetId: cm1, value: 1 },
  ]);

  await db.insert(mockLinks).values({
    userId: "u1",
    provider: "linkedin",
    payload: {
      headline: "CS student @ XIE · Building Connext",
      experience: [
        { title: "Core member", org: "Team DarkShield", years: "2025 —" },
        { title: "Web intern", org: "Campus labs", years: "2024" },
      ],
      skills: ["TypeScript", "Next.js", "Product"],
    },
  });

  console.log(`Seeded ${USERS.length} users, ${postSeeds.length} posts.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(async () => {
      await pool.end();
    })
    .catch(async (err) => {
      console.error(err);
      await pool.end();
      process.exit(1);
    });
}
