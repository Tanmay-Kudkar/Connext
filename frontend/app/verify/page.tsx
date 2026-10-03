"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, GraduationCap, Mail } from "lucide-react";
import { useState } from "react";

export default function VerifyPage() {
    const [code, setCode] = useState("");
    const [sent, setSent] = useState(false);

    const handleSendCode = () => {
        setSent(true);
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-6 py-12 text-gray-900 transition-colors duration-200 dark:bg-black dark:text-white">
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl items-center justify-center">
                <div className="w-full">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-2xl text-white shadow-md dark:bg-white dark:text-black">
                            🎓
                        </div>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Verify your institution
                        </h1>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
                            Verify your academic identity to unlock trusted features and
                            build your Connext Academic Passport.
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900 dark:text-white">
                                Step 2 of 3
                            </span>

                            <span className="text-gray-500 dark:text-gray-400">
                                Institution Verification
                            </span>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                            <div className="h-full w-2/3 rounded-full bg-black dark:bg-white" />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-8">

                        {/* Institution */}
                        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200/70 text-gray-800 dark:bg-white/10 dark:text-gray-300">
                                    <GraduationCap
                                        size={21}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Academic Institution
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                        Use your official college or university email address
                                        to verify your academic identity.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="institutionEmail"
                                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Institution email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                />

                                <input
                                    id="institutionEmail"
                                    type="email"
                                    placeholder="yourname@college.edu"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Example: student@university.edu
                            </p>
                        </div>

                        {/* Send Code */}
                        <button
                            type="button"
                            onClick={handleSendCode}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-3.5 text-sm font-medium text-gray-800 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                        >
                            <Mail size={18} />
                            Send Verification Code
                        </button>

                        {/* Verification Code */}
                        {sent && (
                            <div className="mt-6 border-t border-gray-200 pt-6 dark:border-white/10">
                                <label
                                    htmlFor="verificationCode"
                                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                >
                                    Verification code
                                </label>

                                <input
                                    id="verificationCode"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) =>
                                        setCode(e.target.value.replace(/\D/g, ""))
                                    }
                                    placeholder="Enter 6-digit code"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg tracking-[0.4em] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                />

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        Code sent to your institution email.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        className="text-xs font-medium text-black transition hover:underline dark:text-white"
                                    >
                                        Resend code
                                    </button>
                                </div>

                                {/* Demo verification status */}
                                {code.length === 6 && (
                                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                                        <CheckCircle2
                                            size={20}
                                            className="text-green-600 dark:text-green-400"
                                        />

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                Code entered
                                            </p>

                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Your verification code is ready to be submitted.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Continue */}
                        <Link
                            href="/passport"
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Continue to Academic Passport
                            <ArrowRight size={18} />
                        </Link>

                        {/* Security note */}
                        <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/30">
                            <p className="text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
                                Your academic information is used to establish a trusted
                                identity on Connext. You control what information is visible
                                to the community.
                            </p>
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="mt-6 text-center text-xs leading-5 text-gray-500 dark:text-gray-600">
                        Having trouble verifying your institution? You can continue
                        and complete verification later.
                    </p>
                </div>
            </div>
        </main>
    );
}