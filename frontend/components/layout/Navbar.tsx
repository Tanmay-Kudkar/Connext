"use client";

import Link from "next/link";
import { Bell, Menu, Search, User } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 flex min-h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-4 backdrop-blur-xl transition-colors duration-200 dark:border-white/10 dark:bg-black/80 sm:px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-white dark:text-black">
                    🚀
                </div>

                <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    Connext
                </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden items-center gap-6 lg:flex">
                <Link
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                    Dashboard
                </Link>
                <Link
                    href="/community"
                    className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                    Community
                </Link>
                <Link
                    href="/passport"
                    className="text-sm font-medium text-gray-600 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                    Passport
                </Link>
            </nav>

            {/* Search - Desktop */}
            <div className="hidden w-full max-w-xs md:flex lg:max-w-sm">
                <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-100/70 px-4 py-2 text-sm text-gray-500 transition focus-within:border-gray-300 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:focus-within:border-white/20">
                    <Search size={18} />
                    <span>Search Connext...</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
                {/* Theme Toggle Button - switches theme from any page! */}
                <ThemeToggle />

                {/* Vibe / Pro */}
                <button className="hidden rounded-xl border border-gray-200 bg-gray-100/70 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-200/80 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 sm:block">
                    ⚡ Vibe
                </button>

                {/* Notifications */}
                <button
                    aria-label="Notifications"
                    className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                    <Bell size={20} />
                </button>

                {/* Profile */}
                <Link
                    href="/passport"
                    aria-label="Profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 dark:border-transparent dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
                >
                    <User size={18} />
                </Link>

                {/* Mobile Menu */}
                <button
                    aria-label="Open menu"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-black dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white md:hidden"
                >
                    <Menu size={21} />
                </button>
            </div>
        </header>
    );
}