"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/api";

type Stats = { xp: number; level: number; credits: number; streakDays: number; lastActive: string | null };
type EventRow = { id: string; type: string; weight: number; createdAt: string };
type Quest = { id: string; title: string; target: number; progress: number; xpReward: number; completedAt: string | null };
type Badge = { id: string; name: string; icon: string; earned: boolean };
type HeatDay = { day: string; count: number };
type BoardRow = { rank: number; handle: string; displayName: string; xp: number; level: number; credits: number };

export default function ActivityPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [heat, setHeat] = useState<HeatDay[]>([]);
  const [board, setBoard] = useState<BoardRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [s, e, q, b, h, l] = await Promise.all([
        clientApi<Stats>("/api/credits/stats/me"),
        clientApi<{ events: EventRow[] }>("/api/credits/events/me"),
        clientApi<{ quests: Quest[] }>("/api/quests/me"),
        clientApi<{ badges: Badge[] }>("/api/badges/me"),
        clientApi<{ days: HeatDay[] }>("/api/credits/heatmap/me"),
        clientApi<{ leaderboard: BoardRow[] }>("/api/credits/leaderboard"),
      ]);
      if (cancelled) return;
      setStats(s);
      setEvents(e.events);
      setQuests(q.quests);
      setBadges(b.badges);
      setHeat(h.days);
      setBoard(l.leaderboard);
    }
    load();
    const timer = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const heatMap = new Map(heat.map((d) => [String(d.day).slice(0, 10), d.count]));
  const days = Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (83 - i));
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display">Activity</h1>
        <p className="mt-1 text-muted">XP, credits, and quests from real events — not a random heatmap.</p>
      </header>
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
        <ul className="mt-3 space-y-2">
          {quests.map((q) => (
            <li key={q.id} className="text-small">
              {q.title} — {q.progress}/{q.target}
              {q.completedAt ? " · done" : ""}
            </li>
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
  );
}
