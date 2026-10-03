import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import { institutions, users } from "../db/schema.js";
import { requireUser } from "../plugins/auth.js";
import { Errors } from "../errors.js";
import { publicUser } from "../serializers.js";

export async function userRoutes(app: FastifyInstance) {
  app.patch("/api/users/me", async (request) => {
    const user = requireUser(request.user);
    const body = z
      .object({
        mode: z.enum(["vibe", "pro"]).optional(),
        accent: z.string().optional(),
        avatarPack: z.string().optional(),
        bio: z.string().max(400).optional(),
        displayName: z.string().min(2).max(80).optional(),
      })
      .parse(request.body);
    await db.update(users).set(body).where(eq(users.id, user.id));
    const [next] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const [inst] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, next.institutionId))
      .limit(1);
    return { user: publicUser(next, inst ?? null) };
  });

  app.get("/api/users/:id", async (request) => {
    requireUser(request.user);
    const { id } = request.params as { id: string };
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    if (!user) throw Errors.notFound("User");
    const [inst] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, user.institutionId))
      .limit(1);
    return { user: publicUser(user, inst ?? null) };
  });
}
