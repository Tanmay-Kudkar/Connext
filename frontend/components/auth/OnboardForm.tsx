"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi } from "@/lib/api";
import type { Community } from "@/lib/types";

export function OnboardForm({ communities }: { communities: Community[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  function toggle(slug: string) {
    setSelected((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));
  }

  async function finish(skip: boolean) {
    setBusy(true);
    try {
      if (!skip && selected.length) {
        await clientApi("/api/communities/join-many", {
          method: "POST",
          body: JSON.stringify({ slugs: selected }),
        });
      }
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-display">Join a few rooms</h1>
        <p className="mt-2 text-muted">Suggested from typical first-year and CS tracks. Skip is allowed.</p>
      </header>
      <div className="flex flex-wrap gap-2">
        {communities.map((c) => (
          <button
            key={c.slug}
            type="button"
            className={`chip ${selected.includes(c.slug) ? "selected" : ""}`}
            onClick={() => toggle(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <button className="btn-primary" type="button" disabled={busy} onClick={() => finish(false)}>
          Continue
        </button>
        <button className="btn-ghost" type="button" disabled={busy} onClick={() => finish(true)}>
          Skip
        </button>
      </div>
    </div>
  );
}
