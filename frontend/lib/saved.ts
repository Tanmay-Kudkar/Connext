const KEY = "connext-saved";

export function getSavedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isSaved(id: string) {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: string) {
  const next = new Set(getSavedIds());
  if (next.has(id)) next.delete(id);
  else next.add(id);
  window.localStorage.setItem(KEY, JSON.stringify(Array.from(next)));
  return next.has(id);
}

export async function copyPostLink(id: string) {
  const url = `${window.location.origin}/post/${id}`;
  await navigator.clipboard.writeText(url);
  return url;
}
