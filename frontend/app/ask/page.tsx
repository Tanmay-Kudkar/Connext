"use client";
import { communities } from "@/lib/seed";
import { useState } from "react";
import { PlusCircle, Hash, Eye, EyeOff } from "lucide-react";

export default function AskPage() {
  const [anon, setAnon] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-display">Ask a question</h1>
        <p className="mt-2 text-small" style={{ color: "var(--text-muted)" }}>
          Ask without fear — you&apos;re institution-verified but hidden from peers.
          You can reveal later to claim credit.
        </p>
      </header>

      <form
        className="flex flex-col gap-5"
        onSubmit={e => e.preventDefault()}
        aria-label="Ask a question form"
      >
        {/* Community selector */}
        <div>
          <label htmlFor="ask-community" className="block text-small font-semibold mb-2">
            Community <span aria-hidden style={{ color: "var(--accent)" }}>*</span>
          </label>
          <select
            id="ask-community"
            required
            value={selectedCommunity}
            onChange={e => setSelectedCommunity(e.target.value)}
            className="input-base"
            style={{ cursor: "pointer" }}
          >
            <option value="" disabled hidden>Select a community…</option>
            {communities.map(c => (
              <option key={c.id} value={c.slug}>{c.name} — {c.category}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="ask-title" className="block text-small font-semibold mb-2">
            Question title <span aria-hidden style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="ask-title"
            type="text"
            required
            maxLength={200}
            placeholder="Be specific — e.g. 'Why does Postgres ignore my index when the table has 50k rows?'"
            className="input-base"
          />
        </div>

        {/* Body */}
        <div>
          <label htmlFor="ask-body" className="block text-small font-semibold mb-2">Details</label>
          <textarea
            id="ask-body"
            rows={6}
            placeholder="Add context, code snippets, what you've already tried…"
            className="input-base"
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="ask-tags" className="block text-small font-semibold mb-2">Tags</label>
          <input
            id="ask-tags"
            type="text"
            placeholder="e.g. PostgreSQL, indexing, query-planner (comma separated)"
            className="input-base"
          />
        </div>

        {/* Anonymous toggle */}
        <div
          className="flex items-center justify-between rounded-2xl p-4"
          style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
        >
          <div className="flex items-center gap-3">
            {anon
              ? <EyeOff size={20} style={{ color: "var(--text-muted)" }} aria-hidden />
              : <Eye size={20} style={{ color: "var(--accent)" }} aria-hidden />
            }
            <div>
              <p className="text-small font-semibold">{anon ? "Posting anonymously" : "Posting as yourself"}</p>
              <p className="text-small mt-0.5" style={{ color: "var(--text-muted)" }}>
                {anon
                  ? "Peers see 'Verified student'. Reveal later to claim credit."
                  : "Your name and college will be visible to all."
                }
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={anon}
            onClick={() => setAnon(!anon)}
            className="relative h-6 w-11 rounded-full transition-colors"
            style={{ background: anon ? "var(--text-muted)" : "var(--accent)", flexShrink: 0 }}
            aria-label="Toggle anonymous posting"
          >
            <span
              className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform"
              style={{ transform: anon ? "translateX(0)" : "translateX(20px)" }}
            />
          </button>
        </div>

        {/* AI suggestions placeholder */}
        <div
          className="rounded-2xl p-4 text-small"
          style={{ border: "1px dashed var(--hairline)", color: "var(--text-muted)" }}
        >
          💡 <strong>AI suggestion:</strong> As you type your title, similar questions will appear here.
          Check before posting to avoid duplicates.
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" id="ask-submit" className="btn-primary">
            <PlusCircle size={16} aria-hidden /> Post question
          </button>
          <button type="button" className="btn-ghost" style={{ border: "1px solid var(--hairline)" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
