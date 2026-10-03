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

    /** True while the current session is being resolved */
    loading: boolean;

    /** True if the user is logged in */
    isAuthenticated: boolean;

    /** True when role === faculty */
    isFaculty: boolean;

    /** True when role === student */
    isStudent: boolean;

    /** Refresh the current authenticated user */
    refreshUser: () => Promise<void>;

    /** Start Google OAuth login */
    loginWithGoogle: () => void;

    /** Log the user out */
    logout: () => Promise<void>;
}

// ─── API ──────────────────────────────────────────────────────────────────────

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ─── Fetch Current User ───────────────────────────────────────────────────────

async function fetchMe(): Promise<AuthUser | null> {
    try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
            credentials: "include",
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();

        return (data.user as AuthUser) ?? null;
    } catch {
        return null;
    }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // ── Refresh User ─────────────────────────────────────────────────────────

    const refreshUser = useCallback(async () => {
        setLoading(true);

        const me = await fetchMe();

        setUser(me);
        setLoading(false);
    }, []);

    // ── Check Existing Session ───────────────────────────────────────────────

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    // ── Google Login ─────────────────────────────────────────────────────────

    const loginWithGoogle = useCallback(() => {
        /*
         * Redirect the browser to the backend Google OAuth endpoint.
         *
         * The backend is responsible for:
         * 1. Redirecting the user to Google
         * 2. Handling Google's callback
         * 3. Creating the authenticated session cookie
         * 4. Redirecting the user back to the frontend
         *
         * Once the frontend loads again, /api/auth/me will
         * restore the authenticated user.
         */
        window.location.href = `${API_BASE}/api/auth/google`;
    }, []);

    // ── Logout ───────────────────────────────────────────────────────────────

    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch {
            // Ignore network errors during logout
        }

        setUser(null);
    }, []);

    // ── Context Value ─────────────────────────────────────────────────────────

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: user !== null,
        isFaculty: user?.role === "faculty",
        isStudent: user?.role === "student",
        refreshUser,
        loginWithGoogle,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);

    if (!ctx) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return ctx;
}