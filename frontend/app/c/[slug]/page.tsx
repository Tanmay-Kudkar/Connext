import { getCommunity, getPostsBySlug, getUserById, timeAgo } from "@/lib/seed";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hash, Users, MessageSquare, CheckCircle2, ArrowUp, PlusCircle } from "lucide-react";

export default function CommunityPage({ params }: { params: { slug: string } }) {
  const community = getCommunity(params.slug);
  if (!community) notFound();

  const posts = getPostsBySlug(params.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      {/* Community header */}
      <header
        className="mb-8 rounded-2xl p-6"
        style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{ background: "var(--accent)", fontSize: "1.25rem" }}
            aria-hidden
          >
            <Hash size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-title">{community.name}</h1>
            <p className="mt-1 text-small" style={{ color: "var(--text-muted)" }}>{community.description}</p>
            {community.syllabusTag && (
              <span className="chip mt-2">{community.syllabusTag}</span>
            )}
            <div className="mt-3 flex gap-5 text-small" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1"><Users size={13} aria-hidden /> {community.memberCount.toLocaleString()} members</span>
              <span className="flex items-center gap-1"><MessageSquare size={13} aria-hidden /> {community.postCount.toLocaleString()} posts</span>
            </div>
          </div>
          <Link href="/ask" className="btn-accent shrink-0" style={{ minHeight: "40px", padding: "0.5rem 1rem" }}>
            <PlusCircle size={14} aria-hidden /> Ask here
          </Link>
        </div>
      </header>

      {/* Posts */}
      <main>
        <h2 className="sr-only">Posts in {community.name}</h2>
        {posts.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
          >
            <p className="text-title mb-2">Nobody has asked in {community.name} yet.</p>
            <p className="text-small mb-4" style={{ color: "var(--text-muted)" }}>Be first. Anonymous is on.</p>
            <Link href="/ask" className="btn-accent inline-flex">Ask anonymously →</Link>
          </div>
        ) : (
          <div className="hairline-t">
            {posts.map(post => {
              const author = getUserById(post.authorId);
              return (
                <article key={post.id} className="post-row" aria-label={post.title}>
                  <div className="flex items-start gap-3">
                    <div
                      className="avatar flex h-9 w-9 shrink-0 items-center justify-center text-xs font-bold"
                      style={{ color: "var(--accent)", border: "1px solid var(--hairline)" }}
                      aria-hidden
                    >
                      {post.anon ? "?" : (author?.initials ?? "?")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small" style={{ color: "var(--text-muted)" }}>
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                          {post.anon ? "Verified student" : (author?.displayName ?? "Unknown")}
                        </span>
                        {!post.anon && author && <span style={{ fontSize: "0.75rem" }}>· {author.college.short}</span>}
                        <span>· {timeAgo(post.createdAt)}</span>
                      </div>
                      <Link href={`/post/${post.id}`}>
                        <h3 className="mt-1 font-semibold leading-snug hover:underline" style={{ fontSize: "0.967rem" }}>
                          {post.title}
                        </h3>
                      </Link>
                      <p className="mt-1 line-clamp-2 text-small" style={{ color: "var(--text-muted)" }}>{post.body}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="chip" style={{ fontSize: "0.73rem", padding: "0.1rem 0.4rem" }}>{tag}</span>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-small" style={{ color: "var(--text-muted)" }}>
                        {post.status === "resolved"
                          ? <span className="badge-resolved flex items-center gap-1"><CheckCircle2 size={12} aria-hidden /> Resolved</span>
                          : <span className="chip" style={{ color: "var(--warning)", borderColor: "var(--warning)", fontSize: "0.73rem" }}>Open</span>
                        }
                        <span className="flex items-center gap-1"><ArrowUp size={12} aria-hidden /> {post.upvotes}</span>
                        <Link href={`/post/${post.id}`} className="flex items-center gap-1">
                          <MessageSquare size={12} aria-hidden /> {post.commentCount}
                        </Link>
                        {post.credits > 0 && <span className="pill-accent">+{post.credits} cr</span>}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
