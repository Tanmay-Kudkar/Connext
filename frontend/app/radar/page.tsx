"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/api";

type RadarRow = { topic: string; openQuestions: number };

export default function RadarPage() {
  const [radar, setRadar] = useState<RadarRow[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    clientApi<{ radar: RadarRow[]; note: string }>("/api/ai/doubt-radar")
      .then((d) => {
        setRadar(d.radar);
        setNote(d.note);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Faculty view only"));
  }, []);

  return (
    <div>
      <h1 className="text-display">Doubt Radar</h1>
      <p className="mt-2 text-muted">
        Anonymous counts of open questions by syllabus tag. No names, handles, or colleges.
      </p>
      {error && (
        <p className="mt-4" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
      {note && <p className="mt-2 text-small text-muted">{note}</p>}
      <ul className="mt-6" data-testid="radar-list">
        {radar.map((row) => (
          <li key={row.topic} className="flex items-center justify-between post-row">
            <span>{row.topic}</span>
            <span className="text-mono">{row.openQuestions}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
