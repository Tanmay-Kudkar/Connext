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
        <main className="min-h-[calc(100vh-64px)] bg-black px-6 py-12 text-white">
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-2xl items-center justify-center">
                <div className="w-full">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-black">
                            🎓
                        </div>

                        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                            Verify your institution
                        </h1>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
                            Verify your academic identity to unlock trusted features and
                            build your Connext Academic Passport.
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-white">
                                Step 2 of 3
                            </span>

                            <span className="text-gray-500">
                                Institution Verification
                            </span>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-2/3 rounded-full bg-white" />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                        {/* Institution */}
                        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                                    <GraduationCap
                                        size={21}
                                        className="text-gray-300"
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-white">
                                        Academic Institution
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-400">
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
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Institution email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />

                                <input
                                    id="institutionEmail"
                                    type="email"
                                    placeholder="yourname@college.edu"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />
                            </div>

                            <p className="mt-2 text-xs text-gray-600">
                                Example: student@university.edu
                            </p>
                        </div>

                        {/* Send Code */}
                        <button
                            type="button"
                            onClick={handleSendCode}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            <Mail size={18} />
                            Send Verification Code
                        </button>

                        {/* Verification Code */}
                        {sent && (
                            <div className="mt-6 border-t border-white/10 pt-6">
                                <label
                                    htmlFor="verificationCode"
                                    className="mb-2 block text-sm font-medium text-gray-300"
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
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg tracking-[0.4em] text-white outline-none transition placeholder:text-gray-600 focus:border-white/30 focus:bg-white/[0.07]"
                                />

                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        Code sent to your institution email.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        className="text-xs font-medium text-white transition hover:text-gray-300"
                                    >
                                        Resend code
                                    </button>
                                </div>

                                {/* Demo verification status */}
                                {code.length === 6 && (
                                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                                        <CheckCircle2
                                            size={20}
                                            className="text-green-400"
                                        />

                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                Code entered
                                            </p>

                                            <p className="text-xs text-gray-500">
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
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                        >
                            Continue to Academic Passport
                            <ArrowRight size={18} />
                        </Link>

                        {/* Security note */}
                        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                            <p className="text-center text-xs leading-5 text-gray-500">
                                Your academic information is used to establish a trusted
                                identity on Connext. You control what information is visible
                                to the community.
                            </p>
                        </div>
                    </div>

                    {/* Footer text */}
                    <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                        Having trouble verifying your institution? You can continue
                        and complete verification later.
                    </p>
                </div>
            </div>
        </main>
    );
}