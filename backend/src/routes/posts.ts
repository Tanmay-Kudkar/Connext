import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import {
  channels,
  comments,
  communities,
  institutions,
  memberships,
  posts,
  creditEvents,
  reports,
  users,
  votes,
} from "../db/schema.js";
import { Errors } from "../errors.js";
import { requireUser } from "../plugins/auth.js";
import { publicAuthor } from "../serializers.js";
import { awardUnblock, bumpQuest } from "../services/credits.js";
import { embedText, toVectorLiteral } from "../services/embeddings.js";

const COMMENT_DEPTH_CAP = 4;

async function loadUserMap(ids: string[]) {
  if (ids.length === 0) return { userMap: new Map(), instMap: new Map() };
  const uniq = [...new Set(ids)];
  const rows = await db.select().from(users).where(inArray(users.id, uniq));
  const instIds = [...new Set(rows.map((r) => r.institutionId))];
  const insts = await db.select().from(institutions).where(inArray(institutions.id, instIds));
  return {
    userMap: new Map(rows.map((u) => [u.id, u])),
    instMap: new Map(insts.map((i) => [i.id, i])),
  };
}

function serializePost(
  post: typeof posts.$inferSelect,
  viewerId: string | null,
  userMap: Map<string, typeof users.$inferSelect>,
  instMap: Map<string, typeof institutions.$inferSelect>,
  extras: { upvotes: number; commentCount: number; credits: number; communitySlug?: string; channelType?: string },
) {
  const author = userMap.get(post.authorId) ?? null;
  const inst = author ? instMap.get(author.institutionId) ?? null : null;
  return {
    id: post.id,
    channelId: post.channelId,
    communitySlug: extras.communitySlug,
    channelType: extras.channelType,
    title: post.title,
    body: post.body,
    status: post.status,
    anon: post.anon,
    tags: post.tags,
    createdAt: post.createdAt,
    upvotes: extras.upvotes,
    commentCount: extras.commentCount,
    credits: extras.credits,
    isOwner: viewerId === post.authorId,
    author: publicAuthor(author, inst, post.anon),
  };
}

function serializeComment(
  comment: typeof comments.$inferSelect,
  viewerId: string | null,
  postAuthorId: string,
  userMap: Map<string, typeof users.$inferSelect>,
  instMap: Map<string, typeof institutions.$inferSelect>,
  extras: { upvotes: number; awarded: boolean },
) {
  const author = userMap.get(comment.authorId) ?? null;
  const inst = author ? instMap.get(author.institutionId) ?? null : null;
  const depth = comment.path.split("/").filter(Boolean).length;
  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId,
    path: comment.path,
    depth,
    body: comment.body,
    anon: comment.anon,
    createdAt: comment.createdAt,
    upvotes: extras.upvotes,
    awarded: extras.awarded,
    isOwner: viewerId === comment.authorId,
    canUnblock: viewerId === postAuthorId && viewerId !== comment.authorId && !extras.awarded,
    author: publicAuthor(author, inst, comment.anon),
  };
}

export async function postRoutes(app: FastifyInstance) {
  app.get("/api/feed", async (request) => {
    const user = request.user;
    let channelIds: string[] = [];
    if (user) {
      const joined = await db
        .select()
        .from(memberships)
        .where(eq(memberships.userId, user.id));
      if (joined.length) {
        const chans = await db
          .select()
          .from(channels)
          .where(
            inArray(
              channels.communityId,
              joined.map((j) => j.communityId),
            ),
          );
        channelIds = chans.map((c) => c.id);
      }
    }
    const feed = channelIds.length
      ? await db
          .select()
          .from(posts)
          .where(inArray(posts.channelId, channelIds))
          .orderBy(desc(posts.createdAt))
          .limit(50)
      : await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(50);

    return { posts: await decoratePosts(feed, user?.id ?? null) };
  });

  app.get("/api/posts/:id", async (request) => {
    const { id } = request.params as { id: string };
    const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!post) throw Errors.postNotFound();
    const [decorated] = await decoratePosts([post], request.user?.id ?? null);
    const thread = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, id))
      .orderBy(comments.path);
    const { userMap, instMap } = await loadUserMap(thread.map((c) => c.authorId));
    const voteRows = thread.length
      ? await db
          .select({
            targetId: votes.targetId,
            n: sql<number>`count(*)::int`,
          })
          .from(votes)
          .where(and(eq(votes.targetType, "comment"), inArray(votes.targetId, thread.map((c) => c.id))))
          .groupBy(votes.targetId)
      : [];
    const awarded = thread.length
      ? await db
          .select({ commentId: creditEvents.commentId })
          .from(creditEvents)
          .where(
            and(
              inArray(
                creditEvents.commentId,
                thread.map((c) => c.id),
              ),
              eq(creditEvents.type, "this_unblocked_me"),
            ),
          )
      : [];
    const awardedSet = new Set(awarded.map((r) => r.commentId));
    const voteMap = new Map(voteRows.map((v) => [v.targetId, v.n]));
    const serialized = thread.map((c) =>
      serializeComment(c, request.user?.id ?? null, post.authorId, userMap, instMap, {
        upvotes: voteMap.get(c.id) ?? 0,
        awarded: awardedSet.has(c.id),
      }),
    );
    return {
      post: decorated,
      comments: nestComments(serialized),
      depthCap: COMMENT_DEPTH_CAP,
    };
  });

  app.post("/api/posts", async (request) => {
    const user = requireUser(request.user);
    const body = z
      .object({
        communitySlug: z.string(),
        title: z.string().min(8).max(200),
        body: z.string().max(8000).optional().default(""),
        tags: z.array(z.string()).optional().default([]),
        anon: z.boolean().optional().default(true),
        channelType: z.enum(["qa", "projects", "announce", "chat"]).optional().default("qa"),
      })
      .parse(request.body);
    const [community] = await db
      .select()
      .from(communities)
      .where(eq(communities.slug, body.communitySlug))
      .limit(1);
    if (!community) throw Errors.notFound("Community");
    const [channel] = await db
      .select()
      .from(channels)
      .where(and(eq(channels.communityId, community.id), eq(channels.type, body.channelType)))
      .limit(1);
    if (!channel) throw Errors.notFound("Channel");
    const id = randomUUID();
    let embedding: number[] | null = null;
    try {
      embedding = (await embedText(`${body.title}\n${body.body}`)).vector;
    } catch (err) {
      request.log.warn({ err, requestId: request.id }, "embed_on_create_failed");
    }
    await db.insert(posts).values({
      id,
      channelId: channel.id,
      authorId: user.id,
      anon: body.anon,
      title: body.title,
      body: body.body ?? "",
      tags: body.tags,
      embedding: embedding ? sql`${toVectorLiteral(embedding)}::vector` : null,
    });
    await bumpQuest(user.id, "ask_or_answer");
    const [created] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    const [decorated] = await decoratePosts([created], user.id);
    return { post: decorated };
  });

  app.post("/api/posts/:id/reveal", async (request) => {
    const user = requireUser(request.user);
    const { id } = request.params as { id: string };
    const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!post) throw Errors.postNotFound();
    if (post.authorId !== user.id) throw Errors.forbidden("Only the author can reveal");
    await db.update(posts).set({ anon: false }).where(eq(posts.id, id));
    const [next] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    const [decorated] = await decoratePosts([next], user.id);
    return { post: decorated };
  });

  app.post("/api/posts/:id/upvote", async (request) => {
    const user = requireUser(request.user);
    const { id } = request.params as { id: string };
    const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!post) throw Errors.postNotFound();
    await db
      .insert(votes)
      .values({ userId: user.id, targetType: "post", targetId: id, value: 1 })
      .onConflictDoNothing();
    return { ok: true };
  });

  app.post("/api/posts/:id/comments", async (request) => {
    const user = requireUser(request.user);
    const { id } = request.params as { id: string };
    const body = z
      .object({
        body: z.string().min(1).max(8000),
        parentId: z.string().nullable().optional(),
        anon: z.boolean().optional().default(false),
      })
      .parse(request.body);
    const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!post) throw Errors.postNotFound();
    let path: string;
    let parentId: string | null = body.parentId ?? null;
    if (parentId) {
      const [parent] = await db.select().from(comments).where(eq(comments.id, parentId)).limit(1);
      if (!parent || parent.postId !== id) throw Errors.commentNotFound();
      const depth = parent.path.split("/").filter(Boolean).length;
      if (depth >= COMMENT_DEPTH_CAP) {
        throw Errors.validation("Continue this thread from a shallower reply");
      }
      const cid = randomUUID();
      path = `${parent.path}${cid}/`;
      await db.insert(comments).values({
        id: cid,
        postId: id,
        parentId,
        path,
        authorId: user.id,
        anon: body.anon,
        body: body.body,
      });
      await bumpQuest(user.id, "ask_or_answer");
      const [created] = await db.select().from(comments).where(eq(comments.id, cid)).limit(1);
      const { userMap, instMap } = await loadUserMap([user.id]);
      return {
        comment: serializeComment(created, user.id, post.authorId, userMap, instMap, {
          upvotes: 0,
          awarded: false,
        }),
      };
    }
    const cid = randomUUID();
    path = `${cid}/`;
    await db.insert(comments).values({
      id: cid,
      postId: id,
      parentId: null,
      path,
      authorId: user.id,
      anon: body.anon,
      body: body.body,
    });
    await bumpQuest(user.id, "ask_or_answer");
    const [created] = await db.select().from(comments).where(eq(comments.id, cid)).limit(1);
    const { userMap, instMap } = await loadUserMap([user.id]);
    return {
      comment: serializeComment(created, user.id, post.authorId, userMap, instMap, {
        upvotes: 0,
        awarded: false,
      }),
    };
  });

  app.post("/api/comments/:id/upvote", async (request) => {
    const user = requireUser(request.user);
    const { id } = request.params as { id: string };
    const [comment] = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
    if (!comment) throw Errors.commentNotFound();
    await db
      .insert(votes)
      .values({ userId: user.id, targetType: "comment", targetId: id, value: 1 })
      .onConflictDoNothing();
    return { ok: true };
  });

  app.post("/api/comments/:id/unblock", async (request) => {
    const user = requireUser(request.user);
    const { id } = request.params as { id: string };
    const [comment] = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
    if (!comment) throw Errors.commentNotFound();
    const [post] = await db.select().from(posts).where(eq(posts.id, comment.postId)).limit(1);
    if (!post) throw Errors.postNotFound();
    if (comment.authorId === user.id) throw Errors.selfConfirm();
    if (post.authorId !== user.id) throw Errors.forbidden("Only the asker can confirm an unblock");
    const result = await awardUnblock({
      helperId: comment.authorId,
      confirmerId: user.id,
      commentId: comment.id,
      eventId: randomUUID(),
    });
    await db.update(posts).set({ status: "resolved" }).where(eq(posts.id, post.id));
    return { ok: true, weight: result.weight };
  });

  app.post("/api/reports", async (request) => {
    const user = requireUser(request.user);
    const body = z
      .object({
        targetType: z.enum(["post", "comment", "user"]),
        targetId: z.string(),
        reason: z.string().min(4).max(500),
      })
      .parse(request.body);
    await db.insert(reports).values({
      id: randomUUID(),
      reporterId: user.id,
      targetType: body.targetType,
      targetId: body.targetId,
      reason: body.reason,
    });
    return { ok: true };
  });
}

export async function decoratePosts(feed: (typeof posts.$inferSelect)[], viewerId: string | null) {
  if (feed.length === 0) return [];
  const { userMap, instMap } = await loadUserMap(feed.map((p) => p.authorId));
  const ids = feed.map((p) => p.id);
  const channelIds = [...new Set(feed.map((p) => p.channelId))];
  const chans = await db.select().from(channels).where(inArray(channels.id, channelIds));
  const comms = await db
    .select()
    .from(communities)
    .where(inArray(communities.id, chans.map((c) => c.communityId)));
  const chanMap = new Map(chans.map((c) => [c.id, c]));
  const commMap = new Map(comms.map((c) => [c.id, c]));
  const voteRows = await db
    .select({
      targetId: votes.targetId,
      n: sql<number>`count(*)::int`,
    })
    .from(votes)
    .where(and(eq(votes.targetType, "post"), inArray(votes.targetId, ids)))
    .groupBy(votes.targetId);
  const commentCounts = await db
    .select({
      postId: comments.postId,
      n: sql<number>`count(*)::int`,
    })
    .from(comments)
    .where(inArray(comments.postId, ids))
    .groupBy(comments.postId);
  const creditCounts = await db
    .select({
      postId: comments.postId,
      credits: sql<number>`COALESCE(SUM(${creditEvents.weight}), 0)::int`,
    })
    .from(comments)
    .leftJoin(creditEvents, eq(creditEvents.commentId, comments.id))
    .where(inArray(comments.postId, ids))
    .groupBy(comments.postId);
  const creditMap = new Map(creditCounts.map((r) => [r.postId, Number(r.credits)]));
  const voteMap = new Map(voteRows.map((v) => [v.targetId, v.n]));
  const commentMap = new Map(commentCounts.map((c) => [c.postId, c.n]));
  return feed.map((p) => {
    const ch = chanMap.get(p.channelId);
    const comm = ch ? commMap.get(ch.communityId) : undefined;
    return serializePost(p, viewerId, userMap, instMap, {
      upvotes: voteMap.get(p.id) ?? 0,
      commentCount: commentMap.get(p.id) ?? 0,
      credits: creditMap.get(p.id) ?? 0,
      communitySlug: comm?.slug,
      channelType: ch?.type,
    });
  });
}

type FlatComment = ReturnType<typeof serializeComment> & { children?: FlatComment[]; truncated?: boolean };

function nestComments(list: ReturnType<typeof serializeComment>[]): FlatComment[] {
  const byId = new Map<string, FlatComment>();
  for (const c of list) byId.set(c.id, { ...c, children: [] });
  const roots: FlatComment[] = [];
  for (const c of byId.values()) {
    if (!c.parentId) {
      roots.push(c);
      continue;
    }
    const parent = byId.get(c.parentId);
    if (!parent) {
      roots.push(c);
      continue;
    }
    if (c.depth > COMMENT_DEPTH_CAP) {
      parent.truncated = true;
      continue;
    }
    parent.children = parent.children ?? [];
    parent.children.push(c);
  }
  return roots;
}
