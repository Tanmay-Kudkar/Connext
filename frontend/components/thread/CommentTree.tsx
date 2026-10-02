"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { Avatar } from "@/components/shell/Avatar";
import { celebrateFirstCredit } from "@/components/shell/FirstCreditBurst";
import { clientApi } from "@/lib/api";
import type { ThreadComment } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function CommentTree({
  comments,
  postId,
  onChanged,
}: {
  comments: ThreadComment[];
  postId: string;
  onChanged: () => void;
}) {
  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <CommentNode key={c.id} comment={c} postId={postId} onChanged={onChanged} />
      ))}
    </ul>
  );
}

function CommentNode({
  comment,
  postId,
  onChanged,
}: {
  comment: ThreadComment;
  postId: string;
  onChanged: () => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  async function vote() {
    await clientApi(`/api/comments/${comment.id}/upvote`, { method: "POST" }).catch(() => undefined);
    onChanged();
  }

  async function unblock() {
    setBusy(true);
    setError("");
    try {
      await clientApi(`/api/comments/${comment.id}/unblock`, { method: "POST" });
      celebrateFirstCredit();
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not award credits");
    } finally {
      setBusy(false);
    }
  }

  async function reply(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await clientApi(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ body, parentId: comment.id, anon: false }),
      });
      setBody("");
      setReplyOpen(false);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reply");
    } finally {
      setBusy(false);
    }
  }

  async function report() {
    const reason = window.prompt("Why are you reporting this reply?");
    if (!reason) return;
    await clientApi("/api/reports", {
      method: "POST",
      body: JSON.stringify({ targetType: "comment", targetId: comment.id, reason }),
    });
  }

  const name = comment.author.anon ? "Verified student" : comment.author.displayName;
  const college = comment.author.anon ? null : comment.author.institution?.short;
  const nested = (comment.children?.length ?? 0) > 0 || comment.truncated;

  return (
    <li>
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <Avatar initials={comment.author.initials} size={28} />
          {nested && !collapsed && <span className="mt-1 w-px flex-1" style={{ background: "var(--hairline)" }} />}
        </div>
        <div className="min-w-0 flex-1 pb-3">
          <div className="flex flex-wrap items-center gap-2 text-small text-muted">
            <span className="max-w-[12rem] truncate font-semibold" style={{ color: "var(--text-primary)" }} title={name}>
              {name}
            </span>
            {college && <span>{college}</span>}
            <span>{timeAgo(comment.createdAt)}</span>
            {comment.awarded && <span className="badge-resolved">Unblocked</span>}
            {nested && (
              <button type="button" className="btn-ghost h-auto min-h-0 px-1 py-1 text-small" onClick={() => setCollapsed((v) => !v)}>
                {collapsed ? "Expand" : "Collapse"}
              </button>
            )}
          </div>
          <p className="mt-1 text-body">{comment.body}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" className="btn-ghost h-auto min-h-0 px-1 py-1 text-small" onClick={() => void vote()}>
              <ArrowUp size={14} /> <span className="text-mono">{comment.upvotes}</span>
            </button>
            <button
              type="button"
              className="btn-ghost h-auto min-h-0 px-1 py-1 text-small"
              onClick={() => setReplyOpen((v) => !v)}
            >
              Reply
            </button>
            {comment.canUnblock && (
              <button type="button" className="btn-accent h-auto min-h-0 py-1" disabled={busy} onClick={() => void unblock()}>
                This unblocked me
              </button>
            )}
            <button type="button" className="btn-ghost h-auto min-h-0 px-1 py-1 text-small text-muted" onClick={() => void report()}>
              Report
            </button>
          </div>
          {error && (
            <p className="mt-1 text-small" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}
          {replyOpen && (
            <form className="mt-3 space-y-2" onSubmit={reply}>
              <textarea
                className="input-base min-h-[80px]"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                placeholder="Write a reply"
              />
              <button className="btn-primary" type="submit" disabled={busy}>
                Post reply
              </button>
            </form>
          )}
          {!collapsed && comment.truncated && (
            <p className="mt-2 text-small text-muted">Continue thread — depth cap reached.</p>
          )}
          {!collapsed && comment.children && comment.children.length > 0 && (
            <div className="mt-4">
              <CommentTree comments={comment.children} postId={postId} onChanged={onChanged} />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
