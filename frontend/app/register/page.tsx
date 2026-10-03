"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("reg_email");
        const storedPassword = sessionStorage.getItem("reg_password");
        const storedConfirm = sessionStorage.getItem("reg_confirm_password");
        const storedTerms = sessionStorage.getItem("reg_terms");

        if (storedEmail) setEmail(storedEmail);
        if (storedPassword) setPassword(storedPassword);
        if (storedConfirm) setConfirmPassword(storedConfirm);
        if (storedTerms === "true") setAgreedTerms(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim()) {
            setError("Email address is required.");
            return;
        }

        const emailLower = email.trim().toLowerCase();

        if (!password) {
            setError("Password is required.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!agreedTerms) {
            setError("You must agree to the terms of service.");
            return;
        }

        // Navigate to onboarding
        router.push("/onboarding");
    };

    const isPasswordMismatch = password && confirmPassword && password !== confirmPassword;

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
                        {error && (
                            <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                     Academic email address
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            sessionStorage.setItem("reg_email", e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="student@university.edu"
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
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            sessionStorage.setItem("reg_password", e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="Create a password"
                                        className={`w-full rounded-xl border ${isPasswordMismatch ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07]`}
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
                                        required
                                        minLength={6}
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            sessionStorage.setItem("reg_confirm_password", e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="Confirm your password"
                                        className={`w-full rounded-xl border ${isPasswordMismatch ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-white/30'} bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07]`}
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
                                {isPasswordMismatch && (
                                    <p className="mt-2 text-xs text-red-400">Passwords do not match.</p>
                                )}
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    checked={agreedTerms}
                                    onChange={(e) => {
                                        setAgreedTerms(e.target.checked);
                                        sessionStorage.setItem("reg_terms", String(e.target.checked));
                                        setError(null);
                                    }}
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
                            <button
                                type="submit"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                            >
                                Create Account
                                <ArrowRight size={18} />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-xs text-gray-600">OR</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* GitHub */}
                        <a
                            href="http://localhost:3001/api/auth/github"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                        >
                            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            Continue with GitHub
                        </a>

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