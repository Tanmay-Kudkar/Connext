import { Bell, Search, User } from "lucide-react";

export default function Navbar() {
    return (
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/80 px-6 backdrop-blur-xl">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
                    🚀
                </div>

                <span className="text-lg font-semibold tracking-tight text-white">
                    Connext
                </span>
            </div>

            {/* Search */}
            <div className="hidden w-full max-w-md md:flex">
                <div className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
                    <Search size={18} />
                    <span>Search Connext...</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Vibe / Pro */}
                <button className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10">
                    ⚡ Vibe
                </button>

                {/* Notifications */}
                <button className="rounded-xl p-2 text-gray-400 transition hover:bg-white/10 hover:text-white">
                    <Bell size={20} />
                </button>

                {/* Profile */}
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20">
                    <User size={18} />
                </button>
            </div>
        </header>
    );
}