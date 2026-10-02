"use client";

import { useCallback, useState } from "react";
import { PostRow } from "@/components/feed/PostRow";
import { ListState } from "@/components/shell/ListState";
import { clientApi } from "@/lib/api";
import type { FeedPost } from "@/lib/types";

export function HomeFeed({
  initialPosts,
  initialError,
}: {
  initialPosts: FeedPost[];
  initialError?: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  const retry = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const feed = await clientApi<{ posts: FeedPost[] }>("/api/feed");
      setPosts(feed.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the feed");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <header className="mb-2">
        <h1 className="text-title">Home</h1>
        <p className="text-small text-muted">Joined communities, then the rest of campus.</p>
      </header>
      <ListState
        loading={loading}
        error={error}
        empty={posts.length === 0}
        emptyCopy="Nobody has asked yet. Be first. Anonymous is on."
        onRetry={() => void retry()}
      >
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </ListState>
    </div>
  );
}
