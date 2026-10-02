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
  const [error, setError] = useState("");

  async function connect() {
    setBusy(true);
    setError("");
    try {
      await clientApi("/api/integrations/mock/linkedin/connect", {
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
      <p className="mt-8 text-small font-semibold tracking-wide" style={{ color: "#0A66C2" }}>
        LinkedIn
      </p>
      <h1 className="mt-2 text-display">Sign in</h1>
      <p className="mt-2 text-muted">
        This is a Connext mock portal. Nothing is sent to LinkedIn. Connecting fills your Academic Passport.
      </p>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void connect();
        }}
      >
        <label className="block text-small font-semibold" htmlFor="li-email">
          Email
        </label>
        <input id="li-email" className="input-base" type="email" defaultValue="tanmay.kudkar@xie.edu.in" readOnly />
        <label className="block text-small font-semibold" htmlFor="li-pass">
          Password
        </label>
        <input id="li-pass" className="input-base" type="password" defaultValue="demo-only" readOnly />
      </form>
      <div className="mt-6 hairline p-4" style={{ borderRadius: "8px" }}>
        <div className="font-semibold">{SAMPLE.headline}</div>
        <ul className="mt-2 text-small text-muted">
          {SAMPLE.experience.map((x) => (
            <li key={x.org}>
              {x.title} · {x.org}
            </li>
          ))}
        </ul>
      </div>
      {error && (
        <p className="mt-3 text-small" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
      <button className="btn-primary mt-6" type="button" disabled={busy} onClick={() => void connect()}>
        Allow Connext to import this profile
      </button>
    </main>
  );
}
