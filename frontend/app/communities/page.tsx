"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ListState } from "@/components/shell/ListState";
import { clientApi } from "@/lib/api";
import type { Community } from "@/lib/types";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await clientApi<{ communities: Community[] }>("/api/communities");
      setCommunities(d.communities);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load communities");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h1 className="text-display">Communities</h1>
      <p className="mt-2 text-muted">Syllabus rooms and project guilds across campuses.</p>
      <div className="mt-6">
        <ListState
          loading={loading}
          error={error}
          empty={communities.length === 0}
          emptyCopy="No rooms yet. Come back after the first syllabus is imported."
          onRetry={() => void load()}
        >
          <ul>
            {communities.map((c) => (
              <li key={c.id} className="post-row">
                <Link href={`/c/${c.slug}`} className="block">
                  <div className="font-semibold">{c.name}</div>
                  <p className="mt-1 text-small text-muted">{c.description}</p>
                  <p className="mt-2 text-small text-muted">
                    {c.memberCount ?? 0} members · {c.postCount ?? 0} posts
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </ListState>
      </div>
    </div>
  );
}
