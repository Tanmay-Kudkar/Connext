"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { ModeToggle } from "@/components/shell/ModeToggle";
import { Avatar } from "@/components/shell/Avatar";
import { clientApi } from "@/lib/api";

type Passport = {
  completion: number;
  linkedin: {
    headline: string;
    experience: { title: string; org: string; years: string }[];
    skills: string[];
  } | null;
  researchgate: {
    papers: { title: string; year: string; citations: number; venue?: string }[];
  } | null;
};

export default function PassportPage() {
  const { user } = useAuth();
  const [passport, setPassport] = useState<Passport | null>(null);
  const pro = user?.mode === "pro";

  useEffect(() => {
    clientApi<Passport>("/api/passport/me").then(setPassport);
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <Avatar initials={user.initials} size={56} />
          <div>
            <h1 className="text-display">{user.displayName}</h1>
            <p className="text-muted">
              @{user.handle} · {user.institution?.short} · {user.role}
            </p>
            {user.bio && <p className="mt-2">{user.bio}</p>}
          </div>
        </div>
        <ModeToggle />
      </header>

      <p className="text-small text-muted">Academic Passport {passport?.completion ?? 0}% complete</p>

      {pro ? (
        <section className="space-y-4">
          <h2 className="text-title">Curriculum vitae</h2>
          <p className="text-small text-muted">
            {user.institution?.name}, {user.institution?.city}. Department credentials and simulated publications.
          </p>
          {passport?.linkedin && (
            <div>
              <h3 className="font-semibold">{passport.linkedin.headline}</h3>
              <ul className="mt-2 space-y-1 text-small">
                {passport.linkedin.experience.map((x) => (
                  <li key={x.org}>
                    {x.title} · {x.org} · {x.years}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {passport?.researchgate && (
            <div>
              <h3 className="font-semibold">Papers</h3>
              <ul className="mt-2 space-y-1 text-small">
                {passport.researchgate.papers.map((p) => (
                  <li key={p.title}>
                    {p.title} ({p.year}) · {p.citations} citations
                    {p.venue ? ` · ${p.venue}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : (
        <section>
          <h2 className="text-title">Skills and rooms</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {user.skills.map((s) => (
              <span key={s} className="chip" style={{ pointerEvents: "none" }}>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-title">Integrations</h2>
        <p className="text-small text-muted">Simulated portals only. No live LinkedIn or ResearchGate APIs.</p>
        <Link href="/mock/linkedin" className="btn-ghost hairline inline-flex">
          {passport?.linkedin ? "LinkedIn connected" : "Connect LinkedIn (demo)"}
        </Link>
        <Link href="/mock/researchgate" className="btn-ghost hairline ml-2 inline-flex">
          {passport?.researchgate ? "ResearchGate connected" : "Connect ResearchGate (demo)"}
        </Link>
      </section>
    </div>
  );
}
