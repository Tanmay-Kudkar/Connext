import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

export const institutions = pgTable("institutions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  short: text("short").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  domain: text("domain").notNull().unique(),
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  displayName: text("display_name").notNull(),
  initials: text("initials").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  institutionId: text("institution_id")
    .notNull()
    .references(() => institutions.id),
  mode: text("mode").notNull().default("vibe"),
  accent: text("accent").notNull().default("#FF4B2B"),
  avatarPack: text("avatar_pack").notNull().default("initials"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  bio: text("bio"),
  skills: text("skills").array().notNull().default([]),
  interests: text("interests").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const communities = pgTable("communities", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  syllabusTag: text("syllabus_tag"),
  category: text("category").notNull(),
  visibility: text("visibility").notNull().default("public"),
});

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
  communityId: text("community_id")
    .notNull()
    .references(() => communities.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
});

export const memberships = pgTable(
  "memberships",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    communityId: text("community_id")
      .notNull()
      .references(() => communities.id),
    role: text("role").notNull().default("member"),
  },
  (t) => [primaryKey({ columns: [t.userId, t.communityId] })],
);

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    channelId: text("channel_id")
      .notNull()
      .references(() => channels.id),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
    anon: boolean("anon").notNull().default(true),
    title: text("title").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("open"),
    syllabusUnitId: text("syllabus_unit_id"),
    tags: text("tags").array().notNull().default([]),
    embedding: vector("embedding", { dimensions: 768 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("posts_channel_created_idx").on(t.channelId, t.createdAt),
  ],
);

export const comments = pgTable(
  "comments",
  {
    id: text("id").primaryKey(),
    postId: text("post_id")
      .notNull()
      .references(() => posts.id),
    parentId: text("parent_id"),
    path: text("path").notNull(),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
    anon: boolean("anon").notNull().default(false),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("comments_post_path_idx").on(t.postId, t.path)],
);

export const votes = pgTable(
  "votes",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    value: integer("value").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.targetType, t.targetId] })],
);

export const creditEvents = pgTable(
  "credit_events",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    type: text("type").notNull(),
    commentId: text("comment_id")
      .notNull()
      .references(() => comments.id),
    confirmerId: text("confirmer_id")
      .notNull()
      .references(() => users.id),
    weight: integer("weight").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("credit_events_comment_type_idx").on(t.commentId, t.type),
    index("credit_events_user_created_idx").on(t.userId, t.createdAt),
  ],
);

export const creditLedger = pgTable("credit_ledger", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id),
  balance: integer("balance").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streakDays: integer("streak_days").notNull().default(0),
  lastActive: timestamp("last_active", { withTimezone: true }),
});

export const quests = pgTable("quests", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  target: integer("target").notNull(),
  xpReward: integer("xp_reward").notNull(),
  icon: text("icon").notNull(),
  kind: text("kind").notNull(),
});

export const userQuests = pgTable(
  "user_quests",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    questId: text("quest_id")
      .notNull()
      .references(() => quests.id),
    progress: integer("progress").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questId] })],
);

export const badges = pgTable("badges", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
});

export const userBadges = pgTable(
  "user_badges",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    badgeId: text("badge_id")
      .notNull()
      .references(() => badges.id),
    earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  reporterId: text("reporter_id")
    .notNull()
    .references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mockLinks = pgTable(
  "mock_links",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    provider: text("provider").notNull(),
    payload: jsonb("payload").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.provider] })],
);

export type User = typeof users.$inferSelect;
export type Institution = typeof institutions.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Community = typeof communities.$inferSelect;
export type Channel = typeof channels.$inferSelect;
