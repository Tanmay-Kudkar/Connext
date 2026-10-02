import { eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import { institutions, posts, users } from "../db/schema.js";
import { ConnextError, Errors } from "../errors.js";
import { requireUser } from "../plugins/auth.js";
import { embedText, toVectorLiteral } from "../services/embeddings.js";

export async function aiRoutes(app: FastifyInstance) {
  app.post("/api/ai/similar-questions", async (request) => {
    requireUser(request.user);
    const body = z
      .object({
        title: z.string().min(3).max(200),
        body: z.string().optional().default(""),
        limit: z.number().int().min(1).max(8).optional().default(3),
      })
      .parse(request.body);
    try {
      const { vector, provider } = await embedText(`${body.title}\n${body.body}`);
      const rows = await db.execute(sql`
        SELECT id, title, body, status, tags, created_at,
               1 - (embedding <=> ${toVectorLiteral(vector)}::vector) AS score
        FROM posts
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> ${toVectorLiteral(vector)}::vector
        LIMIT ${body.limit}
      `);
      request.log.info({ provider, requestId: request.id }, "similar_questions");
      return {
        unavailable: false,
        query: body.title,
        results: (rows.rows as Record<string, unknown>[]).map((r) => ({
          id: r.id,
          title: r.title,
          body: r.body,
          status: r.status,
          tags: r.tags,
          createdAt: r.created_at,
          score: Number(r.score),
        })),
      };
    } catch (err) {
      request.log.warn({ err, requestId: request.id }, "similar_questions_failed");
      const message =
        err instanceof ConnextError ? err.message : "Couldn't check similar threads. You can still post.";
      return {
        unavailable: true,
        message,
        query: body.title,
        results: [],
      };
    }
  });

  app.post("/api/ai/match-teammates", async (request) => {
    const user = requireUser(request.user);
    const body = z
      .object({
        skills: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        limit: z.number().int().min(1).max(8).optional().default(3),
      })
      .parse(request.body);
    const skills = (body.skills?.length ? body.skills : user.skills).map((s) => s.toLowerCase());
    const interests = (body.interests?.length ? body.interests : user.interests).map((s) =>
      s.toLowerCase(),
    );
    const all = await db.select().from(users);
    const insts = await db.select().from(institutions);
    const instMap = new Map(insts.map((i) => [i.id, i]));
    const scored = all
      .filter((u) => u.id !== user.id)
      .map((u) => {
        const uSkills = new Set((u.skills ?? []).map((s) => s.toLowerCase()));
        const uInterests = new Set((u.interests ?? []).map((s) => s.toLowerCase()));
        const matchingSkills = skills.filter((s) => uSkills.has(s));
        const matchingInterests = interests.filter((s) => uInterests.has(s));
        const score = matchingSkills.length + matchingInterests.length * 0.5;
        return {
          userId: u.id,
          handle: u.handle,
          displayName: u.displayName,
          initials: u.initials,
          role: u.role,
          institution: instMap.get(u.institutionId)?.short ?? "",
          city: instMap.get(u.institutionId)?.city ?? "",
          matchingSkills,
          matchingInterests,
          reason:
            matchingSkills.length || matchingInterests.length
              ? `Shared ${[...matchingSkills, ...matchingInterests].slice(0, 4).join(", ")}`
              : "Nearby academic overlap",
          score,
        };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, body.limit);
    return { results: scored };
  });

  app.get("/api/ai/doubt-radar", async (request) => {
    const user = requireUser(request.user);
    if (user.role !== "faculty" && user.role !== "mentor") {
      throw Errors.forbidden("Faculty view only.");
    }
    const open = await db.select().from(posts).where(eq(posts.status, "open"));
    const tagCounts: Record<string, number> = {};
    for (const post of open) {
      for (const tag of post.tags ?? []) {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      }
      if (post.syllabusUnitId) {
        tagCounts[post.syllabusUnitId] = (tagCounts[post.syllabusUnitId] ?? 0) + 1;
      }
    }
    const radar = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, openQuestions]) => ({ topic, openQuestions }));
    return {
      radar,
      note: "Anonymous aggregate of open questions by tag. Identities are not included.",
    };
  });

  app.get("/api/map/people", async (request) => {
    requireUser(request.user);
    const all = await db.select().from(users);
    const insts = await db.select().from(institutions);
    const instMap = new Map(insts.map((i) => [i.id, i]));
    const clusters: Record<
      string,
      { city: string; state: string; people: { handle: string; displayName: string; role: string; initials: string }[] }
    > = {};
    for (const u of all) {
      const inst = instMap.get(u.institutionId);
      if (!inst) continue;
      const key = inst.city;
      clusters[key] ??= { city: inst.city, state: inst.state, people: [] };
      clusters[key].people.push({
        handle: u.handle,
        displayName: u.displayName,
        role: u.role,
        initials: u.initials,
      });
    }
    return { clusters: Object.values(clusters) };
  });
}
