"use client";

import Link from "next/link";
import {
    ArrowRight,
    Bell,
    BookOpen,
    Briefcase,
    ChevronRight,
    GraduationCap,
    MessageSquare,
    Plus,
    Search,
    Sparkles,
    Users,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/shared/ThemeToggle";
import RoleGuard from "@/components/auth/RoleGuard";

function FacultyDashboardContent() {
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
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p
                            className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"
                                }`}
                        >
                            Good morning 👋
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome back, Professor
                        </h1>

                        <p
                            className={`mt-2 max-w-2xl text-sm leading-6 ${isLight ? "text-gray-600" : "text-gray-400"
                                }`}
                        >
                            Mentor students, manage your academic community,
                            and contribute knowledge.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle variant="segmented" />

                        <button
                            aria-label="Search"
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${isLight
                                ? "border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-black"
                                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Search size={18} />
                        </button>

                        <button
                            aria-label="Notifications"
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${isLight
                                ? "border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-black"
                                : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Bell size={18} />
                        </button>
                    </div>
                </div>

                {/* Faculty Profile + Stats */}
                <div className="mt-8 grid gap-5 lg:grid-cols-3">

                    {/* Faculty Profile */}
                    <div
                        className={`rounded-3xl border p-6 lg:col-span-2 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black">
                                    AS
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold">
                                            Alex Sharma
                                        </h2>

                                        <span
                                            className={`rounded-full border px-2 py-1 text-[10px] ${isLight
                                                ? "border-gray-200 bg-gray-50 text-gray-500"
                                                : "border-white/10 bg-white/5 text-gray-400"
                                                }`}
                                        >
                                            Verified Faculty
                                        </span>
                                    </div>

                                    <p
                                        className={`mt-1 text-sm ${isLight
                                            ? "text-gray-600"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        Assistant Professor
                                    </p>

                                    <div
                                        className={`mt-2 flex flex-wrap items-center gap-3 text-xs ${isLight
                                            ? "text-gray-500"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1">
                                            <GraduationCap size={14} />
                                            ABC Institute of Technology
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <BookOpen size={14} />
                                            Computer Science
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/passport"
                                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${isLight
                                    ? "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    }`}
                            >
                                View Profile
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Contribution Score */}
                    <div
                        className={`rounded-3xl border p-6 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <p
                                className={`text-sm ${isLight
                                    ? "text-gray-500"
                                    : "text-gray-400"
                                    }`}
                            >
                                Academic Contribution
                            </p>

                            <Sparkles size={18} />
                        </div>

                        <div className="mt-4 flex items-end gap-2">
                            <span className="text-4xl font-bold">
                                245
                            </span>

                            <span className="pb-1 text-xs text-gray-500">
                                points
                            </span>
                        </div>

                        <div
                            className={`mt-5 h-1.5 overflow-hidden rounded-full ${isLight
                                ? "bg-gray-200"
                                : "bg-white/10"
                                }`}
                        >
                            <div
                                className={`h-full w-[78%] rounded-full ${isLight ? "bg-black" : "bg-white"
                                    }`}
                            />
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Your contribution to the academic community.
                        </p>
                    </div>
                </div>

                {/* Faculty Quick Actions */}
                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Faculty actions
                        </h2>

                        <span
                            className={`text-xs ${isLight
                                ? "text-gray-400"
                                : "text-gray-600"
                                }`}
                        >
                            Manage your academic activities
                        </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {[
                            {
                                icon: MessageSquare,
                                title: "Student Questions",
                                description:
                                    "Answer questions from students.",
                            },
                            {
                                icon: Users,
                                title: "Mentor Students",
                                description:
                                    "Connect with students who need guidance.",
                            },
                            {
                                icon: BookOpen,
                                title: "My Courses",
                                description:
                                    "Manage your courses and resources.",
                            },
                            {
                                icon: Briefcase,
                                title: "Research Projects",
                                description:
                                    "Manage projects and collaborators.",
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href="#"
                                    className={`group rounded-2xl border p-5 transition ${isLight
                                        ? "border-gray-200 bg-white hover:bg-gray-50"
                                        : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
                                        }`}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                                        <Icon size={19} />
                                    </div>

                                    <h3 className="mt-4 font-medium">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        {item.description}
                                    </p>

                                    <ArrowRight
                                        size={16}
                                        className="mt-4 transition group-hover:translate-x-1"
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Main Content */}
                <div className="mt-8 grid gap-5 lg:grid-cols-3">

                    {/* Student Questions */}
                    <section
                        className={`rounded-3xl border p-6 lg:col-span-2 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">
                                    Student questions
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Questions that may need your expertise
                                </p>
                            </div>

                            <Link
                                href="#"
                                className="text-xs text-gray-500 transition hover:text-black dark:hover:text-white"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-6 space-y-3">

                            {[
                                {
                                    title:
                                        "How does dependency injection work in Spring Boot?",
                                    category: "Java · Spring Boot",
                                    answers: "3 answers",
                                },
                                {
                                    title:
                                        "Best approach for designing a scalable REST API?",
                                    category: "Backend · Architecture",
                                    answers: "5 answers",
                                },
                                {
                                    title:
                                        "How should I structure my final year project?",
                                    category: "Projects · Guidance",
                                    answers: "2 answers",
                                },
                            ].map((question) => (
                                <div
                                    key={question.title}
                                    className={`rounded-2xl border p-4 transition ${isLight
                                        ? "border-gray-200 hover:bg-gray-50"
                                        : "border-white/10 hover:bg-white/[0.04]"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium">
                                                {question.title}
                                            </h3>

                                            <p className="mt-2 text-xs text-gray-500">
                                                {question.category}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {question.answers}
                                            </p>
                                        </div>

                                        <ChevronRight
                                            size={17}
                                            className="shrink-0 text-gray-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pending Activities */}
                    <section
                        className={`rounded-3xl border p-6 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">
                                    Pending activities
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Things that need your attention
                                </p>
                            </div>

                            <Bell size={17} />
                        </div>

                        <div className="mt-5 space-y-3">

                            {[
                                "Review student collaboration request",
                                "Approve research project invitation",
                                "Respond to student question",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className={`rounded-2xl border p-4 ${isLight
                                        ? "border-gray-200 bg-gray-50"
                                        : "border-white/10 bg-white/[0.03]"
                                        }`}
                                >
                                    <p className="text-sm">
                                        {item}
                                    </p>

                                    <button className="mt-3 text-xs font-medium text-gray-500 transition hover:text-black dark:hover:text-white">
                                        Review →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Faculty Contribution CTA */}
                <div
                    className={`mt-8 rounded-3xl border p-6 sm:p-8 ${isLight
                        ? "border-gray-200 bg-white"
                        : "border-white/10 bg-white/[0.04]"
                        }`}
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} />

                                <h2 className="font-semibold">
                                    Share knowledge. Mentor. Contribute.
                                </h2>
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                Help students learn, collaborate with researchers,
                                and strengthen your academic reputation through
                                meaningful contributions.
                            </p>
                        </div>

                        <Link
                            href="#"
                            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${isLight
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-white text-black hover:bg-gray-200"
                                }`}
                        >
                            Start contributing
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function FacultyDashboardPage() {
    return (
        <RoleGuard allowedRole="faculty">
            <FacultyDashboardContent />
        </RoleGuard>
    );
}