import { communities } from "@/lib/seed";
import Link from "next/link";
import { Hash, Users, MessageSquare, ChevronRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  Academics:  "#2563EB",
  Projects:   "#1F9D55",
  Research:   "#B7791F",
  Community:  "#7C3AED",
};

export default function CommunitiesPage() {
  const categories = Array.from(new Set(communities.map(c => c.category)));

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <header className="mb-8">
        <h1 className="text-display">Communities</h1>
        <p className="mt-2 text-small" style={{ color: "var(--text-muted)" }}>
          Cross-campus spaces for every syllabus topic, project type, and interest area.
        </p>
      </header>

      {categories.map(cat => (
        <section key={cat} className="mb-10">
          <h2
            className="mb-4 text-small font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            {cat}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communities.filter(c => c.category === cat).map(c => (
              <Link
                key={c.id}
                href={`/c/${c.slug}`}
                className="group block rounded-2xl p-5 transition mode-transition"
                style={{
                  border: "1px solid var(--hairline)",
                  background: "var(--surface)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                    style={{ background: categoryColors[c.category] ?? "var(--accent)" }}
                    aria-hidden
                  >
                    <Hash size={16} />
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: "var(--text-muted)", marginTop: "0.15rem" }}
                  />
                </div>
                <h3 className="mt-3 font-semibold" style={{ fontSize: "0.967rem" }}>{c.name}</h3>
                <p className="mt-1 text-small line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {c.description}
                </p>
                {c.syllabusTag && (
                  <span className="chip mt-3" style={{ fontSize: "0.73rem" }}>
                    {c.syllabusTag}
                  </span>
                )}
                <div className="mt-4 flex gap-4 text-small" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1">
                    <Users size={12} aria-hidden /> {c.memberCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={12} aria-hidden /> {c.postCount.toLocaleString()} posts
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
