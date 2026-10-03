"use client";

import { ArrowLeft, ArrowRight, GraduationCap, Loader2, MapPin, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OnboardingPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [institution, setInstitution] = useState("");
    const [course, setCourse] = useState("");
    const [year, setYear] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [errors, setErrors] = useState<{
        name?: string;
        role?: string;
        institution?: string;
        course?: string;
        year?: string;
        location?: string;
    }>({});

    useEffect(() => {
        const sName = sessionStorage.getItem("ob_name");
        const sRole = sessionStorage.getItem("ob_role");
        const sInstitution = sessionStorage.getItem("ob_institution");
        const sCourse = sessionStorage.getItem("ob_course");
        const sYear = sessionStorage.getItem("ob_year");
        const sLocation = sessionStorage.getItem("ob_location");

        if (sName) setName(sName);
        if (sRole) setRole(sRole);
        if (sInstitution) setInstitution(sInstitution);
        if (sCourse) setCourse(sCourse);
        if (sYear) setYear(sYear);
        if (sLocation) setLocation(sLocation);
    }, []);

    const validate = () => {
        const newErrors: {
            name?: string;
            role?: string;
            institution?: string;
            course?: string;
            year?: string;
            location?: string;
        } = {};

        if (!name.trim()) {
            newErrors.name = "Full name is required";
        } else if (name.trim().length < 2) {
            newErrors.name = "Full name must be at least 2 characters";
        }

        if (!role) {
            newErrors.role = "Please select your role";
        }

        if (!institution.trim()) {
            newErrors.institution = "Institution is required";
        }

        if (!course.trim()) {
            newErrors.course = "Course / Program is required";
        }

        if (!year) {
            newErrors.year = "Please select your academic year";
        }

        if (!location.trim()) {
            newErrors.location = "Location is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        setLoading(true);
        try {
            // All data is already saved in sessionStorage from onChange handlers.
            // Navigate to verification step where the OTP will be entered to finalize account creation.
            router.push("/verify");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong.";
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };


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
                <div className="relative mb-8">
                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white md:absolute md:-left-28 md:top-0 md:mb-0"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

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
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    required
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        sessionStorage.setItem("ob_name", e.target.value);
                                        if (errors.name) {
                                            setErrors((prev) => ({ ...prev, name: undefined }));
                                        }
                                    }}
                                    placeholder="Enter your full name"
                                    className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${
                                        errors.name
                                            ? "border-red-500/70 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                    }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                            )}
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
                                required
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    sessionStorage.setItem("ob_role", e.target.value);
                                    if (errors.role) {
                                        setErrors((prev) => ({ ...prev, role: undefined }));
                                    }
                                }}
                                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:bg-white/[0.07] ${
                                    errors.role
                                        ? "border-red-500/70 focus:border-red-500"
                                        : "border-white/10 focus:border-white/30"
                                }`}
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
                            {errors.role && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.role}</p>
                            )}
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
                                    required
                                    value={institution}
                                    onChange={(e) => {
                                        setInstitution(e.target.value);
                                        sessionStorage.setItem("ob_institution", e.target.value);
                                        if (errors.institution) {
                                            setErrors((prev) => ({ ...prev, institution: undefined }));
                                        }
                                    }}
                                    placeholder="Enter your college or institution"
                                    className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${
                                        errors.institution
                                            ? "border-red-500/70 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                    }`}
                                />
                            </div>
                            {errors.institution && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.institution}</p>
                            )}
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
                                    required
                                    value={course}
                                    onChange={(e) => {
                                        setCourse(e.target.value);
                                        sessionStorage.setItem("ob_course", e.target.value);
                                        if (errors.course) {
                                            setErrors((prev) => ({ ...prev, course: undefined }));
                                        }
                                    }}
                                    placeholder="e.g. Computer Engineering"
                                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${
                                        errors.course
                                            ? "border-red-500/70 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                    }`}
                                />
                                {errors.course && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.course}</p>
                                )}
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
                                    required
                                    value={year}
                                    onChange={(e) => {
                                        setYear(e.target.value);
                                        sessionStorage.setItem("ob_year", e.target.value);
                                        if (errors.year) {
                                            setErrors((prev) => ({ ...prev, year: undefined }));
                                        }
                                    }}
                                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:bg-white/[0.07] ${
                                        errors.year
                                            ? "border-red-500/70 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                    }`}
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
                                {errors.year && (
                                    <p className="mt-1.5 text-xs text-red-400">{errors.year}</p>
                                )}
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
                                    required
                                    value={location}
                                    onChange={(e) => {
                                        setLocation(e.target.value);
                                        sessionStorage.setItem("ob_location", e.target.value);
                                        if (errors.location) {
                                            setErrors((prev) => ({ ...prev, location: undefined }));
                                        }
                                    }}
                                    placeholder="City, State"
                                    className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${
                                        errors.location
                                            ? "border-red-500/70 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                    }`}
                                />
                            </div>
                            {errors.location && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.location}</p>
                            )}
                        </div>

                        {/* API Error */}
                        {apiError && (
                            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                {apiError}
                            </div>
                        )}

                        {/* Continue */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                    You can update these details later from your Academic Passport.
                </p>
            </div>
        </main>
    );
}