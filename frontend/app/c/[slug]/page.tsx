"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostRow } from "@/components/feed/PostRow";
import { ListState } from "@/components/shell/ListState";
import { clientApi } from "@/lib/api";
import type { Community, FeedPost } from "@/lib/types";

export default function CommunityPage() {
  const params = useParams<{ slug: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [channel, setChannel] = useState("qa");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await clientApi<{ community: Community; posts: FeedPost[] }>(`/api/communities/${params.slug}`);
      setCommunity(d.community);
      setPosts(d.posts);
      setError("");
    } catch {
      setCommunity(null);
      setError("Community not found");
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function join() {
    await clientApi(`/api/communities/${params.slug}/join`, { method: "POST" });
    setCommunity((c) => (c ? { ...c, joined: true } : c));
  }

  if (loading && !community) return <ListState loading>{null}</ListState>;
  if (!community) {
    return (
      <ListState error={error || "Community not found"} onRetry={() => void load()}>
        {null}
      </ListState>
    );
  }

  const visible = posts.filter((p) => !channel || p.channelType === channel || !p.channelType);

  return (
    <div>
      <header className="mb-4">
        <p className="text-small text-muted">{community.category}</p>
        <h1 className="text-display">{community.name}</h1>
        <p className="mt-2 text-muted">{community.description}</p>
        <p className="mt-1 text-small text-muted">{community.memberCount ?? 0} members</p>
        {!community.joined && (
          <button type="button" className="btn-primary mt-3" onClick={() => void join()}>
            Join
          </button>
        )}
      </header>
      <div className="mb-4 hairline p-3 text-small" style={{ borderRadius: "var(--radius)" }}>
        <div className="font-semibold">Pinned rules</div>
        <p className="mt-1 text-muted">Be specific. No assignment dumps. Anonymous is for the question, not for abuse.</p>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(community.channels ?? []).map((ch) => (
          <button
            key={ch.id}
            type="button"
            className={`chip ${channel === ch.type ? "selected" : ""}`}
            onClick={() => setChannel(ch.type)}
          >
            {ch.name}
          </button>
        ))}
      </div>
      <Link href="/ask" className="text-small font-semibold text-accent">
        Ask in this community
      </Link>
      <div className="mt-4">
        <ListState
          empty={visible.length === 0}
          emptyCopy={`Nobody has asked in ${community.name} yet. Be first. Anonymous is on.`}
        >
          {visible.map((post) => (
            <PostRow key={post.id} post={{ ...post, communitySlug: community.slug, channelType: post.channelType }} />
          ))}
        </ListState>
      </div>
    </div>
  );
}
