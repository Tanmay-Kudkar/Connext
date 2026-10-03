import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import { mockLinks } from "../db/schema.js";
import { requireUser } from "../plugins/auth.js";

const linkedinPayload = z.object({
  headline: z.string(),
  experience: z.array(
    z.object({
      title: z.string(),
      org: z.string(),
      years: z.string(),
    }),
  ),
  skills: z.array(z.string()),
});

const researchGatePayload = z.object({
  papers: z.array(
    z.object({
      title: z.string(),
      year: z.string(),
      citations: z.number(),
      venue: z.string().optional(),
    }),
  ),
});

export async function integrationRoutes(app: FastifyInstance) {
  app.get("/api/passport/me", async (request) => {
    const user = requireUser(request.user);
    const links = await db.select().from(mockLinks).where(eq(mockLinks.userId, user.id));
    const linkedin = links.find((l) => l.provider === "linkedin");
    const researchgate = links.find((l) => l.provider === "researchgate");
    const linkedinData = (linkedin?.payload ?? null) as z.infer<typeof linkedinPayload> | null;
    const rgData = (researchgate?.payload ?? null) as z.infer<typeof researchGatePayload> | null;
    const connected = [linkedin, researchgate].filter(Boolean).length;
    const pct = Math.round(((2 + (user.skills.length ? 1 : 0) + (user.verifiedAt ? 1 : 0) + connected) / 6) * 100);
    return {
      completion: Math.min(pct, 100),
      linkedin: linkedinData,
      researchgate: rgData,
      githubConnected: false,
      orcidConnected: false,
    };
  });

  app.post("/api/integrations/mock/linkedin/connect", async (request) => {
    const user = requireUser(request.user);
    const payload = linkedinPayload.parse(request.body);
    await db
      .insert(mockLinks)
      .values({ userId: user.id, provider: "linkedin", payload })
      .onConflictDoUpdate({
        target: [mockLinks.userId, mockLinks.provider],
        set: { payload },
      });
    return { ok: true, provider: "linkedin" };
  });

  app.post("/api/integrations/mock/researchgate/connect", async (request) => {
    const user = requireUser(request.user);
    const payload = researchGatePayload.parse(request.body);
    await db
      .insert(mockLinks)
      .values({ userId: user.id, provider: "researchgate", payload })
      .onConflictDoUpdate({
        target: [mockLinks.userId, mockLinks.provider],
        set: { payload },
      });
    return { ok: true, provider: "researchgate" };
  });

  app.get("/api/integrations/mock/status", async (request) => {
    const user = requireUser(request.user);
    const links = await db.select().from(mockLinks).where(eq(mockLinks.userId, user.id));
    return {
      linkedin: links.some((l) => l.provider === "linkedin"),
      researchgate: links.some((l) => l.provider === "researchgate"),
    };
  });
}

