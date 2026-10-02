"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PublicUser } from "@/lib/types";
import { clientApi } from "@/lib/api";

export type ThemePref = "light" | "dark" | "system";

type AuthContextValue = {
  user: PublicUser | null;
  setUser: (user: PublicUser | null) => void;
  setMode: (mode: "vibe" | "pro") => Promise<void>;
  setAccent: (accent: string) => Promise<void>;
  setAvatarPack: (avatarPack: string) => Promise<void>;
  theme: ThemePref;
  setTheme: (theme: ThemePref) => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  setMode: async () => {},
  setAccent: async () => {},
  setAvatarPack: async () => {},
  theme: "system",
  setTheme: () => {},
});

function applyModeAndAccent(user: PublicUser | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const mode = user?.mode === "pro" ? "pro" : "vibe";
  root.dataset.mode = mode;
  if (mode === "vibe" && user?.accent) {
    root.style.setProperty("--accent", user.accent);
    root.style.setProperty("--accent-dim", `${user.accent}22`);
  } else {
    root.style.removeProperty("--accent");
    root.style.removeProperty("--accent-dim");
  }
}

function applyTheme(theme: ThemePref) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
    root.classList.toggle("dark", window.matchMedia("(prefers-color-scheme: dark)").matches);
  } else if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.setAttribute("data-theme", "light");
    root.classList.remove("dark");
  }
}

export const ACCENTS = ["#FF4B2B", "#65A30D", "#111111"];

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: PublicUser | null;
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<PublicUser | null>(initialUser);
  const [theme, setThemeState] = useState<ThemePref>("system");

  useEffect(() => {
    applyModeAndAccent(initialUser);
    const stored = window.localStorage.getItem("connext-theme") as ThemePref | null;
    const next = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    setThemeState(next);
    applyTheme(next);
  }, [initialUser]);

  const setUser = useCallback((next: PublicUser | null) => {
    setUserState(next);
    applyModeAndAccent(next);
  }, []);

  const setMode = useCallback(
    async (mode: "vibe" | "pro") => {
      const res = await clientApi<{ user: PublicUser }>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ mode }),
      });
      setUser(res.user);
    },
    [setUser],
  );

  const setAccent = useCallback(
    async (accent: string) => {
      const res = await clientApi<{ user: PublicUser }>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ accent }),
      });
      setUser(res.user);
    },
    [setUser],
  );

  const setAvatarPack = useCallback(
    async (avatarPack: string) => {
      const res = await clientApi<{ user: PublicUser }>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({ avatarPack }),
      });
      setUser(res.user);
    },
    [setUser],
  );

  const setTheme = useCallback((next: ThemePref) => {
    setThemeState(next);
    window.localStorage.setItem("connext-theme", next);
    applyTheme(next);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, setMode, setAccent, setAvatarPack, theme, setTheme }),
    [user, setUser, setMode, setAccent, setAvatarPack, theme, setTheme],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
