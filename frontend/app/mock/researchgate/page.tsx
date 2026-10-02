"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi } from "@/lib/api";

const SAMPLE = {
  papers: [
    {
      title: "Verified-anonymous Q&A in Indian engineering colleges",
      year: "2025",
      citations: 4,
      venue: "Campus workshop",
    },
    {
      title: "Outcome credits vs upvote reputation",
      year: "2024",
      citations: 2,
      venue: "Preprint",
    },
  ],
};

export default function MockResearchGatePage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function connect() {
    setBusy(true);
    setError("");
    try {
      await clientApi("/api/integrations/mock/researchgate/connect", {
        method: "POST",
        body: JSON.stringify(SAMPLE),
      });
      router.push("/passport");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <p className="chip selected self-start" style={{ pointerEvents: "none" }}>
        Demo integration · simulated
      </p>
      <p className="mt-8 text-small font-semibold tracking-wide">ResearchGate</p>
      <h1 className="mt-2 text-display">Sign in</h1>
      <p className="mt-2 text-muted">Simulated papers only. Connecting surfaces them on your Pro passport.</p>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void connect();
        }}
      >
        <label className="block text-small font-semibold" htmlFor="rg-email">
          Email
        </label>
        <input id="rg-email" className="input-base" type="email" defaultValue="priya.sharma@itbhu.ac.in" readOnly />
        <label className="block text-small font-semibold" htmlFor="rg-pass">
          Password
        </label>
        <input id="rg-pass" className="input-base" type="password" defaultValue="demo-only" readOnly />
      </form>
      <ul className="mt-6 space-y-3">
        {SAMPLE.papers.map((p) => (
          <li key={p.title} className="hairline p-4" style={{ borderRadius: "8px" }}>
            <div className="font-semibold">{p.title}</div>
            <div className="text-small text-muted">
              {p.year} · {p.citations} citations
            </div>
          </li>
        ))}
      </ul>
      {error && (
        <p className="mt-3 text-small" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
      <button className="btn-primary mt-6" type="button" disabled={busy} onClick={() => void connect()}>
        Import papers into Connext
      </button>
    </main>
  );
}
