"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi } from "@/lib/api";

const SAMPLE = {
  headline: "CS student · Building campus tools",
  experience: [
    { title: "Core member", org: "Team DarkShield", years: "2025 —" },
    { title: "Teaching assistant", org: "DBMS lab", years: "2024" },
  ],
  skills: ["TypeScript", "Next.js", "PostgreSQL"],
};

export default function MockLinkedInPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function connect() {
    setBusy(true);
    await clientApi("/api/integrations/mock/linkedin/connect", {
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
      <h1 className="mt-6 text-display">LinkedIn</h1>
      <p className="mt-2 text-muted">
        This is a Connext mock portal. Nothing is sent to LinkedIn. Connecting fills your Academic Passport.
      </p>
      <div className="mt-8 hairline p-4" style={{ borderRadius: "var(--radius)" }}>
        <div className="font-semibold">{SAMPLE.headline}</div>
        <ul className="mt-2 text-small text-muted">
          {SAMPLE.experience.map((x) => (
            <li key={x.org}>
              {x.title} · {x.org}
            </li>
          ))}
        </ul>
      </div>
      <button className="btn-primary mt-6" type="button" disabled={busy} onClick={connect}>
        Allow Connext to import this profile
      </button>
    </main>
  );
}
