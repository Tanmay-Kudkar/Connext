"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
} from "lucide-react";
import { useState } from "react";

type FormErrors = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    terms?: string;
};

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const [terms, setTerms] = useState(false);

    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!name.trim()) {
            newErrors.name = "Please enter your full name.";
        }

        if (!email.trim()) {
            newErrors.email = "Please enter your email address.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!password) {
            newErrors.password = "Please create a password.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (!role) {
            newErrors.role = "Please select your role.";
        }

        if (!terms) {
            newErrors.terms =
                "Please accept the terms of service and privacy policy.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setSuccess(true);

        setTimeout(() => {
            window.location.href = "/onboarding";
        }, 700);
    };

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

                    {/* Form */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

                        {/* General Error */}
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                                <p className="text-sm font-medium text-red-400">
                                    Please enter all required details correctly.
                                </p>

                                <p className="mt-1 text-xs text-red-400/70">
                                    Check the highlighted fields below.
                                </p>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                                <CheckCircle2
                                    size={19}
                                    className="text-green-400"
                                />

                                <p className="text-sm text-green-400">
                                    Account details are valid. Continuing...
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

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
                                        value={name}
                                        onChange={(event) => {
                                            setName(event.target.value);

                                            if (errors.name) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    name: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="Enter your full name"
                                        className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${errors.name
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                            }`}
                                    />
                                </div>

                                {errors.name && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.name}
                                    </p>
                                )}
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
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);

                                            if (errors.email) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    email: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="you@example.com"
                                        className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${errors.email
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                            }`}
                                    />
                                </div>

                                {errors.email && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.email}
                                    </p>
                                )}
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
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);

                                            if (errors.password) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    password: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="Create a password"
                                        className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${errors.password
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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

                                {errors.password && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.password}
                                    </p>
                                )}
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
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(event.target.value);

                                            if (errors.confirmPassword) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    confirmPassword: undefined,
                                                }));
                                            }
                                        }}
                                        placeholder="Confirm your password"
                                        className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:bg-white/[0.07] ${errors.confirmPassword
                                            ? "border-red-500/50 focus:border-red-500"
                                            : "border-white/10 focus:border-white/30"
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
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

                                {errors.confirmPassword && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.confirmPassword}
                                    </p>
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
                                    value={role}
                                    onChange={(event) => {
                                        setRole(event.target.value);

                                        if (errors.role) {
                                            setErrors((previous) => ({
                                                ...previous,
                                                role: undefined,
                                            }));
                                        }
                                    }}
                                    className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-gray-300 outline-none transition focus:bg-white/[0.07] ${errors.role
                                        ? "border-red-500/50 focus:border-red-500"
                                        : "border-white/10 focus:border-white/30"
                                        }`}
                                >
                                    <option value="" className="bg-black">
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
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.role}
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <div>
                                <div className="flex items-start gap-2">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={terms}
                                        onChange={(event) => {
                                            setTerms(event.target.checked);

                                            if (errors.terms) {
                                                setErrors((previous) => ({
                                                    ...previous,
                                                    terms: undefined,
                                                }));
                                            }
                                        }}
                                        className={`mt-0.5 h-4 w-4 rounded bg-white/5 accent-white ${errors.terms
                                            ? "border-red-500"
                                            : "border-white/20"
                                            }`}
                                    />

                                    <label
                                        htmlFor="terms"
                                        className="text-xs leading-5 text-gray-400"
                                    >
                                        I agree to Connext&apos;s terms of service
                                        and privacy policy.
                                    </label>
                                </div>

                                {errors.terms && (
                                    <p className="mt-2 text-xs text-red-400">
                                        {errors.terms}
                                    </p>
                                )}
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

                            <span className="text-xs text-gray-600">
                                OR
                            </span>

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

                    <p className="mt-6 text-center text-xs leading-5 text-gray-600">
                        By continuing, you agree to Connext&apos;s terms and
                        privacy policy.
                    </p>
                </div>
            </div>
        </main>
    );
}
