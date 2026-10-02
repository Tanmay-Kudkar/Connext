"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostRow } from "@/components/feed/PostRow";
import { clientApi } from "@/lib/api";
import type { Community, FeedPost } from "@/lib/types";

export default function CommunityPage() {
  const params = useParams<{ slug: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [channel, setChannel] = useState("qa");
  const [error, setError] = useState("");

  useEffect(() => {
    clientApi<{ community: Community; posts: FeedPost[] }>(`/api/communities/${params.slug}`)
      .then((d) => {
        setCommunity(d.community);
        setPosts(d.posts);
      })
      .catch(() => setError("Community not found"));
  }, [params.slug]);

  async function join() {
    await clientApi(`/api/communities/${params.slug}/join`, { method: "POST" });
    setCommunity((c) => (c ? { ...c, joined: true } : c));
  }

  if (error) return <p>{error}</p>;
  if (!community) return <div className="skeleton h-24" />;

  const visible = posts.filter((p) => !channel || p.channelType === channel || !p.channelType);

  return (
    <div>
      <header className="mb-4">
        <p className="text-small text-muted">{community.category}</p>
        <h1 className="text-display">{community.name}</h1>
        <p className="mt-2 text-muted">{community.description}</p>
        <p className="mt-1 text-small text-muted">{community.memberCount ?? 0} members</p>
        {!community.joined && (
          <button type="button" className="btn-primary mt-3" onClick={join}>
            Join
          </button>
        )}
      </header>
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
        {visible.length === 0 ? (
          <p className="text-muted">
            Nobody has asked in {community.name} yet. Be first. Anonymous is on.
          </p>
        ) : (
          visible.map((post) => (
            <PostRow key={post.id} post={{ ...post, communitySlug: community.slug, channelType: post.channelType }} />
          ))
        )}
      </div>
    </div>
  );
}
