import type { FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { db } from "../db/index.js";
import { institutions, users, type Institution, type User } from "../db/schema.js";
import { env, isProd } from "../env.js";
import { Errors } from "../errors.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function signSession(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secret);
}

export async function readSession(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    institution: Institution | null;
  }
}

export default fp(async (app) => {
  app.decorateRequest("user", null);
  app.decorateRequest("institution", null);

  app.addHook("preHandler", async (request) => {
    const token =
      request.cookies[env.COOKIE_NAME] ??
      request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) {
      request.user = null;
      request.institution = null;
      return;
    }
    const userId = await readSession(token);
    if (!userId) {
      request.user = null;
      request.institution = null;
      return;
    }
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!row) {
      request.user = null;
      request.institution = null;
      return;
    }
    const [inst] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, row.institutionId))
      .limit(1);
    request.user = row;
    request.institution = inst ?? null;
  });
});

export function requireUser(user: User | null): User {
  if (!user) throw Errors.unauthenticated();
  return user;
}

export function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: isProd,
    maxAge: 14 * 24 * 60 * 60,
  });
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(env.COOKIE_NAME, { path: "/" });
}
