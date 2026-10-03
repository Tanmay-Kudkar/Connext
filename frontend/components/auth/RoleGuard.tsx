"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
    allowedRole: "student" | "faculty";
    children: React.ReactNode;
}

type StoredProfile = {
    role?: "student" | "faculty" | "researcher" | "mentor";
    name?: string;
};

export default function RoleGuard({
    allowedRole,
    children,
}: RoleGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [resolvedRole, setResolvedRole] = useState<
        "student" | "faculty" | "researcher" | "mentor" | null
    >(null);

    const [checkingRole, setCheckingRole] = useState(true);

    useEffect(() => {
        if (loading) return;

        // First preference: authenticated user from AuthContext
        if (user?.role) {
            setResolvedRole(user.role);
            setCheckingRole(false);
            return;
        }

        // Frontend fallback: role saved during onboarding
        try {
            const storedProfile = localStorage.getItem(
                "connextAcademicProfile"
            );

            if (storedProfile) {
                const profile: StoredProfile = JSON.parse(storedProfile);

                if (profile.role) {
                    setResolvedRole(profile.role);
                    setCheckingRole(false);
                    return;
                }
            }
        } catch (error) {
            console.error("Unable to read academic profile:", error);
        }

        setResolvedRole(null);
        setCheckingRole(false);
    }, [loading, user]);

    useEffect(() => {
        if (loading || checkingRole) return;

        // No authenticated user and no onboarding profile
        if (!user && !resolvedRole) {
            router.replace("/login");
            return;
        }

        // No role available
        if (!resolvedRole) {
            router.replace("/login");
            return;
        }

        // User has the correct role
        if (resolvedRole === allowedRole) {
            return;
        }

        // Student → Student Dashboard
        if (resolvedRole === "student") {
            router.replace("/dashboard");
            return;
        }

        // Faculty → Faculty Dashboard
        if (resolvedRole === "faculty") {
            router.replace("/faculty-dashboard");
            return;
        }

        // Researcher / Mentor are not implemented yet
        // Send them to the main dashboard for now.
        router.replace("/dashboard");
    }, [
        loading,
        checkingRole,
        resolvedRole,
        allowedRole,
        user,
        router,
    ]);

    if (loading || checkingRole) {
        return (
            <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />

                    <p className="text-sm text-gray-400">
                        Verifying your profile…
                    </p>
                </div>
            </div>
        );
    }

    if (!resolvedRole || resolvedRole !== allowedRole) {
        return null;
    }

    return <>{children}</>;
}