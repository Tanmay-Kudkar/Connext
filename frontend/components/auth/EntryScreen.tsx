"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clientApi } from "@/lib/api";
import type { PublicUser } from "@/lib/types";
import { useAuth } from "@/components/providers/AuthProvider";

const AVATARS = [
  { id: "initials", label: "Initials" },
  { id: "orbit", label: "Orbit" },
  { id: "glyph", label: "Glyph" },
  { id: "mono", label: "Mono" },
];

export function EntryScreen() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [step, setStep] = useState<"email" | "otp" | "face">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [handle, setHandle] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [mode, setMode] = useState<"vibe" | "pro">("vibe");
  const [avatarPack, setAvatarPack] = useState("initials");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await clientApi<{ message: string; demoOtp?: string }>("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setHint(res.demoOtp ? `Demo OTP: ${res.demoOtp}` : res.message);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function verify(payload: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const res = await clientApi<{ needsOnboarding: boolean; user?: PublicUser }>("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (res.needsOnboarding) {
        setStep("face");
        return;
      }
      if (res.user) setUser(res.user);
      if (payload.handle) {
        router.push("/onboard");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setBusy(false);
    }
  }

  async function demo(as: "student" | "faculty") {
    setBusy(true);
    setError("");
    try {
      const res = await clientApi<{ user: PublicUser }>("/api/auth/demo", {
        method: "POST",
        body: JSON.stringify({ as }),
      });
      setUser(res.user);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-16">
      <p className="text-small text-muted">Connext</p>
      <h1 className="mt-3 text-display">Ask without fear.</h1>
      <p className="mt-2 text-muted">Verified by college email. You can still post anonymously.</p>

      {step === "email" && (
        <form className="mt-8 space-y-4" onSubmit={requestOtp}>
          <label className="block text-small font-semibold" htmlFor="email">
            College email
          </label>
          <input
            id="email"
            className="input-base"
            type="email"
            required
            placeholder="you@xie.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            Continue with college email
          </button>
        </form>
      )}

      {step === "otp" && (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void verify({ email, otp });
          }}
        >
          <p className="text-small text-muted">{hint}</p>
          <label className="block text-small font-semibold" htmlFor="otp">
            One-time code
          </label>
          <input
            id="otp"
            className="input-base"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            Verify
          </button>
        </form>
      )}

      {step === "face" && (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void verify({ email, otp, handle, displayName, mode, avatarPack });
          }}
        >
          <p className="text-small">Pick how you show up. You can switch Vibe and Pro later.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`hairline p-4 text-left ${mode === "vibe" ? "chip selected" : ""}`}
              style={{ borderRadius: "1.25rem" }}
              onClick={() => setMode("vibe")}
            >
              <div className="font-semibold">Vibe</div>
              <div className="text-small text-muted">Campus, streaks, rooms</div>
            </button>
            <button
              type="button"
              className={`hairline p-4 text-left ${mode === "pro" ? "chip selected" : ""}`}
              style={{ borderRadius: "0.5rem" }}
              onClick={() => setMode("pro")}
            >
              <div className="font-semibold">Pro</div>
              <div className="text-small text-muted">CV, papers, faculty</div>
            </button>
          </div>
          <input
            className="input-base"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
          />
          <input
            className="input-base"
            placeholder="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required
            minLength={2}
          />
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`chip ${avatarPack === a.id ? "selected" : ""}`}
                onClick={() => setAvatarPack(a.id)}
              >
                {a.label}
              </button>
            ))}
          </div>
          <button className="btn-primary w-full" type="submit" disabled={busy}>
            Enter Connext
          </button>
        </form>
      )}

      {error && (
        <p className="mt-4 text-small" role="alert" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}

      <div className="mt-10 space-y-2">
        <p className="text-small text-muted">Demo logins (development)</p>
        <button className="btn-ghost w-full justify-center hairline" type="button" onClick={() => demo("student")} disabled={busy}>
          Demo as student
        </button>
        <button className="btn-ghost w-full justify-center hairline" type="button" onClick={() => demo("faculty")} disabled={busy}>
          Demo as faculty
        </button>
      </div>
    </main>
  );
}
