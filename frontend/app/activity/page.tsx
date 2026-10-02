import { DashboardPanel } from "@/components/me/DashboardPanel";

export default function ActivityPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-display">Activity</h1>
        <p className="mt-1 text-muted">XP, credits, and quests from real events — not a random heatmap.</p>
      </header>
      <DashboardPanel />
    </div>
  );
}
