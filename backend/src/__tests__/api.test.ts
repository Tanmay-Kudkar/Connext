import { afterAll, beforeAll, describe, expect, it } from "vitest";
import pg from "pg";
import { buildApp } from "../app.js";
import { pool } from "../db/index.js";
import { migrate } from "../db/migrate.js";
import { seed } from "../db/seed.js";

const DATABASE_URL = process.env.DATABASE_URL ?? "postgres://connext:connext@localhost:5432/connext";

describe("api integration", () => {
  let app: Awaited<ReturnType<typeof buildApp>>;

  beforeAll(async () => {
    process.env.DATABASE_URL = DATABASE_URL;
    process.env.EMBEDDING_BASE_URL = "mock";
    process.env.DEMO_LOGINS = "true";
    const client = new pg.Client({ connectionString: DATABASE_URL });
    await client.connect();
    await migrate(client);
    await client.end();
    await seed();
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
    await pool.end();
  });

  it("rejects non-college email", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/request-otp",
      payload: { email: "someone@gmail.com" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe("CollegeEmailRejectedError");
  });

  it("logs in with mock OTP and sets cookie", async () => {
    await app.inject({
      method: "POST",
      url: "/api/auth/request-otp",
      payload: { email: "tanmay@xie.edu.in" },
    });
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/verify-otp",
      payload: { email: "tanmay@xie.edu.in", otp: "123456" },
    });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"]).toBeTruthy();
  });

  it("anonymous post JSON has no author_id", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "student" },
    });
    const cookie = (login.headers["set-cookie"] as string | string[]) ?? "";
    const res = await app.inject({
      method: "GET",
      url: "/api/posts/p1",
      headers: { cookie: Array.isArray(cookie) ? cookie.join("; ") : cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(JSON.stringify(body)).not.toMatch(/author_id|authorId/);
    expect(body.post.author.displayName).toBe("Verified student");
    expect(body.post.author.institution).toBeNull();
  });

  it("reveal by non-owner is 403", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "faculty" },
    });
    const cookie = (login.headers["set-cookie"] as string | string[]) ?? "";
    const res = await app.inject({
      method: "POST",
      url: "/api/posts/p1/reveal",
      headers: { cookie: Array.isArray(cookie) ? cookie.join("; ") : cookie },
    });
    expect(res.statusCode).toBe(403);
  });

  it("self-confirm is 403", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "faculty" },
    });
    const cookie = headerCookie(login.headers["set-cookie"]);
    const res = await app.inject({
      method: "POST",
      url: "/api/comments/cm1/unblock",
      headers: { cookie },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json().error).toBe("SelfConfirmError");
  });

  it("parallel unblock awards once", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "student" },
    });
    const cookie = headerCookie(login.headers["set-cookie"]);
    const created = await app.inject({
      method: "POST",
      url: "/api/posts",
      headers: { cookie },
      payload: {
        communitySlug: "dbms",
        title: "How do I force Postgres to use my email btree index?",
        body: "Still seeing seq scan",
        tags: ["PostgreSQL", "indexing"],
        anon: true,
      },
    });
    expect(created.statusCode).toBe(200);
    const postId = created.json().post.id;

    const faculty = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "faculty" },
    });
    const facCookie = headerCookie(faculty.headers["set-cookie"]);
    const reply = await app.inject({
      method: "POST",
      url: `/api/posts/${postId}/comments`,
      headers: { cookie: facCookie },
      payload: { body: "Run ANALYZE then EXPLAIN ANALYZE.", anon: false },
    });
    const commentId = reply.json().comment.id;

    const [a, b] = await Promise.all([
      app.inject({
        method: "POST",
        url: `/api/comments/${commentId}/unblock`,
        headers: { cookie },
      }),
      app.inject({
        method: "POST",
        url: `/api/comments/${commentId}/unblock`,
        headers: { cookie },
      }),
    ]);
    const codes = [a.statusCode, b.statusCode].sort();
    expect(codes).toEqual([200, 409]);
  });

  it("lists seeded communities", async () => {
    const res = await app.inject({ method: "GET", url: "/api/communities" });
    expect(res.statusCode).toBe(200);
    expect(res.json().communities.length).toBeGreaterThanOrEqual(8);
  });

  it("faculty doubt radar has no identities", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "faculty" },
    });
    const cookie = headerCookie(login.headers["set-cookie"]);
    const res = await app.inject({
      method: "GET",
      url: "/api/ai/doubt-radar",
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const text = JSON.stringify(res.json());
    expect(text).not.toMatch(/author_id|tanmay|priya.sharma/);
    expect(res.json().radar.length).toBeGreaterThan(0);
  });

  it("similar questions fail-open without author fields", async () => {
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/demo",
      payload: { as: "student" },
    });
    const cookie = headerCookie(login.headers["set-cookie"]);
    const res = await app.inject({
      method: "POST",
      url: "/api/ai/similar-questions",
      headers: { cookie },
      payload: { title: "Why does Postgres seq scan with an index on email" },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(JSON.stringify(body)).not.toMatch(/author_id|authorId/);
    expect(body.unavailable === true || body.results.length >= 0).toBe(true);
  });
});

function headerCookie(value: string | string[] | undefined) {
  if (!value) return "";
  return Array.isArray(value) ? value.join("; ") : value;
}
