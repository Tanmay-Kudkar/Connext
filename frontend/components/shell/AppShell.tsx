"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Compass,
  Flame,
  Home,
  Map as MapIcon,
  PenLine,
  Radar,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Avatar } from "@/components/shell/Avatar";
import { FirstCreditBurst } from "@/components/shell/FirstCreditBurst";
import { MoreMenu } from "@/components/shell/MoreMenu";
import { OfflineBanner } from "@/components/shell/OfflineBanner";
import { QuestRing } from "@/components/shell/QuestRing";
import { Wordmark } from "@/components/shell/Wordmark";
import { useAuth } from "@/components/providers/AuthProvider";
import { clientApi } from "@/lib/api";
import type { Community, PublicUser } from "@/lib/types";
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

const MOBILE_NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/communities", label: "Explore", icon: Compass },
  { href: "/ask", label: "Ask", icon: PenLine },
  { href: "/activity", label: "Activity", icon: Flame },
  { href: "/passport", label: "Me", icon: UserRound },
];

export function AppShell({
  user,
  children,
}: {
  user: PublicUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { user: live } = useAuth();
  const current = live ?? user;
  const [stats, setStats] = useState<Stats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [rooms, setRooms] = useState<Community[]>([]);
  const hideChrome = pathname.startsWith("/mock");

  useEffect(() => {
    let cancelled = false;
    async function loadChrome() {
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
    async function loadRooms() {
      try {
        const c = await clientApi<{ communities: Community[] }>("/api/communities");
        if (cancelled) return;
        const suggested = c.communities.filter((room) => !room.joined).slice(0, 4);
        setRooms(suggested.length ? suggested : c.communities.slice(0, 4));
      } catch {
        /* ignore */
      }
    }
    loadChrome();
    loadRooms();
    const timer = setInterval(loadChrome, 12_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  if (hideChrome) return <>{children}</>;

  const staff = current.role === "faculty" || current.role === "mentor";

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1260px]">
      <a href="#main-feed" className="skip-link">
        Skip to feed
      </a>
      <aside className="sticky top-0 hidden h-dvh w-[72px] shrink-0 flex-col gap-1 px-2 py-6 md:flex min-[1100px]:w-[240px] min-[1100px]:px-3">
        <div className="mb-4 flex justify-center px-1 min-[1100px]:justify-start min-[1100px]:px-3">
          <Wordmark compact className="min-[1100px]:hidden" />
          <span className="hidden min-[1100px]:inline">
            <Wordmark />
          </span>
        </div>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item justify-center min-[1100px]:justify-start", active && "active")}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={1.5} />
              <span className="hidden min-[1100px]:inline">{item.label}</span>
            </Link>
          );
        })}
        {staff && (
          <Link
            href="/radar"
            className={cn(
              "nav-item justify-center min-[1100px]:justify-start",
              pathname.startsWith("/radar") && "active",
            )}
            aria-label="Doubt Radar"
          >
            <Radar size={20} strokeWidth={1.5} />
            <span className="hidden min-[1100px]:inline">Doubt Radar</span>
          </Link>
        )}
        <div className="mt-auto space-y-3 px-1">
          <div className="hidden items-center gap-2 px-2 min-[1100px]:flex">
            <Avatar initials={current.initials} pack={current.avatarPack} size={32} />
            <div className="min-w-0">
              <div className="truncate text-small font-semibold">{current.displayName}</div>
              <div className="text-small text-muted">@{current.handle}</div>
            </div>
          </div>
          <MoreMenu placement="top" />
        </div>
      </aside>

      <main id="main-feed" className="min-w-0 flex-1 hairline md:border-x pb-24 md:pb-0">
        <OfflineBanner />
        <header className="sticky top-0 z-10 flex items-center justify-between hairline-b surface px-4 py-3 md:hidden">
          <Wordmark />
          <div className="flex items-center gap-2">
            {stats && (
              <span className="streak-badge" aria-label={`${stats.streakDays} day streak`}>
                <Flame size={14} /> {stats.streakDays}
              </span>
            )}
            <MoreMenu placement="bottom" />
          </div>
        </header>
        <div className="mx-auto max-w-[600px] px-4 py-4">{children}</div>
      </main>

      <aside className="sticky top-0 hidden h-dvh w-[300px] shrink-0 overflow-y-auto px-5 py-6 min-[1100px]:block">
        {stats && (
          <div className="mb-6">
            <div className="text-small text-muted">Today</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="pill-accent">{stats.xp} XP</span>
              <span className="text-mono text-small">Lv {stats.level}</span>
              <span className="streak-badge" aria-label={`${stats.streakDays} day streak`}>
                <Flame size={14} /> {stats.streakDays}
              </span>
            </div>
          </div>
        )}
        <div>
          <div className="mb-2 text-small font-semibold">Daily quests</div>
          {quests.length === 0 ? (
            <p className="text-small text-muted">Ask or answer once to start a ring.</p>
          ) : (
            <ul className="space-y-3">
              {quests.map((q) => (
                <QuestRing key={q.id} title={q.title} progress={q.progress} target={q.target} />
              ))}
            </ul>
          )}
        </div>
        <div className="mt-8">
          <Link href="/communities" className="text-small font-semibold">
            Suggested rooms
          </Link>
          <ul className="mt-2 space-y-2">
            {rooms.map((room) => (
              <li key={room.id}>
                <Link href={`/c/${room.slug}`} className="text-small text-muted hover:text-accent">
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
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
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-2 text-[11px]",
                active ? "text-accent" : "text-muted",
              )}
            >
              <Icon size={22} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <FirstCreditBurst />
    </div>
  );
}
