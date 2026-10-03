import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/index.js";
import { creditLedger, institutions, users } from "../db/schema.js";
import { env } from "../env.js";
import { Errors } from "../errors.js";
import {
  requireUser,
  setSessionCookie,
  clearSessionCookie,
  signSession,
} from "../plugins/auth.js";
import { publicUser } from "../serializers.js";

const DEMO_OTP = "123456";
const otpStore = new Map<string, { code: string; expires: number }>();
const otpHits = new Map<string, { n: number; start: number }>();

function rateLimit(email: string) {
  const now = Date.now();
  const row = otpHits.get(email);
  if (!row || now - row.start > 10 * 60_000) {
    otpHits.set(email, { n: 1, start: now });
    return;
  }
  row.n += 1;
  if (row.n > 8) throw Errors.forbidden("Too many OTP attempts. Try later.");
}

function domainOf(email: string) {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

async function isCollegeEmail(email: string) {
  const domain = domainOf(email);
  if (!domain) return false;
  if (domain.endsWith(".edu") || domain.endsWith(".ac.in") || domain.endsWith(".edu.in")) {
    return true;
  }
  const inst = await db.select().from(institutions);
  return inst.some((i) => domain === i.domain || domain.endsWith(`.${i.domain}`));
}

async function institutionForEmail(email: string) {
  const domain = domainOf(email);
  const inst = await db.select().from(institutions);
  const match = inst.find((i) => domain === i.domain || domain.endsWith(`.${i.domain}`));
  return match ?? inst[0];
}

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/request-otp", async (request) => {
    const body = z.object({ email: z.string().email() }).parse(request.body);
    const email = body.email.toLowerCase();
    if (!(await isCollegeEmail(email))) throw Errors.collegeEmailRejected();
    rateLimit(email);
    otpStore.set(email, { code: DEMO_OTP, expires: Date.now() + 10 * 60_000 });
    request.log.info({ email, requestId: request.id }, "otp_requested");
    return {
      message: `OTP sent to ${email} (demo: use ${DEMO_OTP})`,
      demoOtp: env.NODE_ENV === "production" ? undefined : DEMO_OTP,
    };
  });

  app.post("/api/auth/verify-otp", async (request, reply) => {
    const body = z
      .object({
        email: z.string().email(),
        otp: z.string().min(4),
        handle: z.string().min(2).max(40).optional(),
        displayName: z.string().min(2).max(80).optional(),
        mode: z.enum(["vibe", "pro"]).optional(),
        avatarPack: z.string().optional(),
      })
      .parse(request.body);
    const email = body.email.toLowerCase();
    rateLimit(email);
    const stored = otpStore.get(email);
    if (!stored) throw Errors.invalidOtp();
    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      throw Errors.otpExpired();
    }
    if (body.otp !== stored.code) throw Errors.invalidOtp();
    otpStore.delete(email);

    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user = existing[0];
    if (!user) {
      if (!body.handle || !body.displayName) {
        return { needsOnboarding: true, email };
      }
      const inst = await institutionForEmail(email);
      const id = randomUUID();
      await db.insert(users).values({
        id,
        handle: body.handle.replace(/^@/, "").toLowerCase(),
        displayName: body.displayName,
        initials: initialsFrom(body.displayName),
        email,
        role: "student",
        institutionId: inst.id,
        mode: body.mode ?? "vibe",
        avatarPack: body.avatarPack ?? "initials",
        verifiedAt: new Date(),
        skills: [],
        interests: [],
      });
      await db.insert(creditLedger).values({
        userId: id,
        balance: 0,
        xp: 0,
        level: 1,
        streakDays: 0,
      });
      const created = await db.select().from(users).where(eq(users.id, id)).limit(1);
      user = created[0];
    }

    const token = await signSession(user.id);
    setSessionCookie(reply, token);
    const [inst] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, user.institutionId))
      .limit(1);
    return { needsOnboarding: false, user: publicUser(user, inst ?? null) };
  });

  app.post("/api/auth/logout", async (_request, reply) => {
    clearSessionCookie(reply);
    return { ok: true };
  });

  app.get("/api/auth/me", async (request) => {
    const user = requireUser(request.user);
    return { user: publicUser(user, request.institution) };
  });

  app.post("/api/auth/demo", async (request, reply) => {
    if (!env.DEMO_LOGINS) throw Errors.forbidden("Demo logins disabled");
    const body = z.object({ as: z.enum(["student", "faculty"]) }).parse(request.body);
    const handle = body.as === "faculty" ? "priya.sharma" : "tanmay.kudkar";
    const [user] = await db.select().from(users).where(eq(users.handle, handle)).limit(1);
    if (!user) throw Errors.notFound("User");
    const token = await signSession(user.id);
    setSessionCookie(reply, token);
    const [inst] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, user.institutionId))
      .limit(1);
    return { user: publicUser(user, inst ?? null) };
  });
}
