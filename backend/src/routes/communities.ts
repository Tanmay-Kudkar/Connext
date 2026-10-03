import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { db } from "../db/index.js";
import {
  channels,
  communities,
  memberships,
  posts,
} from "../db/schema.js";
import { Errors } from "../errors.js";
import { requireUser } from "../plugins/auth.js";
import { bumpQuest } from "../services/credits.js";
import { decoratePosts } from "./posts.js";

export async function communityRoutes(app: FastifyInstance) {
  app.get("/api/communities", async () => {
    const list = await db.select().from(communities);
    const counts = await db
      .select({
        communityId: channels.communityId,
        posts: sql<number>`count(${posts.id})::int`,
      })
      .from(channels)
      .leftJoin(posts, eq(posts.channelId, channels.id))
      .groupBy(channels.communityId);
    const members = await db
      .select({
        communityId: memberships.communityId,
        n: sql<number>`count(*)::int`,
      })
      .from(memberships)
      .groupBy(memberships.communityId);
    return {
      communities: list.map((c) => ({
        ...c,
        postCount: counts.find((x) => x.communityId === c.id)?.posts ?? 0,
        memberCount: members.find((x) => x.communityId === c.id)?.n ?? 0,
      })),
    };
  });

  app.get("/api/communities/:slug", async (request) => {
    const { slug } = request.params as { slug: string };
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug))
      .limit(1);
    if (!community) throw Errors.notFound("Community");
    const chans = await db
      .select()
      .from(channels)
      .where(eq(channels.communityId, community.id));
    const channelIds = chans.map((c) => c.id);
    const feed =
      channelIds.length === 0
        ? []
        : await db
            .select()
            .from(posts)
            .where(inArray(posts.channelId, channelIds))
            .orderBy(desc(posts.createdAt));
    const memberCount = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(memberships)
      .where(eq(memberships.communityId, community.id));
    const joined = request.user
      ? Boolean(
          (
            await db
              .select()
              .from(memberships)
              .where(
                and(
                  eq(memberships.userId, request.user.id),
                  eq(memberships.communityId, community.id),
                ),
              )
              .limit(1)
          )[0],
        )
      : false;
    return {
      community: {
        ...community,
        memberCount: memberCount[0]?.n ?? 0,
        joined,
        channels: chans,
      },
      posts: await decoratePosts(feed, request.user?.id ?? null),
    };
  });

  app.post("/api/communities/:slug/join", async (request) => {
    const user = requireUser(request.user);
    const { slug } = request.params as { slug: string };
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, slug))
      .limit(1);
    if (!community) throw Errors.notFound("Community");
    await db
      .insert(memberships)
      .values({ userId: user.id, communityId: community.id, role: "member" })
      .onConflictDoNothing();
    await bumpQuest(user.id, "join_community");
    return { ok: true };
  });

  app.post("/api/communities/join-many", async (request) => {
    const user = requireUser(request.user);
    const body = (request.body ?? {}) as { slugs?: string[] };
    const slugs = Array.isArray(body.slugs) ? body.slugs : [];
    const list = await db.select().from(communities);
    for (const slug of slugs) {
      const community = list.find((c) => c.slug === slug);
      if (!community) continue;
      await db
        .insert(memberships)
        .values({ userId: user.id, communityId: community.id, role: "member" })
        .onConflictDoNothing();
    }
    if (slugs.length) await bumpQuest(user.id, "join_community");
    return { ok: true };
  });
}
