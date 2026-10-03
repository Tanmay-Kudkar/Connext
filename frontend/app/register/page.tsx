"use client";

import Link from "next/link";
import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
} from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <main className="min-h-[calc(100vh-64px)] bg-black px-6 py-12 text-white">
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md items-center justify-center">
                <div className="w-full">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-black">
                            🚀
                        </div>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight">
                            Create your account
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-gray-400">
                            Start building your academic identity with Connext.
                        </p>
                    </div>

                    {/* Register Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <form className="space-y-5">
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

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Confirm password
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-white"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Account Type */}
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

                            {/* Terms */}
                            <div className="flex items-start gap-3">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-white"
                                />

                                <label
                                    htmlFor="terms"
                                    className="text-xs leading-5 text-gray-500"
                                >
                                    I agree to Connext&apos;s terms of service and privacy
                                    policy.
                                </label>
                            </div>

                            {/* Create Account */}
                            <Link
                                href="/onboarding"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                            >
                                Create Account
                                <ArrowRight size={18} />
                            </Link>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs text-gray-600">OR</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            <span className="text-base">G</span>
                            Continue with Google
                        </button>

                        {/* Login */}
                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-white transition hover:text-gray-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Bottom Text */}
                    <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                        Create your Connext identity and start connecting with the
                        academic community.
                    </p>
                </div>
            </div>
        </main>
    );
}