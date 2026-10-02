"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { PublicUser } from "@/lib/types";
import { clientApi } from "@/lib/api";

type AuthContextValue = {
  user: PublicUser | null;
  setUser: (user: PublicUser | null) => void;
  setMode: (mode: "vibe" | "pro") => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
  setMode: async () => {},
});

function applyMode(mode: string) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.mode = mode === "pro" ? "pro" : "vibe";
}

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: PublicUser | null;
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<PublicUser | null>(initialUser);

  const setUser = useCallback((next: PublicUser | null) => {
    setUserState(next);
    applyMode(next?.mode ?? "vibe");
  }, []);

  const setMode = useCallback(async (mode: "vibe" | "pro") => {
    const res = await clientApi<{ user: PublicUser }>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({ mode }),
    });
    setUser(res.user);
  }, [setUser]);

  const value = useMemo(() => ({ user, setUser, setMode }), [user, setUser, setMode]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
