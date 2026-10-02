"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clientApi } from "@/lib/api";
import type { Community } from "@/lib/types";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    clientApi<{ communities: Community[] }>("/api/communities").then((d) => setCommunities(d.communities));
  }, []);

  return (
    <div>
      <h1 className="text-display">Communities</h1>
      <p className="mt-2 text-muted">Syllabus rooms and project guilds across campuses.</p>
      <ul className="mt-6">
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
    </div>
  );
}
