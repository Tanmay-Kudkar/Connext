import { Bell, Menu, Search, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="flex min-h-16 items-center justify-between border-b border-white/10 bg-black/80 px-4 backdrop-blur-xl sm:px-6 sticky top-0 z-50">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
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
                    <Search size={18} aria-hidden />
                    <span>Search Connext...</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">

                {/* Vibe / Pro */}
                <button className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 sm:block">
                    ⚡ Vibe
                </button>

                {/* Nav links */}
                <Link href="/communities" className="hidden text-sm text-gray-400 transition hover:text-white sm:block px-2">
                    Communities
                </Link>
                <Link href="/activity" className="hidden text-sm text-gray-400 transition hover:text-white sm:block px-2">
                    Dashboard
                </Link>
                <Link href="/ask" className="hidden rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 sm:block">
                    Ask →
                </Link>

                {/* Notifications */}
                <button
                    aria-label="Notifications"
                    className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                    <Bell size={20} aria-hidden />
                </button>

                {/* Profile */}
                <button
                    aria-label="Profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20"
                >
                    <User size={18} aria-hidden />
                </button>

                {/* Mobile Menu */}
                <button
                    aria-label="Open menu"
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-white/10 hover:text-white md:hidden"
                >
                    <Menu size={21} aria-hidden />
                </button>
            </div>
        </header>
    );
}