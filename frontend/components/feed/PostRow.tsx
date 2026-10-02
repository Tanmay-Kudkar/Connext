"use client";

import Link from "next/link";
import { ArrowUp, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/shell/Avatar";
import { clientApi } from "@/lib/api";
import type { FeedPost } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import { useState } from "react";

export function PostRow({ post }: { post: FeedPost }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const authorName = post.author.anon ? "Verified student" : post.author.displayName;
  const college = post.author.anon ? null : post.author.institution?.short;

  async function upvote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await clientApi("/api/posts/" + post.id + "/upvote", { method: "POST" });
      setUpvotes((n) => n + 1);
    } catch {
      /* already voted */
    }
  }

  return (
    <article className="post-row">
      <Link href={`/post/${post.id}`} className="block px-1">
        <div className="flex items-start gap-3">
          <Avatar initials={post.author.initials} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-small text-muted">
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {authorName}
              </span>
              {college && <span>{college}</span>}
              {post.communitySlug && (
                <span className="chip" style={{ pointerEvents: "none" }}>
                  r/{post.communitySlug}
                </span>
              )}
              <span>{timeAgo(post.createdAt)}</span>
              {post.status === "resolved" && <span className="badge-resolved">Resolved</span>}
            </div>
            <h2 className="mt-1 text-title">{post.title}</h2>
            <p className="mt-1 line-clamp-2 text-small text-muted">{post.body}</p>
            <div className="mt-3 flex items-center gap-4 text-small text-muted">
              <button type="button" className="btn-ghost h-auto min-h-0 px-1 py-1" onClick={upvote} aria-label="Upvote">
                <ArrowUp size={16} />
                <span className="text-mono">{upvotes}</span>
              </button>
              <span className="inline-flex items-center gap-1">
                <MessageSquare size={16} />
                <span className="text-mono">{post.commentCount}</span>
              </span>
              {post.credits > 0 && <span className="pill-accent">{post.credits} cr</span>}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
