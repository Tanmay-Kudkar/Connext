"use client";

import { useCallback, useEffect, useState } from "react";
import { ListState } from "@/components/shell/ListState";
import { QuestRing } from "@/components/shell/QuestRing";
import { clientApi } from "@/lib/api";

type Stats = { xp: number; level: number; credits: number; streakDays: number; lastActive: string | null };
type EventRow = { id: string; type: string; weight: number; createdAt: string };
type Quest = { id: string; title: string; target: number; progress: number; xpReward: number; completedAt: string | null };
type Badge = { id: string; name: string; icon: string; earned: boolean };
type HeatDay = { day: string; count: number };
type BoardRow = { rank: number; handle: string; displayName: string; xp: number; level: number; credits: number };

export function DashboardPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [heat, setHeat] = useState<HeatDay[]>([]);
  const [board, setBoard] = useState<BoardRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [s, e, q, b, h, l] = await Promise.all([
        clientApi<Stats>("/api/credits/stats/me"),
        clientApi<{ events: EventRow[] }>("/api/credits/events/me"),
        clientApi<{ quests: Quest[] }>("/api/quests/me"),
        clientApi<{ badges: Badge[] }>("/api/badges/me"),
        clientApi<{ days: HeatDay[] }>("/api/credits/heatmap/me"),
        clientApi<{ leaderboard: BoardRow[] }>("/api/credits/leaderboard"),
      ]);
      setStats(s);
      setEvents(e.events);
      setQuests(q.quests);
      setBadges(b.badges);
      setHeat(h.days);
      setBoard(l.leaderboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load activity");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const heatMap = new Map(heat.map((d) => [String(d.day).slice(0, 10), d.count]));
  const days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (83 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <ListState loading={loading && !stats} error={error} onRetry={() => void load()}>
      <div className="space-y-8">
        {stats && (
          <div className="flex flex-wrap gap-3">
            <span className="pill-accent">{stats.xp} XP</span>
            <span className="text-mono">Lv {stats.level}</span>
            <span className="text-mono">{stats.credits} credits</span>
            <span className="streak-badge">{stats.streakDays} day streak</span>
          </div>
        )}
        <section>
          <h2 className="text-title">Heatmap</h2>
          <div className="mt-3 grid grid-cols-12 gap-1">
            {days.map((day) => {
              const n = heatMap.get(day) ?? 0;
              const opacity = n === 0 ? 0.15 : Math.min(1, 0.3 + n * 0.25);
              return (
                <span
                  key={day}
                  title={`${day}: ${n}`}
                  className="h-3 w-3 rounded-sm"
                  style={{ background: "var(--accent)", opacity }}
                />
              );
            })}
          </div>
        </section>
        <section>
          <h2 className="text-title">Quests</h2>
          <ul className="mt-3 space-y-3">
              {quests.map((q) => (
                <QuestRing
                  key={q.id}
                  title={`${q.title}${q.completedAt ? " · done" : ""}`}
                  progress={q.progress}
                  target={q.target}
                />
              ))}
          </ul>
        </section>
        <section>
          <h2 className="text-title">Badges</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.id} className={`chip ${b.earned ? "selected" : ""}`} style={{ pointerEvents: "none" }}>
                {b.name}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-title">Recent credits</h2>
          <ul className="mt-3 space-y-2">
            {events.length === 0 && <li className="text-muted text-small">No awards yet. Unblock a helper.</li>}
            {events.map((e) => (
              <li key={e.id} className="text-small">
                {e.type.replaceAll("_", " ")} · {e.weight} · {new Date(e.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-title">Leaderboard</h2>
          <ol className="mt-3 space-y-2">
            {board.map((row) => (
              <li key={row.handle} className="flex justify-between text-small">
                <span>
                  {row.rank}. {row.displayName}
                </span>
                <span className="text-mono">{row.xp} XP</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </ListState>
  );
}
