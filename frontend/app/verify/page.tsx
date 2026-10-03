"use client";

import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    Loader2,
    Mail,
    ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { requestOtp, verifyOtp } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyPage() {
    const router = useRouter();

    const [institution, setInstitution] = useState("");
    const [academicEmail, setAcademicEmail] = useState("");
    const [code, setCode] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [errors, setErrors] = useState<{
        institution?: string;
        academicEmail?: string;
        code?: string;
    }>({});

    // Pre-fill fields from sessionStorage
    useEffect(() => {
        const ob_institution = sessionStorage.getItem("ob_institution");
        if (ob_institution) setInstitution(ob_institution);

        // Auto-fill the email from the register step — no need to ask again
        const reg_email = sessionStorage.getItem("reg_email");
        if (reg_email) setAcademicEmail(reg_email);
    }, []);

    const validateFields = () => {
        const newErrors: {
            institution?: string;
            academicEmail?: string;
            code?: string;
        } = {};

        if (!institution.trim()) {
            newErrors.institution = "Institution name is required";
        }

        if (!academicEmail.trim()) {
            newErrors.academicEmail = "Academic email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(academicEmail.trim())) {
            newErrors.academicEmail = "Please enter a valid email address";
        }

        return newErrors;
    };

    const handleSendCode = async () => {
        setApiError(null);
        const fieldErrors = validateFields();
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSendingOtp(true);
        try {
            await requestOtp(academicEmail.trim());
            setOtpSent(true);
            setSuccessMsg(`Verification code sent to ${academicEmail.trim()}`);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to send code. Please try again.";
            setApiError(msg);
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null);
        setSuccessMsg(null);

        const fieldErrors = validateFields();
        if (!otpSent) {
            fieldErrors.code = "Please send the verification code first";
        } else if (!code.trim()) {
            fieldErrors.code = "Verification code is required";
        } else if (!/^\d{6}$/.test(code.trim())) {
            fieldErrors.code = "Enter a valid 6-digit code";
        }

        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSubmitting(true);
        try {
            // Retrieve data gathered across the registration flow
            const email = academicEmail.trim();
            const displayName = sessionStorage.getItem("ob_name") ?? "";
            const role = sessionStorage.getItem("ob_role") ?? "student";

            // Generate a handle from the display name
            const handle = displayName
                .toLowerCase()
                .replace(/\s+/g, ".")
                .replace(/[^a-z0-9.]/g, "")
                .substring(0, 40);

            const result = await verifyOtp({
                email,
                otp: code.trim(),
                displayName,
                handle,
                mode: "vibe",
            });

            if (result.needsOnboarding) {
                // This shouldn't happen in our flow, but handle gracefully
                setApiError("Please complete your profile before continuing.");
                return;
            }

            // Clear registration session data
            [
                "reg_email", "reg_password", "reg_confirm_password", "reg_terms",
                "ob_name", "ob_role", "ob_institution", "ob_course", "ob_year", "ob_location",
                "demo_otp",
            ].forEach((k) => sessionStorage.removeItem(k));

            // Navigate to the academic passport / dashboard
            router.push("/passport");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Verification failed. Please try again.";
            setApiError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-[calc(100vh-64px)] bg-black px-6 py-12 text-white">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-black">
                        🛡️
                    </div>

                    <h1 className="mt-6 text-3xl font-bold tracking-tight">
                        Verify your academic identity
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-gray-400">
                        Verify your institution so your Connext profile can become a
                        trusted academic identity.
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
                        <span className="text-white">Step 2 of 3</span>
                        <span className="text-gray-500">Institution Verification</span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 rounded-full bg-white" />
                    </div>
                </div>

                {/* Verification Card */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
                >
                    {/* Trust Banner */}
                    <div className="mb-6 flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
                            <ShieldCheck size={20} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                Why verify?
                            </h2>

                            <p className="mt-1 text-xs leading-5 text-gray-400">
                                Verification helps Connext distinguish genuine academic
                                identities and improves trust across the community.
                            </p>
                        </div>
                    </div>

                    {/* API Error */}
                    {apiError && (
                        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {apiError}
                        </div>
                    )}

                    <div className="space-y-6">
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
                                    value={institution}
                                    onChange={(e) => {
                                        setInstitution(e.target.value);
                                        if (errors.institution)
                                            setErrors((p) => ({ ...p, institution: undefined }));
                                    }}
                                    placeholder="Enter your institution"
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

                        {/* Academic Email */}
                        <div>
                            <label
                                htmlFor="academicEmail"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Academic email
                            </label>

                            <div className="relative">
                                <Mail
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    id="academicEmail"
                                    type="email"
                                    value={academicEmail}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-gray-300 outline-none"
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-600">
                                This is the email you registered with.
                            </p>
                        </div>

                        {/* Verification Code */}
                        <div>
                            <label
                                htmlFor="code"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Verification code
                            </label>

                            <input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={code}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "");
                                    setCode(val);
                                    if (errors.code)
                                        setErrors((p) => ({ ...p, code: undefined }));
                                }}
                                placeholder="Enter 6-digit code"
                                disabled={!otpSent}
                                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm tracking-[0.25em] text-white outline-none transition placeholder:text-gray-600 placeholder:tracking-normal focus:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed ${
                                    errors.code
                                        ? "border-red-500/70 focus:border-red-500"
                                        : "border-white/10 focus:border-white/30"
                                }`}
                            />
                            {errors.code && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.code}</p>
                            )}
                            {!otpSent && (
                                <p className="mt-1.5 text-xs text-gray-600">
                                    Send the verification code first to enable this field.
                                </p>
                            )}
                        </div>

                        {/* Send Code */}
                        <button
                            type="button"
                            onClick={handleSendCode}
                            disabled={sendingOtp}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {sendingOtp ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Sending code...
                                </>
                            ) : (
                                <>
                                    <Mail size={18} />
                                    {otpSent ? "Resend Verification Code" : "Send Verification Code"}
                                </>
                            )}
                        </button>

                        {/* Continue */}
                        <button
                            type="submit"
                            disabled={submitting || !otpSent}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Continue to Academic Passport
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Verification Benefits */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <CheckCircle2 size={16} className="text-gray-400" />
                        <span className="text-xs text-gray-400">Verified identity</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <CheckCircle2 size={16} className="text-gray-400" />
                        <span className="text-xs text-gray-400">Trusted profile</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <CheckCircle2 size={16} className="text-gray-400" />
                        <span className="text-xs text-gray-400">Better discovery</span>
                    </div>
                </div>
            </div>

            {/* Success Toast Popup */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-green-500/30 bg-green-950/90 p-4 text-sm text-green-300 shadow-2xl shadow-green-900/20 backdrop-blur-xl"
                    >
                        <CheckCircle2 size={18} className="shrink-0" />
                        <p>{successMsg}</p>
                        <button
                            onClick={() => setSuccessMsg(null)}
                            className="ml-auto text-green-500 hover:text-green-300"
                        >
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}