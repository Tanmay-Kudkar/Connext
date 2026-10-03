"use client";

import { ArrowRight, GraduationCap, MapPin, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [institution, setInstitution] = useState("");
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");
    const [location, setLocation] = useState("");

    const handleContinue = () => {
        const academicProfile = {
            name,
            role,
            institution,
            course,
            year,
            location,
        };

        localStorage.setItem(
            "connextAcademicProfile",
            JSON.stringify(academicProfile)
        );

        router.push("/verify");
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-6 py-12 text-gray-900 transition-colors duration-200 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-2xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-md dark:bg-white dark:text-black">
                        🎓
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Build your academic identity
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        Tell us a little about yourself so we can personalize your
                        Connext experience.
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-900 dark:text-white">Step 1 of 3</span>
                        <span className="text-gray-500 dark:text-gray-400">Academic Identity</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                        <div className="h-full w-1/3 rounded-full bg-black dark:bg-white" />
                    </div>
                </div>

                {/* Form Card */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleContinue();
                        }}
                        className="space-y-6"
                    >

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Full name
                            </label>

                            <div className="relative">
                                <User
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                I am a
                            </label>

                            <select
                                id="role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                            >
                                <option value="" disabled className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                    Select your role
                                </option>

                                <option value="student" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                    Student
                                </option>

                                <option value="faculty" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                    Faculty
                                </option>

                                <option value="researcher" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                    Researcher
                                </option>

                                <option value="mentor" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                    Mentor
                                </option>
                            </select>
                        </div>

                        {/* Institution */}
                        <div>
                            <label
                                htmlFor="institution"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Institution
                            </label>

                            <div className="relative">
                                <GraduationCap
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                />

                                <input
                                    id="institution"
                                    type="text"
                                    value={institution}
                                    onChange={(event) =>
                                        setInstitution(event.target.value)
                                    }
                                    placeholder="Enter your college or institution"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Course / Academic Year */}
                        <div className="grid gap-5 sm:grid-cols-2">

                            {/* Course */}
                            <div>
                                <label
                                    htmlFor="course"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Course / Program
                                </label>

                                <input
                                    id="course"
                                    type="text"
                                    value={course}
                                    onChange={(event) => setCourse(event.target.value)}
                                    placeholder="e.g. Computer Engineering"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>

                            {/* Academic Year */}
                            <div>
                                <label
                                    htmlFor="year"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Academic Year
                                </label>

                                <select
                                    id="year"
                                    value={year}
                                    onChange={(event) => setYear(event.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                >
                                    <option value="" disabled className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                        Select year
                                    </option>

                                    <option value="1" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                        1st Year
                                    </option>

                                    <option value="2" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                        2nd Year
                                    </option>

                                    <option value="3" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                        3rd Year
                                    </option>

                                    <option value="4" className="bg-white text-gray-900 dark:bg-black dark:text-white">
                                        4th Year
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="location"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Location
                            </label>

                            <div className="relative">
                                <MapPin
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                />

                                <input
                                    id="location"
                                    type="text"
                                    value={location}
                                    onChange={(event) => setLocation(event.target.value)}
                                    placeholder="City, State"
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Continue */}
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Continue
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                    You can update these details later from your Academic Passport.
                </p>
            </div>
        </main>
    );
}