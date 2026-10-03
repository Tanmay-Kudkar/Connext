"use client";

import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    ChevronRight,
    Code2,
    Database,
    Globe,
    Lock,
    Plus,
    Search,
    Shield,
    Sparkles,
    Users,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/shared/ThemeToggle";

const communities = [
    {
        name: "Computer Science",
        description:
            "Discuss programming, algorithms, systems, and core CS topics.",
        members: "12.4K",
        icon: Code2,
    },
    {
        name: "Artificial Intelligence",
        description:
            "Explore AI, machine learning, LLMs, and research.",
        members: "9.8K",
        icon: Sparkles,
    },
    {
        name: "Web Development",
        description:
            "Build and discuss modern websites and applications.",
        members: "8.6K",
        icon: Globe,
    },
    {
        name: "Data Science",
        description:
            "Statistics, analytics, Python, visualization, and data.",
        members: "7.2K",
        icon: Database,
    },
    {
        name: "Cyber Security",
        description:
            "Learn security, ethical hacking, networks, and privacy.",
        members: "6.4K",
        icon: Shield,
    },
    {
        name: "Research",
        description:
            "Connect with researchers and discuss academic work.",
        members: "5.9K",
        icon: BookOpen,
    },
];

const joinedCommunities = [
    {
        name: "Computer Science",
        members: "12.4K members",
        icon: Code2,
    },
    {
        name: "Web Development",
        members: "8.6K members",
        icon: Globe,
    },
];

export default function CommunityPage() {
    const { isLight } = useTheme();

    return (
        <main
            className={`min-h-[calc(100vh-64px)] px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 ${isLight
                ? "bg-gray-50 text-gray-900"
                : "bg-black text-white"
                }`}
        >
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <div
                            className={`mb-3 flex items-center gap-2 text-xs ${isLight ? "text-gray-500" : "text-gray-500"
                                }`}
                        >
                            <Link
                                href="/dashboard"
                                className="transition hover:text-black dark:hover:text-white"
                            >
                                Dashboard
                            </Link>

                            <ChevronRight size={14} />

                            <span>Community</span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Explore Communities
                        </h1>

                        <p
                            className={`mt-2 max-w-2xl text-sm leading-6 ${isLight ? "text-gray-600" : "text-gray-400"
                                }`}
                        >
                            Find people who share your academic interests, ask questions,
                            exchange knowledge, and build meaningful connections.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {/* Theme Toggle */}
                        <ThemeToggle variant="segmented" />

                        {/* Create Community */}
                        <Link
                            href="#"
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${isLight
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            <Plus size={17} />
                            Create Community
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="mt-8">
                    <div className="relative max-w-2xl">
                        <Search
                            size={19}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 ${isLight ? "text-gray-400" : "text-gray-500"
                                }`}
                        />

                        <input
                            type="text"
                            placeholder="Search communities..."
                            className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm outline-none transition ${isLight
                                ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-gray-400"
                                : "border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                }`}
                        />
                    </div>
                </div>

                {/* Your Communities */}
                <section className="mt-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Your Communities
                            </h2>

                            <p
                                className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-500"
                                    }`}
                            >
                                Communities you are already part of
                            </p>
                        </div>

                        <span className="text-xs text-gray-500">
                            {joinedCommunities.length} joined
                        </span>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {joinedCommunities.map((community) => {
                            const Icon = community.icon;

                            return (
                                <Link
                                    key={community.name}
                                    href="#"
                                    className={`group rounded-2xl border p-5 transition ${isLight
                                        ? "border-gray-200 bg-white hover:bg-gray-100"
                                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${isLight
                                                    ? "bg-black text-white"
                                                    : "bg-white text-black"
                                                    }`}
                                            >
                                                <Icon size={20} />
                                            </div>

                                            <div>
                                                <h3 className="font-medium">
                                                    {community.name}
                                                </h3>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {community.members}
                                                </p>
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className="text-gray-500 transition group-hover:translate-x-1"
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Popular Communities */}
                <section className="mt-10">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Popular Communities
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Explore active academic communities
                        </p>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {communities.map((community) => {
                            const Icon = community.icon;

                            return (
                                <div
                                    key={community.name}
                                    className={`rounded-2xl border p-5 transition ${isLight
                                        ? "border-gray-200 bg-white hover:bg-gray-50"
                                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${isLight
                                                ? "bg-black text-white"
                                                : "bg-white text-black"
                                                }`}
                                        >
                                            <Icon size={20} />
                                        </div>

                                        <span
                                            className={`rounded-full border px-2.5 py-1 text-[10px] ${isLight
                                                ? "border-gray-200 bg-gray-50 text-gray-500"
                                                : "border-white/10 bg-white/5 text-gray-400"
                                                }`}
                                        >
                                            Active
                                        </span>
                                    </div>

                                    <h3 className="mt-5 font-semibold">
                                        {community.name}
                                    </h3>

                                    <p
                                        className={`mt-2 min-h-10 text-xs leading-5 ${isLight ? "text-gray-500" : "text-gray-500"
                                            }`}
                                    >
                                        {community.description}
                                    </p>

                                    <div
                                        className={`mt-5 flex items-center justify-between border-t pt-4 ${isLight
                                            ? "border-gray-200"
                                            : "border-white/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Users size={14} />
                                            {community.members}
                                        </div>

                                        <button
                                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition ${isLight
                                                ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                                                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                                }`}
                                        >
                                            Join
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Find Collaborators */}
                <section
                    className={`mt-10 rounded-3xl border p-6 sm:p-8 ${isLight
                        ? "border-gray-200 bg-white"
                        : "border-white/10 bg-white/[0.04]"
                        }`}
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isLight
                                    ? "bg-black text-white"
                                    : "bg-white text-black"
                                    }`}
                            >
                                <Users size={20} />
                            </div>

                            <div>
                                <h2 className="font-semibold">
                                    Looking for the right people?
                                </h2>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                    Discover students, researchers, faculty, and mentors based
                                    on your skills and interests.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="#"
                            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition ${isLight
                                ? "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                }`}
                        >
                            Find Collaborators
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* Bottom CTA */}
                <div
                    className={`mt-8 flex flex-col items-center justify-center rounded-3xl border px-6 py-10 text-center ${isLight
                        ? "border-gray-200 bg-white"
                        : "border-white/10 bg-white/[0.03]"
                        }`}
                >
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isLight
                            ? "bg-black text-white"
                            : "bg-white text-black"
                            }`}
                    >
                        <Lock size={20} />
                    </div>

                    <h2 className="mt-5 text-xl font-semibold">
                        Ask without fear
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                        Join a community, ask your questions, and learn from people
                        who have already solved similar problems.
                    </p>

                    <Link
                        href="#"
                        className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${isLight
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-black hover:bg-gray-200"
                            }`}
                    >
                        Ask a Question
                        <ArrowRight size={16} />
                    </Link>
                </div>

            </div>
        </main>
    );
}