const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
    });

    if (!res.ok) {
        let errMsg = `Request failed (${res.status})`;
        try {
            const json = await res.json();
            errMsg = json.message ?? json.error ?? errMsg;
        } catch {
            // ignore parse error
        }
        throw new Error(errMsg);
    }

    return res.json() as Promise<T>;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface RequestOtpResult {
    message: string;
}

export async function requestOtp(email: string): Promise<RequestOtpResult> {
    return apiFetch<RequestOtpResult>("/api/auth/request-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
    });
}

export interface PublicUser {
    id: string;
    handle: string;
    displayName: string;
    initials: string;
    role: string;
    mode: string;
    accent: string;
    avatarPack: string;
    bio: string | null;
    skills: string[];
    interests: string[];
    institution: {
        id: string;
        name: string;
        short: string;
        city: string;
        state: string;
    } | null;
}

export interface VerifyOtpResult {
    needsOnboarding: boolean;
    email?: string;
    user?: PublicUser;
}

export async function verifyOtp(params: {
    email: string;
    otp: string;
    handle?: string;
    displayName?: string;
    mode?: "vibe" | "pro";
}): Promise<VerifyOtpResult> {
    return apiFetch<VerifyOtpResult>("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

export async function getMe(): Promise<{ user: PublicUser }> {
    return apiFetch<{ user: PublicUser }>("/api/auth/me");
}

export async function logout(): Promise<void> {
    await apiFetch("/api/auth/logout", { method: "POST" });
}

// ─── Users ─────────────────────────────────────────────────────────────────

export async function updateMe(body: {
    mode?: "vibe" | "pro";
    accent?: string;
    avatarPack?: string;
    bio?: string;
    displayName?: string;
}): Promise<{ user: PublicUser }> {
    return apiFetch<{ user: PublicUser }>("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify(body),
    });
}

// ─── GitHub ─────────────────────────────────────────────────────────────────

export interface GithubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    pushed_at: string;
    topics: string[];
}

export interface GithubProfile {
    profile: {
        login: string;
        name: string | null;
        bio: string | null;
        avatar_url: string;
        html_url: string;
        public_repos: number;
        followers: number;
        following: number;
        location: string | null;
        company: string | null;
        blog: string | null;
        created_at: string;
    };
    repos: GithubRepo[];
    contributions: {
        totalCommits: number;
        recentEvents: { type: string; repo: string; created_at: string }[];
    };
}

export async function fetchGithubProfile(username: string): Promise<GithubProfile> {
    return apiFetch<GithubProfile>(`/api/github/${encodeURIComponent(username)}`);
}
