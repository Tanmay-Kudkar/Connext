"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Compass,
  Flame,
  Home,
  LogOut,
  Map as MapIcon,
  PenLine,
  Radar,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/shell/ModeToggle";
import { Avatar } from "@/components/shell/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { clientApi } from "@/lib/api";
import type { PublicUser } from "@/lib/types";
import { cn } from "@/lib/utils";

type Stats = { xp: number; level: number; credits: number; streakDays: number };
type Quest = { id: string; title: string; target: number; progress: number };

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/communities", label: "Communities", icon: Users },
  { href: "/ask", label: "Ask", icon: PenLine },
  { href: "/map", label: "Map", icon: MapIcon },
  { href: "/activity", label: "Activity", icon: Activity },
  { href: "/passport", label: "Me", icon: UserRound },
];

export function AppShell({
  user,
  children,
}: {
  user: PublicUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: live } = useAuth();
  const current = live ?? user;
  const [stats, setStats] = useState<Stats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const hideChrome = pathname.startsWith("/mock");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [s, q] = await Promise.all([
          clientApi<Stats>("/api/credits/stats/me"),
          clientApi<{ quests: Quest[] }>("/api/quests/me"),
        ]);
        if (!cancelled) {
          setStats(s);
          setQuests(q.quests);
        }
      } catch {
        /* unauthenticated pages shouldn't reach here */
      }
    }
    load();
    const timer = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  async function logout() {
    await clientApi("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (hideChrome) return <>{children}</>;

  const staff = current.role === "faculty" || current.role === "mentor";

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1260px]">
      <aside className="sticky top-0 hidden h-dvh w-[240px] shrink-0 flex-col gap-2 px-3 py-6 md:flex">
        <Link href="/" className="mb-4 px-3 text-title">
          Connext
        </Link>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn("nav-item", active && "active")}>
              <Icon size={20} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
        {staff && (
          <Link href="/radar" className={cn("nav-item", pathname.startsWith("/radar") && "active")}>
            <Radar size={20} strokeWidth={1.5} />
            Doubt Radar
          </Link>
        )}
        <div className="mt-auto space-y-3 px-1">
          <ModeToggle />
          <div className="flex items-center gap-2 px-2">
            <Avatar initials={current.initials} size={32} />
            <div className="min-w-0">
              <div className="truncate text-small font-semibold">{current.displayName}</div>
              <div className="text-small text-muted">@{current.handle}</div>
            </div>
          </div>
          <button type="button" className="btn-ghost w-full justify-start" onClick={logout}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 hairline md:border-x pb-24 md:pb-0">
        <header className="sticky top-0 z-10 flex items-center justify-between hairline-b surface px-4 py-3 md:hidden">
          <Link href="/" className="font-semibold">
            Connext
          </Link>
          <div className="flex items-center gap-2">
            {stats && (
              <span className="streak-badge" aria-label={`${stats.streakDays} day streak`}>
                <Flame size={14} /> {stats.streakDays}
              </span>
            )}
            <ModeToggle />
          </div>
        </header>
        <div className="mx-auto max-w-[600px] px-4 py-4">{children}</div>
      </main>

      <aside className="sticky top-0 hidden h-dvh w-[300px] shrink-0 overflow-y-auto px-5 py-6 lg:block">
        {stats && (
          <div className="mb-6">
            <div className="text-small text-muted">Today</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="pill-accent">{stats.xp} XP</span>
              <span className="text-mono text-small">Lv {stats.level}</span>
              <span className="streak-badge">
                <Flame size={14} /> {stats.streakDays}
              </span>
            </div>
          </div>
        )}
        <div>
          <div className="mb-2 text-small font-semibold">Daily quests</div>
          <ul className="space-y-2">
            {quests.map((q) => (
              <li key={q.id} className="text-small">
                <div>{q.title}</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--hairline)" }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(100, (q.progress / Math.max(1, q.target)) * 100)}%`,
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <Link href="/communities" className="text-small font-semibold">
            Find a community
          </Link>
          <p className="mt-1 text-small text-muted">Join a syllabus room. Skip is allowed on first run.</p>
        </div>
        {staff && (
          <Link href="/radar" className="mt-6 block text-small font-semibold text-accent">
            Open Doubt Radar
          </Link>
        )}
      </aside>

      <nav
        className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-5 hairline-t surface px-2 py-1 md:hidden"
        aria-label="Primary"
      >
        {[
          { href: "/", label: "Home", icon: Home },
          { href: "/communities", label: "Explore", icon: Compass },
          { href: "/ask", label: "Ask", icon: PenLine },
          { href: "/activity", label: "Activity", icon: Flame },
          { href: "/passport", label: "Me", icon: UserRound },
        ].map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px]",
                active ? "text-accent" : "text-muted",
              )}
            >
              <Icon size={22} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
