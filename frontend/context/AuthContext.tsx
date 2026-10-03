"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "student" | "faculty";

export interface AuthUser {
    id: string;
    handle: string;
    displayName: string;
    initials: string;
    role: UserRole;
    mode: string;
    accent: string;
    avatarPack: string;
    bio: string | null;
    skills: string[];
    interests: string[];
    institution: {
        id: string;
        name: string;
        short: string;
        city: string;
        state: string;
    } | null;
}

interface AuthContextType {
    /** The authenticated user, or null if not logged in */
    user: AuthUser | null;
    /** True while the initial /api/auth/me fetch is in-flight */
    loading: boolean;
    /** True if the user is logged in */
    isAuthenticated: boolean;
    /** Shorthand: true when role === "faculty" */
    isFaculty: boolean;
    /** Shorthand: true when role === "student" */
    isStudent: boolean;
    /** Call after a successful login to refresh the user from the server */
    refreshUser: () => Promise<void>;
    /** Call to log the user out (hits /api/auth/logout) */
    logout: () => Promise<void>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function fetchMe(): Promise<AuthUser | null> {
    try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            credentials: "include", // send the httpOnly session cookie
        });
        if (!res.ok) return null;
        const data = await res.json();
        return (data.user as AuthUser) ?? null;
    } catch {
        return null;
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        setLoading(true);
        const me = await fetchMe();
        setUser(me);
        setLoading(false);
    }, []);

    // Fetch the current user on first render (reads the session cookie)
    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // ignore network errors on logout
        }
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: user !== null,
        isFaculty: user?.role === "faculty",
        isStudent: user?.role === "student",
        refreshUser,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
