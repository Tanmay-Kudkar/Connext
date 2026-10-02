"use client";

import { useAuth } from "@/components/providers/AuthProvider";

export function ModeToggle() {
  const { user, setMode } = useAuth();
  const mode = user?.mode === "pro" ? "pro" : "vibe";

  return (
    <div className="flex items-center rounded-xl hairline p-1" role="group" aria-label="Identity mode">
      <button
        type="button"
        className={`touch-target rounded-lg px-3 text-small font-semibold ${mode === "vibe" ? "surface" : "text-muted"}`}
        style={mode === "vibe" ? { background: "var(--text-primary)", color: "var(--bg)" } : undefined}
        aria-pressed={mode === "vibe"}
        onClick={() => setMode("vibe")}
      >
        Vibe
      </button>
      <button
        type="button"
        className={`touch-target rounded-lg px-3 text-small font-semibold ${mode === "pro" ? "surface" : "text-muted"}`}
        style={mode === "pro" ? { background: "var(--text-primary)", color: "var(--bg)" } : undefined}
        aria-pressed={mode === "pro"}
        onClick={() => setMode("pro")}
      >
        Pro
      </button>
    </div>
  );
}
