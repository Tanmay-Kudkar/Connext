import { getPostById, getUserById, timeAgo, communities } from "@/lib/seed";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowUp, Hash, MessageSquare } from "lucide-react";

// Seeded comments for the demo
const seedComments: Record<string, Array<{
  id: string; authorId: string; anon: boolean; body: string; createdAt: string; isAccepted: boolean;
}>> = {
  p1: [
    {
      id: "cm1", authorId: "u5", anon: false,
      body: "The query planner uses statistics to decide. If the table is small relative to what the planner thinks, it may estimate a seq scan is cheaper. Try `ANALYZE email_table;` to refresh statistics, then run `EXPLAIN ANALYZE` again. Also check if you're using a function on the indexed column — e.g. `WHERE lower(email) = ...` — which defeats the index.",
      createdAt: "2026-10-02T05:00:00Z", isAccepted: true,
    },
    {
      id: "cm2", authorId: "u2", anon: false,
      body: "Also worth checking `SET enable_seqscan = off;` temporarily to force the planner to use the index. If it's dramatically faster, the planner's cost estimate is off and you may need to tune `random_page_cost`.",
      createdAt: "2026-10-02T05:45:00Z", isAccepted: false,
    },
  ],
  p2: [
    {
      id: "cm3", authorId: "u4", anon: false,
      body: "Start with `CREATE EXTENSION vector;` then add a vector column: `ALTER TABLE posts ADD COLUMN embedding vector(1536);`. Use `pgvector`'s cosine operator `<=>` in queries. I can share the full FastAPI endpoint if helpful.",
      createdAt: "2026-10-02T08:00:00Z", isAccepted: false,
    },
  ],
};

export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);
  if (!post) notFound();

  const author = getUserById(post.authorId);
  const community = communities.find(c => c.slug === post.communitySlug);
  const comments = seedComments[post.id] ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-2 text-small" style={{ color: "var(--text-muted)" }} aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden>›</span>
        {community && (
          <Link href={`/c/${community.slug}`} className="flex items-center gap-1 hover:underline">
            <Hash size={12} aria-hidden />{community.name}
          </Link>
        )}
      </nav>

      {/* Post */}
      <article
        className="rounded-2xl p-6 mb-6"
        style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
      >
        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="avatar flex h-10 w-10 items-center justify-center text-sm font-bold"
            style={{ color: "var(--accent)", border: "1px solid var(--hairline)" }}
            aria-hidden
          >
            {post.anon ? "?" : (author?.initials ?? "?")}
          </div>
          <div>
            <p className="font-semibold text-small">
              {post.anon ? "Verified student" : (author?.displayName ?? "Unknown")}
            </p>
            <p className="text-small" style={{ color: "var(--text-muted)" }}>
              {!post.anon && author && `${author.college.short} · `}{timeAgo(post.createdAt)}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {post.status === "resolved"
              ? <span className="badge-resolved flex items-center gap-1"><CheckCircle2 size={13} /> Resolved</span>
              : <span className="chip" style={{ color: "var(--warning)", borderColor: "var(--warning)" }}>Open</span>
            }
          </div>
        </div>

        {/* Title */}
        <h1 className="text-title mb-3">{post.title}</h1>

        {/* Body */}
        <p className="text-body" style={{ color: "var(--text-muted)" }}>{post.body}</p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: "var(--hairline)" }}>
          <button className="btn-ghost flex items-center gap-1.5 text-small" style={{ border: "1px solid var(--hairline)" }}>
            <ArrowUp size={14} aria-hidden /> {post.upvotes} Upvote
          </button>
          <span className="flex items-center gap-1.5 text-small" style={{ color: "var(--text-muted)" }}>
            <MessageSquare size={14} aria-hidden /> {post.commentCount} replies
          </span>
          {post.credits > 0 && <span className="pill-accent">+{post.credits} cr awarded</span>}
          {post.status === "open" && (
            <button className="btn-accent ml-auto" style={{ minHeight: "36px", padding: "0.4rem 0.875rem", fontSize: "0.867rem" }}>
              ✅ This unblocked me
            </button>
          )}
          {post.anon && (
            <button className="btn-ghost text-small ml-auto" style={{ border: "1px solid var(--hairline)" }}>
              Reveal identity & claim credit
            </button>
          )}
        </div>
      </article>

      {/* Comments */}
      <section aria-label="Replies">
        <h2 className="text-title mb-4">{comments.length} {comments.length === 1 ? "Reply" : "Replies"}</h2>

        {comments.length === 0 && (
          <div
            className="rounded-2xl p-8 text-center text-small"
            style={{ border: "1px solid var(--hairline)", color: "var(--text-muted)" }}
          >
            No replies yet. Be the first to answer.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {comments.map((comment) => {
            const commentAuthor = getUserById(comment.authorId);
            return (
              <div
                key={comment.id}
                className="rounded-2xl p-5"
                style={{
                  border: `1px solid ${comment.isAccepted ? "var(--success)" : "var(--hairline)"}`,
                  background: comment.isAccepted ? "#1F9D5508" : "var(--surface)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="avatar flex h-9 w-9 items-center justify-center text-xs font-bold"
                    style={{ color: "var(--accent)", border: "1px solid var(--hairline)" }}
                    aria-hidden
                  >
                    {comment.anon ? "?" : (commentAuthor?.initials ?? "?")}
                  </div>
                  <div>
                    <p className="font-semibold text-small">
                      {comment.anon ? "Verified student" : (commentAuthor?.displayName ?? "Unknown")}
                    </p>
                    <p className="text-small" style={{ color: "var(--text-muted)" }}>
                      {commentAuthor && `${commentAuthor.college.short} · `}{timeAgo(comment.createdAt)}
                    </p>
                  </div>
                  {comment.isAccepted && (
                    <span className="badge-resolved ml-auto flex items-center gap-1">
                      <CheckCircle2 size={12} aria-hidden /> Accepted
                    </span>
                  )}
                </div>
                <p className="text-body" style={{ color: "var(--text-muted)" }}>{comment.body}</p>
                <div className="mt-3 flex items-center gap-3">
                  <button className="btn-ghost text-small" style={{ minHeight: "32px", padding: "0.25rem 0.625rem" }}>
                    <ArrowUp size={13} /> Upvote
                  </button>
                  {!comment.isAccepted && post.status === "open" && (
                    <button className="btn-accent text-small" style={{ minHeight: "32px", padding: "0.25rem 0.625rem" }}>
                      ✅ This unblocked me
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply compose */}
        <div
          className="mt-6 rounded-2xl p-5"
          style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
        >
          <h3 className="text-small font-semibold mb-3">Add a reply</h3>
          <label className="sr-only" htmlFor="reply-body">Your reply</label>
          <textarea
            id="reply-body"
            className="input-base"
            rows={4}
            placeholder="Share what you know…"
            style={{ resize: "vertical" }}
          />
          <div className="mt-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-small cursor-pointer" style={{ color: "var(--text-muted)" }}>
              <input type="checkbox" className="rounded" aria-label="Post anonymously" />
              Post anonymously
            </label>
            <button className="btn-primary" style={{ minHeight: "38px", padding: "0.5rem 1.125rem" }}>
              Reply
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
