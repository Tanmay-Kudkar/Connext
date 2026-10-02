export function QuestRing({
  title,
  progress,
  target,
}: {
  title: string;
  progress: number;
  target: number;
}) {
  const pct = Math.min(1, progress / Math.max(1, target));
  const r = 14;
  const circ = 2 * Math.PI * r;
  return (
    <li className="flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--hairline)" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <div className="min-w-0">
        <div className="truncate text-small">{title}</div>
        <div className="text-mono text-small text-muted">
          {progress}/{target}
        </div>
      </div>
    </li>
  );
}
