"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/api";

type Cluster = {
  city: string;
  state: string;
  people: { handle: string; displayName: string; role: string; initials: string }[];
};

type Match = {
  userId: string;
  handle: string;
  displayName: string;
  initials: string;
  role: string;
  institution: string;
  city: string;
  matchingSkills: string[];
  matchingInterests: string[];
  reason: string;
};

export default function MapPage() {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [optIn, setOptIn] = useState(true);

  useEffect(() => {
    clientApi<{ clusters: Cluster[] }>("/api/map/people").then((d) => setClusters(d.clusters));
    clientApi<{ results: Match[] }>("/api/ai/match-teammates", { method: "POST", body: JSON.stringify({}) }).then((d) =>
      setMatches(d.results),
    );
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-display">Map</h1>
          <p className="mt-1 text-muted">List first. College and city only. Opt-in, no live GPS.</p>
        </div>
        <button type="button" className="btn-ghost hairline" onClick={() => setShowMap((v) => !v)}>
          {showMap ? "List" : "Map"}
        </button>
      </header>
      <label className="flex items-center gap-2 text-small">
        <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} />
        Share my college city on the map
      </label>
      {optIn && showMap && (
        <div className="hairline rounded-[var(--radius)] p-4">
          <p className="text-small text-muted">Coarse clusters — not a street map.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {clusters.map((c) => (
              <div key={c.city} className="hairline p-3" style={{ borderRadius: "var(--radius)" }}>
                <div className="font-semibold">{c.city}</div>
                <div className="text-small text-muted">
                  {c.state} · {c.people.length} people
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {optIn && !showMap && (
        <ul>
          {clusters.map((c) => (
            <li key={c.city} className="post-row">
              <div className="font-semibold">
                {c.city}, {c.state}
              </div>
              <p className="text-small text-muted">{c.people.length} opted-in people</p>
              <p className="mt-1 text-small">
                {c.people
                  .slice(0, 4)
                  .map((p) => p.displayName)
                  .join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
      <section>
        <h2 className="text-title">Recommended teammates</h2>
        <ul className="mt-3 space-y-3">
          {matches.map((m) => (
            <li key={m.userId} className="post-row">
              <div className="font-semibold">
                {m.displayName} · {m.institution}
              </div>
              <p className="text-small text-muted">{m.reason}</p>
            </li>
          ))}
          {matches.length === 0 && <li className="text-muted text-small">No overlapping tags yet.</li>}
        </ul>
      </section>
    </div>
  );
}
