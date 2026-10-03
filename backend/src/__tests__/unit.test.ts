import { describe, expect, it } from "vitest";
import { publicAuthor, assertNoAuthorLeak } from "../serializers.js";
import { hashEmbed } from "../services/embeddings.js";
import { xpToLevel, UNBLOCK_WEIGHT } from "../services/credits.js";
import { Errors, ConnextError } from "../errors.js";
import type { Institution, User } from "../db/schema.js";

const user = {
  id: "u1",
  handle: "tanmay.kudkar",
  displayName: "Tanmay Kudkar",
  initials: "TK",
  email: "tanmay@xie.edu.in",
  role: "student",
  institutionId: "i1",
  mode: "vibe",
  accent: "#FF4B2B",
  avatarPack: "initials",
  verifiedAt: new Date(),
  bio: "",
  skills: [],
  interests: [],
  createdAt: new Date(),
} as User;

const inst = {
  id: "i1",
  name: "Xavier Institute of Engineering",
  short: "XIE",
  city: "Mumbai",
  state: "Maharashtra",
  domain: "xie.edu.in",
} as Institution;

describe("anonymity serializer", () => {
  it("strips identity from anonymous authors", () => {
    const a = publicAuthor(user, inst, true);
    expect(a.anon).toBe(true);
    expect(a.displayName).toBe("Verified student");
    expect(JSON.stringify(a)).not.toContain("tanmay");
    expect(JSON.stringify(a)).not.toContain("XIE");
    expect(JSON.stringify(a)).not.toContain("u1");
  });

  it("shows college only when not anonymous", () => {
    const a = publicAuthor(user, inst, false);
    expect(a.anon).toBe(false);
    if (!a.anon) {
      expect(a.institution?.short).toBe("XIE");
      expect(a.handle).toBe("tanmay.kudkar");
    }
  });

  it("fails closed if author_id leaks into a payload", () => {
    expect(() => assertNoAuthorLeak({ id: "p1", authorId: "u1" })).toThrow(/authorId/);
    expect(() => assertNoAuthorLeak({ id: "p1", author: { displayName: "Verified student" } })).not.toThrow();
  });
});

describe("credits math", () => {
  it("maps xp to levels", () => {
    expect(xpToLevel(0)).toBe(1);
    expect(xpToLevel(199)).toBe(1);
    expect(xpToLevel(200)).toBe(2);
    expect(xpToLevel(8400)).toBeGreaterThan(6);
  });

  it("self-confirm is named 403", () => {
    const err = Errors.selfConfirm();
    expect(err).toBeInstanceOf(ConnextError);
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe("SelfConfirmError");
  });

  it("already awarded is 409", () => {
    expect(Errors.alreadyAwarded().statusCode).toBe(409);
    expect(UNBLOCK_WEIGHT).toBe(35);
  });
});

describe("unique violation mapping", () => {
  it("reads 23505 through drizzle-style cause wrappers", async () => {
    const { isUniqueViolation } = await import("../errors.js");
    expect(isUniqueViolation({ code: "23505" })).toBe(true);
    expect(isUniqueViolation({ cause: { code: "23505" } })).toBe(true);
    expect(isUniqueViolation(new Error("nope"))).toBe(false);
  });
});

describe("mock embeddings", () => {
  it("returns pinned 768 dimensions", () => {
    const v = hashEmbed("postgres index seq scan");
    expect(v).toHaveLength(768);
  });

  it("similar titles are closer than unrelated ones", () => {
    const a = hashEmbed("Why does Postgres seq scan with an index on email");
    const b = hashEmbed("PostgreSQL ignores my btree index and seq scans");
    const c = hashEmbed("codeforces segment tree lazy propagation");
    const dot = (x: number[], y: number[]) => x.reduce((s, n, i) => s + n * y[i], 0);
    expect(dot(a, b)).toBeGreaterThan(dot(a, c));
  });
});
