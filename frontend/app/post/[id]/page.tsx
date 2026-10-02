"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CommentTree } from "@/components/thread/CommentTree";
import { Avatar } from "@/components/shell/Avatar";
import { clientApi } from "@/lib/api";
import type { FeedPost, ThreadComment } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await clientApi<{ post: FeedPost; comments: ThreadComment[] }>(`/api/posts/${params.id}`);
    setPost(data.post);
    setComments(data.comments);
  }, [params.id]);

  useEffect(() => {
    load().catch(() => setError("Thread not found"));
  }, [load]);

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await clientApi(`/api/posts/${params.id}/comments`, {
        method: "POST",
        body: JSON.stringify({ body: reply, anon: false }),
      });
      setReply("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reply");
    } finally {
      setBusy(false);
    }
  }

  async function reveal() {
    await clientApi(`/api/posts/${params.id}/reveal`, { method: "POST" });
    await load();
  }

  async function report() {
    const reason = window.prompt("Why are you reporting this post?");
    if (!reason) return;
    await clientApi("/api/reports", {
      method: "POST",
      body: JSON.stringify({ targetType: "post", targetId: params.id, reason }),
    });
  }

  if (!post && !error) return <div className="skeleton h-24" />;
  if (!post) return <p>{error}</p>;

  const name = post.author.anon ? "Verified student" : post.author.displayName;
  const college = post.author.anon ? null : post.author.institution?.short;

  return (
    <article>
      <nav className="mb-4 text-small text-muted">
        <Link href="/">Home</Link>
        {post.communitySlug && (
          <>
            <span> › </span>
            <Link href={`/c/${post.communitySlug}`}>r/{post.communitySlug}</Link>
          </>
        )}
      </nav>
      <div className="flex items-start gap-3">
        <Avatar initials={post.author.initials} />
        <div>
          <div className="flex flex-wrap items-center gap-2 text-small text-muted">
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {name}
            </span>
            {college && <span>{college}</span>}
            <span>{timeAgo(post.createdAt)}</span>
            {post.status === "resolved" && <span className="badge-resolved">Resolved</span>}
          </div>
          <h1 className="mt-2 text-title">{post.title}</h1>
        </div>
      </div>
      <p className="mt-4 whitespace-pre-wrap text-body">{post.body}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="chip" style={{ pointerEvents: "none" }}>
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.isOwner && post.anon && (
          <button type="button" className="btn-ghost hairline" onClick={reveal}>
            Reveal my name
          </button>
        )}
        <button type="button" className="btn-ghost" onClick={report}>
          Report
        </button>
        {post.credits > 0 && <span className="pill-accent">{post.credits} cr</span>}
      </div>

      <section className="mt-8">
        <h2 className="text-title">Replies</h2>
        <form className="mt-4 space-y-2" onSubmit={submitReply}>
          <textarea
            className="input-base min-h-[90px]"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            required
            placeholder="Help from another campus is welcome."
          />
          <button className="btn-primary" type="submit" disabled={busy}>
            Reply
          </button>
        </form>
        {error && (
          <p className="mt-2 text-small" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}
        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="text-muted">No replies yet. A sentence is enough.</p>
          ) : (
            <CommentTree comments={comments} postId={post.id} onChanged={load} />
          )}
        </div>
      </section>
    </article>
  );
}
