"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    Mail,
    ShieldCheck,
} from "lucide-react";

export default function VerifyPage() {
    return (
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-6 py-12 text-gray-900 transition-colors duration-200 dark:bg-black dark:text-white">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-md dark:bg-white dark:text-black">
                        🛡️
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Verify your academic identity
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        Verify your institution so your Connext profile can become a
                        trusted academic identity.
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-900 dark:text-white">Step 2 of 3</span>
                        <span className="text-gray-500 dark:text-gray-400">Institution Verification</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                        <div className="h-full w-2/3 rounded-full bg-black dark:bg-white" />
                    </div>
                </div>

                {/* Verification Card */}
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8">
                    {/* Trust Banner */}
                    <div className="mb-6 flex items-start gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white dark:bg-white dark:text-black">
                            <ShieldCheck size={20} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Why verify?
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-gray-400">
                                Verification helps Connext distinguish genuine academic
                                identities and improves trust across the community.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
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
                                    placeholder="Enter your institution"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>
                        </div>

                        {/* Academic Email */}
                        <div>
                            <label
                                htmlFor="academicEmail"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Academic email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                />

                                <input
                                    id="academicEmail"
                                    type="email"
                                    placeholder="you@yourcollege.edu"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Use your official institution email if you have one.
                            </p>
                        </div>

                        {/* Verification Code */}
                        <div>
                            <label
                                htmlFor="code"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Verification code
                            </label>

                            <input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Enter 6-digit code"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm tracking-[0.25em] text-gray-900 outline-none transition placeholder:text-gray-400 placeholder:tracking-normal focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                            />
                        </div>

                        {/* Send Code */}
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            <Mail size={18} />
                            Send Verification Code
                        </button>

                        {/* Continue */}
                        <Link
                            href="/passport"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Continue to Academic Passport
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Verification Benefits */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                        <CheckCircle2 size={16} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-400">Verified identity</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                        <CheckCircle2 size={16} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-400">Trusted profile</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                        <CheckCircle2 size={16} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-400">Better discovery</span>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs leading-5 text-gray-500 dark:text-gray-600">
                    Verification will be connected to the Connext backend later.
                </p>
            </div>
        </main>
    );
}