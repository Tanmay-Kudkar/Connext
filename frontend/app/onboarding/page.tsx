"use client";

import { ArrowRight, GraduationCap, MapPin, User } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-black">
                        🎓
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Build your academic identity
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        Tell us a little about yourself so we can personalize your
                        Connext experience.
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-white">Step 1 of 3</span>
                        <span className="text-gray-500">Academic Identity</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/3 rounded-full bg-white" />
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                    <form className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Full name
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                I am a
                            </label>

                            <select
                                id="role"
                                defaultValue=""
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                            >
                                <option value="" disabled className="bg-black">
                                    Select your role
                                </option>
                                <option value="student" className="bg-black">
                                    Student
                                </option>
                                <option value="faculty" className="bg-black">
                                    Faculty
                                </option>
                                <option value="researcher" className="bg-black">
                                    Researcher
                                </option>
                                <option value="mentor" className="bg-black">
                                    Mentor
                                </option>
                            </select>
                        </div>

                        {/* Institution */}
                        <div>
                            <label
                                htmlFor="institution"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Institution
                            </label>

                            <div className="relative">
                                <GraduationCap
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="institution"
                                    type="text"
                                    placeholder="Enter your college or institution"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Course / Department */}
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="course"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Course / Program
                                </label>

                                <input
                                    id="course"
                                    type="text"
                                    placeholder="e.g. Computer Engineering"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="year"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Academic Year
                                </label>

                                <select
                                    id="year"
                                    defaultValue=""
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-white/30 focus:bg-white/[0.07]"
                                >
                                    <option value="" disabled className="bg-black">
                                        Select year
                                    </option>
                                    <option value="1" className="bg-black">
                                        1st Year
                                    </option>
                                    <option value="2" className="bg-black">
                                        2nd Year
                                    </option>
                                    <option value="3" className="bg-black">
                                        3rd Year
                                    </option>
                                    <option value="4" className="bg-black">
                                        4th Year
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Location
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="location"
                                    type="text"
                                    placeholder="City, State"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Continue */}
                        <Link
                            href="/verify"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                        >
                            Continue
                            <ArrowRight size={18} />
                        </Link>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                    You can update these details later from your Academic Passport.
                </p>
            </div>
        </main>
    );
}