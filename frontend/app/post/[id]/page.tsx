"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Bookmark, Share } from "lucide-react";
import { CommentTree } from "@/components/thread/CommentTree";
import { Avatar } from "@/components/shell/Avatar";
import { ListState } from "@/components/shell/ListState";
import { clientApi } from "@/lib/api";
import { copyPostLink, isSaved, toggleSaved } from "@/lib/saved";
import type { FeedPost, ThreadComment } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientApi<{ post: FeedPost; comments: ThreadComment[] }>(`/api/posts/${params.id}`);
      setPost(data.post);
      setComments(data.comments);
      setSaved(isSaved(data.post.id));
      setError("");
    } catch {
      setPost(null);
      setError("Thread not found");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    void load();
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

  if (loading && !post) return <ListState loading>{null}</ListState>;

  if (!post) {
    return (
      <ListState error={error || "Thread not found"} onRetry={() => void load()}>
        {null}
      </ListState>
    );
  }

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
            <span className="max-w-[14rem] truncate font-semibold" style={{ color: "var(--text-primary)" }} title={name}>
              {name}
            </span>
            {college && <span>{college}</span>}
            <span>{timeAgo(post.createdAt)}</span>
            {post.status === "resolved" ? (
              <span className="badge-resolved">Resolved</span>
            ) : (
              <span className="badge-open">Open</span>
            )}
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
          <button type="button" className="btn-ghost hairline" onClick={() => void reveal()}>
            Reveal my name
          </button>
        )}
        <button
          type="button"
          className="btn-ghost"
          aria-pressed={saved}
          onClick={() => setSaved(toggleSaved(post.id))}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
          Save
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={async () => {
            await copyPostLink(post.id);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
          }}
        >
          <Share size={16} />
          {copied ? "Copied" : "Share"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => void report()}>
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
        {error && post && (
          <p className="mt-2 text-small" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}
        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="text-muted">No replies yet. A sentence is enough.</p>
          ) : (
            <CommentTree comments={comments} postId={post.id} onChanged={() => void load()} />
          )}
        </div>
      </section>
    </article>
  );
}
