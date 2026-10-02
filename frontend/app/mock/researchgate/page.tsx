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

  async function connect() {
    setBusy(true);
    await clientApi("/api/integrations/mock/researchgate/connect", {
      method: "POST",
      body: JSON.stringify(SAMPLE),
    });
    router.push("/passport");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-6 py-12">
      <p className="chip selected" style={{ pointerEvents: "none" }}>
        Demo integration · simulated
      </p>
      <h1 className="mt-6 text-display">ResearchGate</h1>
      <p className="mt-2 text-muted">
        Simulated papers only. Connecting surfaces them on your Pro passport.
      </p>
      <ul className="mt-8 space-y-3">
        {SAMPLE.papers.map((p) => (
          <li key={p.title} className="hairline p-4" style={{ borderRadius: "var(--radius)" }}>
            <div className="font-semibold">{p.title}</div>
            <div className="text-small text-muted">
              {p.year} · {p.citations} citations
            </div>
          </li>
        ))}
      </ul>
      <button className="btn-primary mt-6" type="button" disabled={busy} onClick={connect}>
        Import papers into Connext
      </button>
    </main>
  );
}
