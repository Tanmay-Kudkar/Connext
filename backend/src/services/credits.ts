import { eq, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { creditEvents, creditLedger, quests, userBadges, userQuests } from "../db/schema.js";
import { Errors, isUniqueViolation } from "../errors.js";

export const LEVEL_THRESHOLDS = [0, 200, 500, 900, 1400, 2000, 2700, 3500, 4500, 5700, 7000];
export const UNBLOCK_WEIGHT = 35;

export function xpToLevel(xp: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

export async function bumpQuest(userId: string, kind: string, by = 1) {
  const [quest] = await db.select().from(quests).where(eq(quests.kind, kind)).limit(1);
  if (!quest) return;
  await db
    .insert(userQuests)
    .values({ userId, questId: quest.id, progress: 0 })
    .onConflictDoNothing();
  await db.execute(sql`
    UPDATE user_quests
    SET progress = LEAST(progress + ${by}, ${quest.target}),
        completed_at = CASE
          WHEN progress + ${by} >= ${quest.target} AND completed_at IS NULL THEN now()
          ELSE completed_at
        END
    WHERE user_id = ${userId} AND quest_id = ${quest.id}
  `);
}

export async function awardUnblock(opts: {
  helperId: string;
  confirmerId: string;
  commentId: string;
  eventId: string;
}) {
  if (opts.helperId === opts.confirmerId) throw Errors.selfConfirm();
  const weekly = await db.execute(sql`
    SELECT count(*)::int AS n
    FROM credit_events
    WHERE confirmer_id = ${opts.confirmerId}
      AND user_id = ${opts.helperId}
      AND type = 'this_unblocked_me'
      AND created_at > now() - interval '7 days'
  `);
  const weeklyCount = Number((weekly.rows[0] as { n?: number } | undefined)?.n ?? 0);
  if (weeklyCount >= 8) throw Errors.alreadyAwarded();

  try {
    await db.insert(creditEvents).values({
      id: opts.eventId,
      userId: opts.helperId,
      type: "this_unblocked_me",
      commentId: opts.commentId,
      confirmerId: opts.confirmerId,
      weight: UNBLOCK_WEIGHT,
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw Errors.alreadyAwarded();
    throw err;
  }

  await db
    .insert(creditLedger)
    .values({
      userId: opts.helperId,
      balance: UNBLOCK_WEIGHT,
      xp: UNBLOCK_WEIGHT,
      level: xpToLevel(UNBLOCK_WEIGHT),
      streakDays: 1,
      lastActive: new Date(),
    })
    .onConflictDoUpdate({
      target: creditLedger.userId,
      set: {
        balance: sql`${creditLedger.balance} + ${UNBLOCK_WEIGHT}`,
        xp: sql`${creditLedger.xp} + ${UNBLOCK_WEIGHT}`,
        lastActive: new Date(),
        streakDays: sql`CASE
          WHEN ${creditLedger.lastActive} IS NULL THEN 1
          WHEN ${creditLedger.lastActive}::date = CURRENT_DATE THEN ${creditLedger.streakDays}
          WHEN ${creditLedger.lastActive}::date = CURRENT_DATE - 1 THEN ${creditLedger.streakDays} + 1
          ELSE 1
        END`,
      },
    });

  const [ledger] = await db
    .select()
    .from(creditLedger)
    .where(eq(creditLedger.userId, opts.helperId))
    .limit(1);
  if (ledger) {
    const level = xpToLevel(ledger.xp);
    if (level !== ledger.level) {
      await db.update(creditLedger).set({ level }).where(eq(creditLedger.userId, opts.helperId));
    }
  }

  await bumpQuest(opts.confirmerId, "mark_helpful");
  await db
    .insert(userBadges)
    .values({ userId: opts.helperId, badgeId: "accepted" })
    .onConflictDoNothing();

  return { weight: UNBLOCK_WEIGHT };
}
