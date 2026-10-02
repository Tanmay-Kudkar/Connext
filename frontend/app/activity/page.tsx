import { users } from "@/lib/seed";
import { Flame, Trophy, Hash, Zap, Briefcase, CheckCircle2, GitBranch } from "lucide-react";

// Demo user – Tanmay
const me = users[0];

const badges = [
  { icon: "🔥", name: "7-Day Streak", earned: true },
  { icon: "💬", name: "First Answer", earned: true },
  { icon: "🎯", name: "Accepted Answer", earned: true },
  { icon: "🚀", name: "10 Contributions", earned: false },
  { icon: "🌐", name: "Cross-Campus", earned: false },
  { icon: "👑", name: "Top Contributor", earned: false },
];

// Heatmap – last 12 weeks (84 days)
const heatmapData = Array.from({ length: 84 }, (_, i) => ({
  date: i,
  count: Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0,
}));

const heatmapColor = (count: number) => {
  if (count === 0) return "var(--hairline)";
  if (count === 1) return "#FF4B2B44";
  if (count === 2) return "#FF4B2B88";
  if (count === 3) return "#FF4B2BAA";
  return "var(--accent)";
};

export default function DashboardPage() {
  const xpToNext = 1800;
  const xpPct = Math.round((me.xp / xpToNext) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <header className="mb-8">
        <h1 className="text-display">Dashboard</h1>
        <p className="text-small mt-1" style={{ color: "var(--text-muted)" }}>
          Your contribution journey — <strong>{me.displayName}</strong> · {me.college.short}
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          {/* Level + XP card */}
          <section
            className="rounded-2xl p-6"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
            aria-label="Level and XP"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl font-bold"
                  style={{ background: "var(--accent-dim)", color: "var(--accent)", fontSize: "1.125rem", border: "2px solid var(--accent)" }}
                  aria-label={`Level ${me.level}`}
                >
                  Lv {me.level}
                </div>
                <div>
                  <h2 className="text-title">{me.displayName}</h2>
                  <p className="text-small" style={{ color: "var(--text-muted)" }}>
                    {me.role} · {me.college.short}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="streak-badge text-base"><Flame size={16} aria-hidden /> {me.streakDays}</span>
              </div>
            </div>

            {/* XP bar */}
            <div>
              <div className="flex justify-between text-small mb-1.5" style={{ color: "var(--text-muted)" }}>
                <span>XP Progress to Level {me.level + 1}</span>
                <span className="text-mono">{me.xp.toLocaleString()} / {xpToNext.toLocaleString()}</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--hairline)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${xpPct}%`, background: "var(--accent)" }}
                  role="progressbar"
                  aria-valuenow={xpPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="XP progress"
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Streak", value: `${me.streakDays}d`, icon: <Flame size={14} aria-hidden /> },
                { label: "Total XP",  value: me.xp.toLocaleString(), icon: <Zap size={14} aria-hidden /> },
                { label: "Credits",  value: "380 cr", icon: <Trophy size={14} aria-hidden /> },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-xl p-3 text-center"
                  style={{ background: "var(--accent-dim)" }}
                >
                  <div className="flex justify-center mb-1" style={{ color: "var(--accent)" }}>{s.icon}</div>
                  <p className="text-mono font-bold" style={{ color: "var(--accent)", fontSize: "1rem" }}>{s.value}</p>
                  <p className="text-small mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contribution heatmap */}
          <section
            className="rounded-2xl p-6"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
            aria-label="Contribution heatmap"
          >
            <h2 className="text-small font-semibold mb-4 flex items-center gap-2">
              <GitBranch size={14} aria-hidden style={{ color: "var(--accent)" }} />
              Contribution activity (last 12 weeks)
            </h2>
            <div className="flex gap-1 flex-wrap">
              {heatmapData.map((d, i) => (
                <div
                  key={i}
                  className="h-3 w-3 rounded-sm"
                  style={{ background: heatmapColor(d.count) }}
                  title={`${d.count} contribution${d.count !== 1 ? "s" : ""}`}
                  aria-hidden
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-small" style={{ color: "var(--text-muted)" }}>
              <span>Less</span>
              {[0, 1, 2, 3, 4].map(n => (
                <div key={n} className="h-3 w-3 rounded-sm" style={{ background: heatmapColor(n) }} aria-hidden />
              ))}
              <span>More</span>
            </div>
          </section>

          {/* Badges */}
          <section
            className="rounded-2xl p-6"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
            aria-label="Badges"
          >
            <h2 className="text-small font-semibold mb-4 flex items-center gap-2">
              <Trophy size={14} aria-hidden style={{ color: "var(--accent)" }} />
              Badges
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {badges.map(b => (
                <div
                  key={b.name}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center"
                  style={{
                    border: "1px solid var(--hairline)",
                    background: b.earned ? "var(--accent-dim)" : "transparent",
                    opacity: b.earned ? 1 : 0.4,
                  }}
                  aria-label={`${b.name}${b.earned ? " (earned)" : " (locked)"}`}
                >
                  <span style={{ fontSize: "1.5rem" }} aria-hidden>{b.icon}</span>
                  <span className="text-small" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{b.name}</span>
                  {b.earned && <CheckCircle2 size={10} style={{ color: "var(--success)" }} aria-hidden />}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Vibe / Pro toggle */}
          <section
            className="rounded-2xl p-5"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
            aria-label="Identity mode"
          >
            <h2 className="text-small font-semibold mb-3">Identity</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { mode: "vibe", label: "Vibe", icon: <Zap size={14} />, desc: "Student mode" },
                { mode: "pro",  label: "Pro",  icon: <Briefcase size={14} />, desc: "CV mode" },
              ].map(m => (
                <button
                  key={m.mode}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition"
                  style={{ border: "1px solid var(--hairline)" }}
                  aria-label={`Switch to ${m.label} mode — ${m.desc}`}
                >
                  <span style={{ color: "var(--accent)" }}>{m.icon}</span>
                  <span className="text-small font-semibold">{m.label}</span>
                  <span className="text-small" style={{ color: "var(--text-muted)", fontSize: "0.73rem" }}>{m.desc}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section
            className="rounded-2xl p-5"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
            aria-label="Skills"
          >
            <h2 className="text-small font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {me.skills.map(s => (
                <span key={s} className="chip selected">{s}</span>
              ))}
            </div>
          </section>

          {/* Academic Passport completion */}
          <section
            className="rounded-2xl p-5"
            style={{ border: "1px solid var(--hairline)", background: "var(--surface)" }}
            aria-label="Academic Passport"
          >
            <h2 className="text-small font-semibold mb-1">Academic Passport</h2>
            <p className="text-small mb-3" style={{ color: "var(--text-muted)" }}>40% complete</p>
            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: "var(--hairline)" }}>
              <div className="h-full rounded-full" style={{ width: "40%", background: "var(--accent)" }} aria-hidden />
            </div>
            {[
              { label: "GitHub connected", done: false },
              { label: "LinkedIn (mock) linked", done: false },
              { label: "ORCID linked", done: false },
              { label: "Skills added", done: true },
              { label: "Institution verified", done: true },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 mb-1.5">
                <CheckCircle2
                  size={13}
                  style={{ color: item.done ? "var(--success)" : "var(--hairline)", flexShrink: 0 }}
                  aria-hidden
                />
                <span className="text-small" style={{ color: item.done ? "var(--text-primary)" : "var(--text-muted)" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
