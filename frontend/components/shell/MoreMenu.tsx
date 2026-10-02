"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, MoreHorizontal } from "lucide-react";
import { ACCENTS, useAuth, type ThemePref } from "@/components/providers/AuthProvider";
import { ModeToggle } from "@/components/shell/ModeToggle";
import { clientApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const THEMES: { id: ThemePref; label: string }[] = [
  { id: "system", label: "System" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export function MoreMenu({ placement = "top" }: { placement?: "top" | "bottom" }) {
  const { user, setAccent, theme, setTheme } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const vibe = user?.mode !== "pro";

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function logout() {
    await clientApi("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="nav-item w-full justify-center min-[1100px]:justify-start"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="More"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal size={20} strokeWidth={1.5} />
        <span className="hidden min-[1100px]:inline">More</span>
      </button>
      {open && (
        <div
          className={cn(
            "absolute left-0 z-30 w-56 hairline surface p-3",
            placement === "top" ? "bottom-12" : "top-12 right-0 left-auto",
          )}
          style={{ borderRadius: "var(--radius)" }}
          role="menu"
        >
          <div className="mb-3">
            <div className="mb-2 text-small font-semibold">Identity</div>
            <ModeToggle />
          </div>
          <div className="mb-3">
            <div className="mb-2 text-small font-semibold">Theme</div>
            <div className="flex flex-wrap gap-1">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={cn("chip", theme === t.id && "selected")}
                  onClick={() => setTheme(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {vibe && (
            <div className="mb-3">
              <div className="mb-2 text-small font-semibold">Accent</div>
              <div className="flex gap-2">
                {ACCENTS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Accent ${color}`}
                    className="h-8 w-8 rounded-full hairline"
                    style={{
                      background: color,
                      outline: user?.accent === color ? "2px solid var(--text-primary)" : undefined,
                      outlineOffset: 2,
                    }}
                    onClick={() => void setAccent(color)}
                  />
                ))}
              </div>
            </div>
          )}
          <button type="button" className="btn-ghost w-full justify-start" onClick={() => void logout()}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
