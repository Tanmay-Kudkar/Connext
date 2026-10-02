"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/api";
import type { Community, FeedPost } from "@/lib/types";

export default function AskPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communitySlug, setCommunitySlug] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [anon, setAnon] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [similar, setSimilar] = useState<FeedPost[]>([]);
  const [similarBanner, setSimilarBanner] = useState("");

  useEffect(() => {
    clientApi<{ communities: Community[] }>("/api/communities")
      .then((d) => {
        setCommunities(d.communities);
        if (d.communities[0]) setCommunitySlug(d.communities[0].slug);
      })
      .catch(() => setError("Could not load communities"));
  }, []);

  useEffect(() => {
    if (title.trim().length < 3) {
      setSimilar([]);
      setSimilarBanner("");
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/ai/similar-questions", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ title, body }),
          signal: controller.signal,
        });
        const json = (await res.json()) as {
          unavailable?: boolean;
          message?: string;
          results?: FeedPost[];
        };
        if (json.unavailable) {
          setSimilarBanner(json.message ?? "Couldn't check similar threads. You can still post.");
          setSimilar([]);
        } else {
          setSimilarBanner("");
          setSimilar(json.results ?? []);
        }
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        setSimilarBanner("Couldn't check similar threads. You can still post.");
      }
    }, 400);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [title, body]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await clientApi<{ post: FeedPost }>("/api/posts", {
        method: "POST",
        body: JSON.stringify({ communitySlug, title, body, anon, tags: [] }),
      });
      router.push(`/post/${res.post.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-display">Ask a question</h1>
        <p className="mt-2 text-small text-muted">
          Verified, but you can post anonymously. Similar threads appear as you type.
        </p>
      </header>
      <form className="space-y-4" onSubmit={submit}>
        <label className="block text-small font-semibold" htmlFor="community">
          Community
        </label>
        <select
          id="community"
          className="input-base"
          value={communitySlug}
          onChange={(e) => setCommunitySlug(e.target.value)}
          required
        >
          {communities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <label className="block text-small font-semibold" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className="input-base"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          minLength={8}
          required
          placeholder="Why does Postgres seq-scan my indexed email column?"
        />
        <label className="block text-small font-semibold" htmlFor="body">
          Details
        </label>
        <textarea
          id="body"
          className="input-base min-h-[140px]"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What you already tried."
        />
        <label className="flex items-center gap-2 text-small">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
          Post anonymously
        </label>
        {similarBanner && (
          <p className="text-small" role="status" style={{ color: "var(--warning)" }}>
            {similarBanner}
          </p>
        )}
        {similar.length > 0 && (
          <div>
            <div className="text-small font-semibold">Similar threads</div>
            <ul className="mt-2 space-y-2">
              {similar.map((p) => (
                <li key={p.id}>
                  <Link href={`/post/${p.id}`} className="text-small hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && (
          <p className="text-small" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}
        <button className="btn-primary" type="submit" disabled={busy}>
          Post question
        </button>
      </form>
    </div>
  );
}
