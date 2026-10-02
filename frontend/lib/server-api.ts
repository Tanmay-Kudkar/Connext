import { cookies } from "next/headers";
import type { PublicUser } from "./types";

export const API_INTERNAL = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001";

type ApiError = { error?: string; message?: string };

export async function serverApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const cookie = cookies().toString();
  const res = await fetch(`${API_INTERNAL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(init.headers ?? {}),
      cookie,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as ApiError;
    throw new Error(body.message ?? body.error ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function getMe(): Promise<PublicUser | null> {
  const cookie = cookies().toString();
  if (!cookie) return null;
  const res = await fetch(`${API_INTERNAL}/api/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { user: PublicUser };
  return json.user;
}
