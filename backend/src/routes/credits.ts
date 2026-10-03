import { desc, eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import {
  badges,
  creditEvents,
  creditLedger,
  quests,
  userBadges,
  userQuests,
  users,
} from "../db/schema.js";
import { requireUser } from "../plugins/auth.js";
import { xpToLevel } from "../services/credits.js";

export async function creditRoutes(app: FastifyInstance) {
  app.get("/api/credits/stats/me", async (request) => {
    const user = requireUser(request.user);
    const [ledger] = await db
      .select()
      .from(creditLedger)
      .where(eq(creditLedger.userId, user.id))
      .limit(1);
    const xp = ledger?.xp ?? 0;
    return {
      xp,
      level: ledger?.level ?? xpToLevel(xp),
      credits: ledger?.balance ?? 0,
      streakDays: ledger?.streakDays ?? 0,
      lastActive: ledger?.lastActive ?? null,
    };
  });

  app.get("/api/credits/events/me", async (request) => {
    const user = requireUser(request.user);
    const events = await db
      .select()
      .from(creditEvents)
      .where(eq(creditEvents.userId, user.id))
      .orderBy(desc(creditEvents.createdAt))
      .limit(50);
    return { events };
  });

  app.get("/api/credits/heatmap/me", async (request) => {
    const user = requireUser(request.user);
    const rows = await db.execute(sql`
      SELECT created_at::date AS day, count(*)::int AS count
      FROM credit_events
      WHERE user_id = ${user.id}
        AND created_at > now() - interval '84 days'
      GROUP BY 1
      ORDER BY 1
    `);
    return { days: rows.rows };
  });

  app.get("/api/credits/leaderboard", async () => {
    const rows = await db
      .select({
        userId: creditLedger.userId,
        xp: creditLedger.xp,
        level: creditLedger.level,
        credits: creditLedger.balance,
        streakDays: creditLedger.streakDays,
        handle: users.handle,
        displayName: users.displayName,
        initials: users.initials,
      })
      .from(creditLedger)
      .innerJoin(users, eq(users.id, creditLedger.userId))
      .orderBy(desc(creditLedger.xp))
      .limit(10);
    return {
      leaderboard: rows.map((r, i) => ({ rank: i + 1, ...r })),
    };
  });

  app.get("/api/quests/me", async (request) => {
    const user = requireUser(request.user);
    const all = await db.select().from(quests);
    const mine = await db.select().from(userQuests).where(eq(userQuests.userId, user.id));
    const map = new Map(mine.map((m) => [m.questId, m]));
    return {
      quests: all.map((q) => ({
        ...q,
        progress: map.get(q.id)?.progress ?? 0,
        completedAt: map.get(q.id)?.completedAt ?? null,
      })),
    };
  });

  app.get("/api/badges/me", async (request) => {
    const user = requireUser(request.user);
    const all = await db.select().from(badges);
    const mine = await db.select().from(userBadges).where(eq(userBadges.userId, user.id));
    const earned = new Set(mine.map((m) => m.badgeId));
    return {
      badges: all.map((b) => ({
        ...b,
        earned: earned.has(b.id),
        earnedAt: mine.find((m) => m.badgeId === b.id)?.earnedAt ?? null,
      })),
    };
  });
}
