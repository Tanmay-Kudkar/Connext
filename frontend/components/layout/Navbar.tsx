"use client";

import { Bell, LogOut, User, Search, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getMe, logout } from "@/lib/api";
import type { PublicUser } from "@/lib/api";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    const fetchUser = useCallback(async () => {
        try {
            const { user } = await getMe();
            setUser(user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            setUser(null);
            // Clear all session data
            sessionStorage.clear();
            // Optional: clear cookies manually if next.js allows, but usually we just redirect
            document.cookie = "gh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/login");
            setLoggingOut(false);
        }
    };

    return (
        <header className="flex min-h-16 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur-xl sm:px-6">
            {/* Logo */}
            <Link href={user ? "/passport" : "/"} className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                    🚀
                </div>
                <span className="text-lg font-semibold tracking-tight text-white">
                    Connext
                </span>
            </Link>

            {/* Search - Desktop */}
            <div className="hidden w-full max-w-md md:flex">
                <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
                    <Search size={18} />
                    <span>Search Connext...</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
                {!loading && (
                    <>
                        {user ? (
                            <>
                                {/* Vibe / Pro mode */}
                                <button className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 sm:block">
                                    ⚡ {user.mode === "pro" ? "Pro" : "Vibe"}
                                </button>

                                {/* Notifications */}
                                <button
                                    aria-label="Notifications"
                                    className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                                >
                                    <Bell size={20} />
                                </button>

                                {/* Profile avatar */}
                                <Link
                                    href="/passport"
                                    aria-label="Profile"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black text-xs font-bold transition hover:opacity-80"
                                    title={user.displayName}
                                >
                                    {user.initials}
                                </Link>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    aria-label="Logout"
                                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">
                                        {loggingOut ? "Logging out…" : "Logout"}
                                    </span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </>
                )}

                {/* Mobile Menu */}
                <button
                    aria-label="Open menu"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white md:hidden"
                >
                    <Menu size={21} />
                </button>
            </div>
        </header>
    );
}