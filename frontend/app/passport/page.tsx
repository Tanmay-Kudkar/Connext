import {
    BadgeCheck,
    GitBranch,
    GraduationCap,
    MapPin,
    Pencil,
} from "lucide-react";

import ModeToggle from "@/components/shared/ModeToggle";

export default function PassportPage() {
    return (
        <div className="min-h-screen bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">

                {/* Page Header */}
                <div className="mb-10">
                    <p className="mb-2 text-sm font-medium text-gray-400">
                        Academic Identity
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight">
                        Academic Passport
                    </h1>

                    <p className="mt-3 max-w-2xl text-gray-400">
                        Your verified academic identity, skills, projects, achievements,
                        and contributions — all in one place.
                    </p>
                </div>

                {/* Profile Header */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        {/* Profile Information */}
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                            {/* Avatar */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-black">
                                AR
                            </div>

                            {/* Details */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h2 className="text-2xl font-bold">
                                        Alex Sharma
                                    </h2>

                                    {/* Verification */}
                                    <BadgeCheck
                                        size={22}
                                        className="text-blue-400"
                                    />
                                </div>

                                <p className="mt-1 text-gray-300">
                                    Computer Science Engineering Student
                                </p>

                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">

                                    {/* College */}
                                    <span className="flex items-center gap-2">
                                        <GraduationCap size={16} />
                                        Computer Science & Engineering
                                    </span>

                                    {/* Location */}
                                    <span className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        India
                                    </span>

                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">

                            <ModeToggle />

                            {/* GitHub */}
                            <button
                                aria-label="GitHub"
                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white"
                            >
                                <GitBranch size={19} />
                            </button>

                            {/* Edit Profile */}
                            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
                                <Pencil size={16} />
                                Edit Profile
                            </button>

                        </div>
                    </div>
                </div>

                {/* Reputation Summary */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Contribution Score */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <p className="text-sm text-gray-500">
                            Contribution Score
                        </p>

                        <p className="mt-2 text-2xl font-bold text-white">
                            165
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Total points
                        </p>
                    </div>

                    {/* Questions Answered */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <p className="text-sm text-gray-500">
                            Questions Answered
                        </p>

                        <p className="mt-2 text-2xl font-bold text-white">
                            12
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Helpful responses
                        </p>
                    </div>

                    {/* Helpful Answers */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <p className="text-sm text-gray-500">
                            Helpful Answers
                        </p>

                        <p className="mt-2 text-2xl font-bold text-white">
                            8
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Marked helpful
                        </p>
                    </div>

                    {/* Projects */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <p className="text-sm text-gray-500">
                            Projects
                        </p>

                        <p className="mt-2 text-2xl font-bold text-white">
                            2
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            Proof of work
                        </p>
                    </div>

                </div>

                {/* Passport Sections */}
                <div className="mt-8 grid gap-6 md:grid-cols-2">

                    {/* Education */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <div className="flex items-start justify-between gap-4">

                            <div>
                                <p className="text-sm text-gray-500">
                                    Education
                                </p>

                                <h3 className="mt-2 text-xl font-semibold">
                                    B.E. Computer Engineering
                                </h3>

                                <p className="mt-1 text-sm text-gray-400">
                                    ABC Institute of Technology
                                </p>
                            </div>

                            <GraduationCap
                                size={24}
                                className="shrink-0 text-gray-400"
                            />
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                                2024 – 2028
                            </span>

                            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                                3rd Year
                            </span>

                            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300">
                                CGPA 8.6
                            </span>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Skills
                            </h3>

                            <span className="text-xs text-gray-500">
                                8 skills
                            </span>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
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
                                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Projects
                            </h3>

                            <span className="text-xs text-gray-500">
                                2 projects
                            </span>
                        </div>

                        <div className="mt-5 space-y-4">

                            {/* Project 1 */}
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <h4 className="font-semibold text-white">
                                            Connext
                                        </h4>

                                        <p className="mt-1 text-sm leading-6 text-gray-400">
                                            Academic collaboration platform connecting students,
                                            faculty, researchers, and mentors.
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-gray-400">
                                        2026
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                        Next.js
                                    </span>

                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                        TypeScript
                                    </span>

                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                        PostgreSQL
                                    </span>
                                </div>
                            </div>

                            {/* Project 2 */}
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <h4 className="font-semibold text-white">
                                            TradeOS
                                        </h4>

                                        <p className="mt-1 text-sm leading-6 text-gray-400">
                                            AI-powered personal trading operating system for
                                            tracking, analyzing, and improving trading decisions.
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-gray-400">
                                        2026
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                        React
                                    </span>

                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                        Spring Boot
                                    </span>

                                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-gray-400">
                                        AI
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Achievements
                            </h3>

                            <span className="text-xs text-gray-500">
                                4 achievements
                            </span>
                        </div>

                        <div className="mt-5 space-y-3">

                            {/* Achievement 1 */}
                            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                                    🏆
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-white">
                                        Hackathon Participant
                                    </h4>

                                    <p className="mt-1 text-xs text-gray-500">
                                        RepoForge 2026
                                    </p>
                                </div>
                            </div>

                            {/* Achievement 2 */}
                            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                                    🚀
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-white">
                                        Connext Project
                                    </h4>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Academic collaboration platform
                                    </p>
                                </div>
                            </div>

                            {/* Achievement 3 */}
                            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                                    📜
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-white">
                                        Technical Certification
                                    </h4>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Full-stack development
                                    </p>
                                </div>
                            </div>

                            {/* Achievement 4 */}
                            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                                    ⭐
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-white">
                                        Community Contributor
                                    </h4>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Academic knowledge sharing
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Contribution History */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Contribution History
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Your verified contributions across the Connext community.
                            </p>
                        </div>

                        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                            165 points
                        </span>
                    </div>

                    <div className="mt-6 space-y-4">

                        {/* Contribution 1 */}
                        <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                                💡
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                    <h4 className="text-sm font-semibold">
                                        Answered a database question
                                    </h4>

                                    <span className="text-xs text-gray-500">
                                        +25 points
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Helped another student understand database normalization.
                                </p>
                            </div>
                        </div>

                        {/* Contribution 2 */}
                        <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                                🤝
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                    <h4 className="text-sm font-semibold">
                                        Helped a student with React
                                    </h4>

                                    <span className="text-xs text-gray-500">
                                        +40 points
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Provided guidance on React components and state management.
                                </p>
                            </div>
                        </div>

                        {/* Contribution 3 */}
                        <div className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                                🚀
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                    <h4 className="text-sm font-semibold">
                                        Contributed to Connext
                                    </h4>

                                    <span className="text-xs text-gray-500">
                                        +100 points
                                    </span>
                                </div>

                                <p className="mt-1 text-xs text-gray-500">
                                    Contributed to the development of the Connext platform.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}