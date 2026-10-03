import type { Institution, User } from "./db/schema.js";

export type PublicAuthor =
  | {
      anon: true;
      displayName: "Verified student";
      initials: "?";
      handle: null;
      id: null;
      institution: null;
      role: null;
    }
  | {
      anon: false;
      id: string;
      handle: string;
      displayName: string;
      initials: string;
      role: string;
      institution: { short: string; name: string; city?: string } | null;
    };

export function publicAuthor(
  user: User | null,
  institution: Institution | null,
  anon: boolean,
): PublicAuthor {
  if (anon || !user) {
    return {
      anon: true,
      displayName: "Verified student",
      initials: "?",
      handle: null,
      id: null,
      institution: null,
      role: null,
    };
  }
  return {
    anon: false,
    id: user.id,
    handle: user.handle,
    displayName: user.displayName,
    initials: user.initials,
    role: user.role,
    institution: institution
      ? { short: institution.short, name: institution.name, city: institution.city }
      : null,
  };
}

export function assertNoAuthorLeak(payload: unknown, path = "$"): void {
  if (payload === null || payload === undefined) return;
  if (Array.isArray(payload)) {
    payload.forEach((item, i) => assertNoAuthorLeak(item, `${path}[${i}]`));
    return;
  }
  if (typeof payload !== "object") return;
  for (const [key, value] of Object.entries(payload)) {
    const lower = key.toLowerCase();
    if (lower === "authorid" || lower === "author_id") {
      throw new Error(`Anonymity leak: ${path}.${key}`);
    }
    assertNoAuthorLeak(value, `${path}.${key}`);
  }
}

export function publicUser(user: User, institution: Institution | null) {
  return {
    id: user.id,
    handle: user.handle,
    displayName: user.displayName,
    initials: user.initials,
    role: user.role,
    mode: user.mode,
    accent: user.accent,
    avatarPack: user.avatarPack,
    bio: user.bio,
    skills: user.skills,
    interests: user.interests,
    institution: institution
      ? {
          id: institution.id,
          name: institution.name,
          short: institution.short,
          city: institution.city,
          state: institution.state,
        }
      : null,
  };
}
