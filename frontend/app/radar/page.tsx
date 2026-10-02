"use client";

import { useCallback, useEffect, useState } from "react";
import { ListState } from "@/components/shell/ListState";
import { clientApi } from "@/lib/api";

type RadarRow = { topic: string; openQuestions: number };

export default function RadarPage() {
  const [radar, setRadar] = useState<RadarRow[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await clientApi<{ radar: RadarRow[]; note: string }>("/api/ai/doubt-radar");
      setRadar(d.radar);
      setNote(d.note);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Faculty view only");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <h1 className="text-display">Doubt Radar</h1>
      <p className="mt-2 text-muted">
        Anonymous counts of open questions by syllabus tag. No names, handles, or colleges.
      </p>
      {note && <p className="mt-2 text-small text-muted">{note}</p>}
      <div className="mt-6">
        <ListState loading={loading} error={error} onRetry={() => void load()}>
          <ul data-testid="radar-list">
            {radar.length === 0 ? (
              <li className="text-muted">No open syllabus clusters right now.</li>
            ) : (
              radar.map((row) => (
                <li key={row.topic} className="flex items-center justify-between post-row">
                  <span>{row.topic}</span>
                  <span className="text-mono">{row.openQuestions}</span>
                </li>
              ))
            )}
          </ul>
        </ListState>
      </div>
    </div>
  );
}
