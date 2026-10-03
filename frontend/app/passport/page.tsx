"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeCheck,
    BookOpen,
    Briefcase,
    CheckCircle2,
    GitBranch,
    GraduationCap,
    MapPin,
    Pencil,
    Sparkles,
} from "lucide-react";

import ModeToggle from "@/components/shared/ModeToggle";

type AcademicProfile = {
    name?: string;
    role?: "student" | "faculty" | "researcher" | "mentor";
    institution?: string;
    course?: string;
    year?: string;
    department?: string;
    designation?: string;
    researchArea?: string;
    organization?: string;
    expertise?: string;
    experience?: string;
    location?: string;
};

export default function PassportPage() {
    const [profile, setProfile] = useState<AcademicProfile>({
        name: "User",
        role: "student",
        institution: "Your Institution",
        course: "Computer Science",
        year: "Student",
        department: "",
        designation: "",
        location: "India",
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

    const name = profile.name || "User";
    const role = profile.role || "student";
    const institution =
        profile.institution ||
        profile.organization ||
        "Your Institution";

    const location = profile.location || "India";

    const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    // ── Role-specific information ─────────────────────────────────────────────

    const getRoleTitle = () => {
        switch (role) {
            case "faculty":
                return profile.designation || "Faculty Member";

            case "researcher":
                return "Researcher";

            case "mentor":
                return "Mentor";

            default:
                return "Computer Science Engineering Student";
        }
    };

    const roleTitle = getRoleTitle();

    // ── Education / Academic Information ──────────────────────────────────────

    const getAcademicTitle = () => {
        switch (role) {
            case "faculty":
                return "Faculty Profile";

            case "researcher":
                return "Research Profile";

            case "mentor":
                return "Mentor Profile";

            default:
                return "Education";
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-10">
                    <p className="text-sm text-gray-400">
                        Academic Identity
                    </p>

                    <h1 className="mt-2 text-4xl font-bold tracking-tight">
                        Academic Passport
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-400">
                        Your verified academic identity, skills, projects,
                        achievements, and contributions — all in one place.
                    </p>
                </div>

                {/* Profile Header */}
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* Identity */}
                        <div className="flex items-center gap-5">

                            {/* Dynamic Initials */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-black">
                                {initials || "U"}
                            </div>

                            <div>

                                <div className="flex flex-wrap items-center gap-2">

                                    {/* Dynamic Name */}
                                    <h2 className="text-2xl font-bold">
                                        {name}
                                    </h2>

                                    <BadgeCheck
                                        size={21}
                                        className="text-blue-400"
                                    />

                                </div>

                                {/* Dynamic Role */}
                                <p className="mt-2 text-base text-gray-300">
                                    {roleTitle}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">

                                    <span className="flex items-center gap-2">
                                        <GraduationCap size={16} />
                                        {institution}
                                    </span>

                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        {location}
                                    </span>

                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3">

                            <ModeToggle />

                            <button
                                type="button"
                                aria-label="Profile connections"
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <GitBranch size={19} />
                            </button>

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
                            >
                                <Pencil size={16} />
                                Edit Profile
                            </button>

                        </div>
                    </div>
                </section>

                {/* Reputation Summary */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {[
                        {
                            label: "Contribution Score",
                            value: "165",
                            description: "Total points",
                        },
                        {
                            label: "Questions Answered",
                            value: "12",
                            description: "Helpful responses",
                        },
                        {
                            label: "Helpful Answers",
                            value: "8",
                            description: "Marked helpful",
                        },
                        {
                            label: "Projects",
                            value: "2",
                            description: "Proof of work",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                        >
                            <p className="text-sm text-gray-500">
                                {item.label}
                            </p>

                            <p className="mt-3 text-3xl font-bold">
                                {item.value}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {item.description}
                            </p>
                        </div>
                    ))}

                </section>

                {/* Academic / Professional Information */}
                <div className="mt-6 grid gap-6 lg:grid-cols-2">

                    {/* Education / Professional */}
                    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    {getAcademicTitle()}
                                </p>

                                <h2 className="mt-2 text-xl font-semibold">
                                    {role === "student"
                                        ? profile.course ||
                                        "Computer Science Engineering"
                                        : role === "faculty"
                                            ? profile.department ||
                                            "Academic Department"
                                            : role === "researcher"
                                                ? profile.researchArea ||
                                                "Research Area"
                                                : profile.expertise ||
                                                "Area of Expertise"}
                                </h2>
                            </div>

                            <GraduationCap
                                size={23}
                                className="text-gray-400"
                            />

                        </div>

                        <p className="mt-2 text-sm text-gray-400">
                            {institution}
                        </p>

                        {/* Student */}
                        {role === "student" && (
                            <div className="mt-5 flex flex-wrap gap-3">

                                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                                    2024 – 2028
                                </span>

                                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                                    {profile.year || "Student"}
                                </span>

                                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                                    CGPA 8.6
                                </span>

                            </div>
                        )}

                        {/* Faculty */}
                        {role === "faculty" && (
                            <div className="mt-5 space-y-3">

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <BookOpen size={17} />
                                    <span>
                                        Department:{" "}
                                        <span className="text-gray-200">
                                            {profile.department ||
                                                "Not specified"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <GraduationCap size={17} />
                                    <span>
                                        Designation:{" "}
                                        <span className="text-gray-200">
                                            {profile.designation ||
                                                "Faculty"}
                                        </span>
                                    </span>
                                </div>

                            </div>
                        )}

                        {/* Researcher */}
                        {role === "researcher" && (
                            <div className="mt-5 space-y-3">

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Sparkles size={17} />
                                    <span>
                                        Research Area:{" "}
                                        <span className="text-gray-200">
                                            {profile.researchArea ||
                                                "Not specified"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Briefcase size={17} />
                                    <span>
                                        Organization:{" "}
                                        <span className="text-gray-200">
                                            {profile.organization ||
                                                "Not specified"}
                                        </span>
                                    </span>
                                </div>

                            </div>
                        )}

                        {/* Mentor */}
                        {role === "mentor" && (
                            <div className="mt-5 space-y-3">

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Sparkles size={17} />
                                    <span>
                                        Expertise:{" "}
                                        <span className="text-gray-200">
                                            {profile.expertise ||
                                                "Not specified"}
                                        </span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Briefcase size={17} />
                                    <span>
                                        Experience:{" "}
                                        <span className="text-gray-200">
                                            {profile.experience ||
                                                "Not specified"}
                                        </span>
                                    </span>
                                </div>

                            </div>
                        )}

                    </section>

                    {/* Skills */}
                    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Skills
                                </p>

                                <h2 className="mt-2 text-xl font-semibold">
                                    Core Skills
                                </h2>
                            </div>

                            <span className="text-xs text-gray-500">
                                8 skills
                            </span>

                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">

                            {[
                                "React",
                                "TypeScript",
                                "Java",
                                "Spring Boot",
                                "PostgreSQL",
                                "Git",
                                "UI/UX",
                                "REST APIs",
                            ].map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300"
                                >
                                    {skill}
                                </span>
                            ))}

                        </div>
                    </section>
                </div>

                {/* Projects */}
                <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Proof of Work
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Projects
                            </h2>
                        </div>

                        <Briefcase
                            size={22}
                            className="text-gray-400"
                        />

                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">

                            <div className="flex items-start justify-between">

                                <div>
                                    <h3 className="font-semibold">
                                        Connext
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Academic collaboration platform
                                    </p>
                                </div>

                                <CheckCircle2
                                    size={18}
                                    className="text-gray-400"
                                />

                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">

                                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                    Next.js
                                </span>

                                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                    React
                                </span>

                                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                    TypeScript
                                </span>

                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">

                            <div className="flex items-start justify-between">

                                <div>
                                    <h3 className="font-semibold">
                                        TradeOS
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        AI-powered personal trading system
                                    </p>
                                </div>

                                <CheckCircle2
                                    size={18}
                                    className="text-gray-400"
                                />

                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">

                                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                    React
                                </span>

                                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                    Spring Boot
                                </span>

                                <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                                    PostgreSQL
                                </span>

                            </div>
                        </div>

                    </div>
                </section>

                {/* Achievements */}
                <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex items-center gap-2">
                        <Sparkles size={19} />

                        <h2 className="text-xl font-semibold">
                            Achievements
                        </h2>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                        {[
                            "Early Contributor",
                            "Helpful Mentor",
                            "Project Builder",
                        ].map((achievement) => (
                            <div
                                key={achievement}
                                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                            >
                                <CheckCircle2
                                    size={18}
                                    className="text-gray-300"
                                />

                                <span className="text-sm text-gray-300">
                                    {achievement}
                                </span>
                            </div>
                        ))}

                    </div>
                </section>

                {/* Contribution History */}
                <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Activity
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Contribution History
                            </h2>
                        </div>

                        <Sparkles
                            size={21}
                            className="text-gray-400"
                        />

                    </div>

                    <div className="mt-6 space-y-4">

                        {[
                            "Answered a question in Computer Science",
                            "Contributed to a community discussion",
                            "Added a project to Academic Passport",
                            "Helped another student solve a technical problem",
                        ].map((activity, index) => (
                            <div
                                key={activity}
                                className="flex items-center gap-4"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-gray-400">
                                    {index + 1}
                                </div>

                                <div className="flex-1">
                                    <p className="text-sm text-gray-300">
                                        {activity}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-600">
                                        Verified contribution
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </section>

                {/* Continue */}
                <div className="mt-8 flex justify-center">

                    <Link
                        href="/dashboard"
                        className="flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                    >
                        Continue to Dashboard
                        <ArrowRight size={18} />
                    </Link>

                </div>

            </div>
        </main>
    );
}
