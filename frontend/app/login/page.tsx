"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Step = "email" | "otp";

export default function LoginPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [demoHint, setDemoHint] = useState<string | null>(null);

    // ── Step 1: request OTP ───────────────────────────────────────────────────
    async function handleRequestOtp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/request-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message ?? "Failed to send OTP. Check your email.");
                return;
            }
            // In dev mode the API returns the OTP as a hint
            if (data.demoOtp) setDemoHint(`Demo OTP: ${data.demoOtp}`);
            setStep("otp");
        } catch {
            setError("Could not reach the server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }

    // ── Step 2: verify OTP → redirect by role ────────────────────────────────
    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
                method: "POST",
                credentials: "include", // accept the session cookie
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message ?? "Invalid OTP. Please try again.");
                return;
            }
            if (data.needsOnboarding) {
                router.push("/onboarding");
                return;
            }
            // Refresh the global auth state so useAuth() reflects the new user
            await refreshUser();
            const role = (data.user?.role ?? "student") as string;
            router.replace(role === "faculty" ? "/faculty-dashboard" : "/dashboard");
        } catch {
            setError("Could not reach the server. Is the backend running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-6 py-12 text-gray-900 transition-colors duration-200 dark:bg-black dark:text-white">
            <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md items-center justify-center">
                <div className="w-full">
                    {/* ── Hero ── */}
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

                        {/* ── Error banner ── */}
                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {/* ── Dev OTP hint ── */}
                        {demoHint && (
                            <div className="mb-5 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-800/40 dark:bg-indigo-950/30 dark:text-indigo-300">
                                {demoHint}
                            </div>
                        )}

                        {/* ── Step 1: Email form ── */}
                        {step === "email" && (
                            <form className="space-y-5" onSubmit={handleRequestOtp}>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        College email address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                        />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@college.edu"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                        />
                                    </div>
                                </div>

                                <button
                                    id="login-send-otp"
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    {loading ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <>
                                            Send OTP
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* ── Step 2: OTP form ── */}
                        {step === "otp" && (
                            <form className="space-y-5" onSubmit={handleVerifyOtp}>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Enter the 6-digit OTP sent to{" "}
                                    <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
                                </p>

                                <div>
                                    <label
                                        htmlFor="otp"
                                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        One-time password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                                        />
                                        <input
                                            id="otp"
                                            type={showOtp ? "text" : "password"}
                                            required
                                            inputMode="numeric"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="123456"
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-white/30 dark:focus:bg-white/[0.07]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowOtp(!showOtp)}
                                            aria-label={showOtp ? "Hide OTP" : "Show OTP"}
                                            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-black dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-white"
                                        >
                                            {showOtp ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    id="login-verify-otp"
                                    type="submit"
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 font-semibold text-white shadow-md transition hover:bg-gray-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    {loading ? (
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    id="login-back-email"
                                    onClick={() => { setStep("email"); setError(null); setOtp(""); setDemoHint(null); }}
                                    className="w-full text-center text-xs text-gray-500 transition hover:text-black dark:hover:text-white"
                                >
                                    ← Back / use different email
                                </button>
                            </form>
                        )}

                        {/* ── Divider ── */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                            <span className="text-xs text-gray-400 dark:text-gray-600">OR</span>
                            <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
                        </div>

                        {/* ── Google SSO (placeholder) ── */}
                        <button
                            type="button"
                            id="login-google"
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
                        By continuing, you agree to Connext&apos;s terms and privacy policy.
                    </p>
                </div>
            </div>
        </main>
    );
}