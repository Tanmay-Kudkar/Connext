import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  getOAuthUrl,
  exchangeCodeForToken,
  getGitHubUser,
  listIssues,
  getIssue,
  createIssue,
  addIssueComment,
  reactToIssue,
  listDiscussions,
  listLabels,
  fetchRepoStats,
} from "../services/github.js";
import { env } from "../env.js";
import { db } from "../db/index.js";
import { users, institutions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { signSession, setSessionCookie, requireUser } from "../plugins/auth.js";
import { publicUser } from "../serializers.js";

// In-memory state store (replace with Redis in production)
const oauthStates = new Map<string, number>();

export async function githubRoutes(app: FastifyInstance) {

  // ─── OAuth: Redirect to GitHub ──────────────────────────────────────────────
  app.get("/api/auth/github", async (_req, reply) => {
    if (!env.GITHUB_CLIENT_ID) {
      return reply.status(503).send({ error: "GitHub OAuth not configured" });
    }
    const state = randomUUID();
    oauthStates.set(state, Date.now() + 10 * 60_000);
    return reply.redirect(getOAuthUrl(state));
  });

  // ─── OAuth: GitHub callback ──────────────────────────────────────────────────
  app.get("/api/auth/github/callback", async (request, reply) => {
    const { code, state } = z
      .object({ code: z.string(), state: z.string() })
      .parse(request.query);

    const expiry = oauthStates.get(state);
    if (!expiry || Date.now() > expiry) {
      return reply.redirect(`${env.GITHUB_CALLBACK_URL.replace("/api/auth/github/callback", "")}/login?error=invalid_state`);
    }
    oauthStates.delete(state);

    let ghToken: string;
    let ghUser: any;
    try {
      ghToken = await exchangeCodeForToken(code);
      ghUser  = await getGitHubUser(ghToken);
    } catch (e: any) {
      return reply.redirect(`http://localhost:3000/login?error=${encodeURIComponent(e.message)}`);
    }

    // Find or create user
    const email = ghUser.primaryEmail ?? `${ghUser.login}@github.noreply`;
    let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      const [inst] = await db.select().from(institutions).limit(1);
      const id = randomUUID();
      const handle = ghUser.login.toLowerCase().replace(/[^a-z0-9.]/g, "").slice(0, 40) || id.slice(0, 8);
      await db.insert(users).values({
        id,
        handle,
        displayName: ghUser.name ?? ghUser.login,
        initials:    (ghUser.name ?? ghUser.login).slice(0, 2).toUpperCase(),
        email,
        role:        "student",
        institutionId: inst?.id ?? "i1",
      });
      [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    }

    // Store GitHub token in session cookie alongside session
    const token = await signSession(user.id);
    setSessionCookie(reply, token);

    // Store gh token in a separate cookie for API calls on behalf of user
    reply.setCookie("gh_token", ghToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return reply.redirect("http://localhost:3000/passport");
  });

  // ─── Community: Repo stats ───────────────────────────────────────────────────
  app.get("/api/community/stats", async () => {
    return fetchRepoStats();
  });

  // ─── Community: Labels / Categories ─────────────────────────────────────────
  app.get("/api/community/labels", async () => {
    return listLabels();
  });

  // ─── Community: Questions (Issues) ──────────────────────────────────────────
  app.get("/api/community/questions", async (request) => {
    const { label, state, page } = z
      .object({
        label: z.string().optional(),
        state: z.enum(["open", "closed", "all"]).optional(),
        page:  z.coerce.number().optional(),
      })
      .parse(request.query);
    return listIssues({ label, state: state as any, page });
  });

  app.get("/api/community/questions/:number", async (request) => {
    const { number } = z
      .object({ number: z.coerce.number() })
      .parse(request.params);
    return getIssue(number);
  });

  app.post("/api/community/questions", async (request, reply) => {
    const user = requireUser(request.user);
    const ghToken = (request.cookies as any).gh_token;
    if (!ghToken) return reply.status(401).send({ error: "GitHub login required to post" });

    const { title, body, labels } = z
      .object({
        title:  z.string().min(5).max(200),
        body:   z.string().min(10).max(10000),
        labels: z.array(z.string()).optional().default([]),
      })
      .parse(request.body);

    return createIssue(title, body, labels, ghToken);
  });

  // ─── Community: Comments ────────────────────────────────────────────────────
  app.post("/api/community/questions/:number/comments", async (request, reply) => {
    requireUser(request.user);
    const ghToken = (request.cookies as any).gh_token;
    if (!ghToken) return reply.status(401).send({ error: "GitHub login required to comment" });

    const { number } = z.object({ number: z.coerce.number() }).parse(request.params);
    const { body }   = z.object({ body: z.string().min(1).max(5000) }).parse(request.body);

    return addIssueComment(number, body, ghToken);
  });

  // ─── Community: Reactions / Votes ───────────────────────────────────────────
  app.post("/api/community/questions/:number/react", async (request, reply) => {
    requireUser(request.user);
    const ghToken = (request.cookies as any).gh_token;
    if (!ghToken) return reply.status(401).send({ error: "GitHub login required to react" });

    const { number }  = z.object({ number: z.coerce.number() }).parse(request.params);
    const { content } = z
      .object({ content: z.enum(["+1", "-1", "heart", "hooray", "confused", "rocket", "eyes"]) })
      .parse(request.body);

    return reactToIssue(number, content, ghToken);
  });

  // ─── Community: Discussions ──────────────────────────────────────────────────
  app.get("/api/community/discussions", async () => {
    return listDiscussions();
  });
}
