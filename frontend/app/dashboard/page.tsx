"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Bell,
    BookOpen,
    Briefcase,
    ChevronRight,
    CircleHelp,
    GitBranch,
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

type AcademicProfile = {
    name?: string;
    role?: "student" | "faculty" | "researcher" | "mentor";
    institution?: string;
    course?: string;
    year?: string;
    location?: string;
};

function StudentDashboardContent() {
    const { isLight } = useTheme();

    const [profile, setProfile] = useState<AcademicProfile>({
        name: "User",
        institution: "Your Institution",
        course: "Computer Science",
        year: "Student",
    });

    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem(
                "connextAcademicProfile"
            );

            if (storedProfile) {
                const parsedProfile: AcademicProfile =
                    JSON.parse(storedProfile);

                setProfile(parsedProfile);
            }
        } catch (error) {
            console.error(
                "Unable to load academic profile:",
                error
            );
        }
    }, []);

    const userName = profile.name || "User";
    const institution =
        profile.institution || "Your Institution";
    const course = profile.course || "Computer Science";
    const academicYear = profile.year || "Student";

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

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
                        <p className="text-sm text-gray-500">
                            Good morning 👋
                        </p>

                        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                            Welcome to Connext
                        </h1>

                        <p
                            className={`mt-2 max-w-2xl text-sm leading-6 ${isLight
                                ? "text-gray-600"
                                : "text-gray-400"
                                }`}
                        >
                            Connect, learn, contribute, and build your
                            academic reputation.
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

                {/* Profile + Score */}
                <div className="mt-8 grid gap-5 lg:grid-cols-3">

                    {/* Profile Card */}
                    <div
                        className={`rounded-3xl border p-6 lg:col-span-2 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                                {/* Dynamic Initials */}
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black">
                                    {initials || "U"}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2">

                                        {/* Dynamic Name */}
                                        <h2 className="text-lg font-semibold">
                                            {userName}
                                        </h2>

                                        <span
                                            className={`rounded-full border px-2 py-1 text-[10px] ${isLight
                                                ? "border-gray-200 bg-gray-50 text-gray-500"
                                                : "border-white/10 bg-white/5 text-gray-400"
                                                }`}
                                        >
                                            Verified
                                        </span>
                                    </div>

                                    <p
                                        className={`mt-1 text-sm ${isLight
                                            ? "text-gray-600"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        Computer Science Engineering Student
                                    </p>

                                    <div
                                        className={`mt-2 flex flex-wrap items-center gap-3 text-xs ${isLight
                                            ? "text-gray-500"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1">
                                            <GraduationCap size={14} />
                                            {institution}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <GitBranch size={14} />
                                            {academicYear}
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
                                View Passport
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
                                Contribution Score
                            </p>

                            <Sparkles size={18} />
                        </div>

                        <div className="mt-4 flex items-end gap-2">
                            <span className="text-4xl font-bold">
                                165
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
                                className={`h-full w-[66%] rounded-full ${isLight ? "bg-black" : "bg-white"
                                    }`}
                            />
                        </div>

                        <p className="mt-3 text-xs text-gray-500">
                            Keep contributing to increase your reputation.
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <section className="mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Quick actions
                        </h2>

                        <span
                            className={`text-xs ${isLight
                                ? "text-gray-400"
                                : "text-gray-600"
                                }`}
                        >
                            Get things done faster
                        </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: CircleHelp,
                                title: "Ask a Question",
                                description:
                                    "Ask the community without fear.",
                            },
                            {
                                icon: Users,
                                title: "Find Collaborators",
                                description:
                                    "Find people with matching skills.",
                            },
                            {
                                icon: BookOpen,
                                title: "Explore Communities",
                                description:
                                    "Discover academic communities.",
                            },
                            {
                                icon: GraduationCap,
                                title: "Edit Passport",
                                description:
                                    "Update your academic identity.",
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={
                                        item.title === "Edit Passport"
                                            ? "/passport"
                                            : "#"
                                    }
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

                    {/* Recent Activity */}
                    <section
                        className={`rounded-3xl border p-6 lg:col-span-2 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">
                                    Recent activity
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Your latest contributions
                                </p>
                            </div>

                            <Link
                                href="#"
                                className="text-xs text-gray-500 transition hover:text-black dark:hover:text-white"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="mt-6 space-y-1">
                            {[
                                {
                                    icon: MessageSquare,
                                    title:
                                        "Answered a question in Computer Science",
                                    info:
                                        "2 hours ago · +10 contribution points",
                                },
                                {
                                    icon: Briefcase,
                                    title:
                                        "Added a new project to your Passport",
                                    info: "Yesterday · TradeOS",
                                },
                                {
                                    icon: Users,
                                    title:
                                        "Connected with a new collaborator",
                                    info: "2 days ago",
                                },
                            ].map((activity) => {
                                const Icon = activity.icon;

                                return (
                                    <div
                                        key={activity.title}
                                        className={`flex items-center gap-4 rounded-2xl p-3 transition ${isLight
                                            ? "hover:bg-gray-50"
                                            : "hover:bg-white/[0.04]"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isLight
                                                ? "bg-gray-100"
                                                : "bg-white/10"
                                                }`}
                                        >
                                            <Icon size={17} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm">
                                                {activity.title}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {activity.info}
                                            </p>
                                        </div>

                                        <ChevronRight
                                            size={16}
                                            className="text-gray-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Recommended */}
                    <section
                        className={`rounded-3xl border p-6 ${isLight
                            ? "border-gray-200 bg-white"
                            : "border-white/10 bg-white/[0.04]"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">
                                    Recommended
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Based on your interests
                                </p>
                            </div>

                            <Sparkles size={17} />
                        </div>

                        <div className="mt-5 space-y-3">
                            {[
                                {
                                    initials: "RV",
                                    name: "Rahul Verma",
                                    skills: "React · TypeScript",
                                },
                                {
                                    initials: "MS",
                                    name: "Meera Shah",
                                    skills: "AI · Python · Research",
                                },
                            ].map((person) => (
                                <div
                                    key={person.name}
                                    className={`rounded-2xl border p-4 ${isLight
                                        ? "border-gray-200 bg-gray-50"
                                        : "border-white/10 bg-white/[0.03]"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-xs font-bold text-white">
                                            {person.initials}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                {person.name}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                {person.skills}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border py-2 text-xs transition ${isLight
                                            ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                                            : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                                            }`}
                                    >
                                        Connect
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Bottom CTA */}
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
                                    Build your reputation through contribution
                                </h2>
                            </div>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                                Every useful answer, project, collaboration,
                                and verified contribution helps strengthen
                                your academic identity.
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

export default function DashboardPage() {
    return (
        <RoleGuard allowedRole="student">
            <StudentDashboardContent />
        </RoleGuard>
    );
}