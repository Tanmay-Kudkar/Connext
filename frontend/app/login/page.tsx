"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-6 py-12 text-gray-900 transition-colors duration-200 dark:bg-black dark:text-white">
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md items-center justify-center">
                <div className="w-full">
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-md dark:bg-white dark:text-black">
                            🚀
                        </div>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Sign in to continue your Connext journey.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
                        <form className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        href="#"
                                        className="text-xs text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                    />

                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-black dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 accent-black dark:border-white/20 dark:bg-white/5 dark:accent-white"
                                />

                                <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-600 dark:text-gray-400"
                                >
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                            >
                                Sign In
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />

                            <span className="text-xs text-gray-400 dark:text-gray-600">OR</span>

                            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                        </div>

                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            <span className="text-base font-bold">G</span>
                            Continue with Google
                        </button>

                        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-black transition hover:underline dark:text-white"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>

                    <p className="mt-6 text-center text-xs leading-5 text-gray-500 dark:text-gray-600">
                        By continuing, you agree to Connext&apos;s terms and privacy
                        policy.
                    </p>
                </div>
            </div>
        </main>
    );
}