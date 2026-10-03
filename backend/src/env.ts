function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env ${name}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: required(
    "DATABASE_URL",
    "postgres://connext:connext@localhost:5432/connext",
  ),
  JWT_SECRET: required("JWT_SECRET", "connext-demo-jwt-secret-do-not-use-prod"),
  PORT: Number(process.env.PORT ?? 3001),
  COOKIE_NAME: process.env.COOKIE_NAME ?? "connext_session",
  NODE_ENV: process.env.NODE_ENV ?? "development",
  DEMO_LOGINS: (process.env.DEMO_LOGINS ?? "true") === "true",
  EMBEDDING_BASE_URL: process.env.EMBEDDING_BASE_URL ?? "mock",
  EMBEDDING_API_KEY: process.env.EMBEDDING_API_KEY ?? "",
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL ?? "mock-hash",
  EMBEDDING_DIMENSIONS: Number(process.env.EMBEDDING_DIMENSIONS ?? 768),
  EMBEDDING_FALLBACK_BASE_URL: process.env.EMBEDDING_FALLBACK_BASE_URL ?? "",
  EMBEDDING_FALLBACK_API_KEY: process.env.EMBEDDING_FALLBACK_API_KEY ?? "",
  EMBEDDING_FALLBACK_MODEL: process.env.EMBEDDING_FALLBACK_MODEL ?? "",
  GITHUB_TOKEN:         process.env.GITHUB_TOKEN         ?? "",
  GITHUB_CLIENT_ID:     process.env.GITHUB_CLIENT_ID     ?? "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET ?? "",
  GITHUB_CALLBACK_URL:  process.env.GITHUB_CALLBACK_URL  ?? "http://localhost:3001/api/auth/github/callback",
  GITHUB_DATA_OWNER:    process.env.GITHUB_DATA_OWNER    ?? "Tanmay-Kudkar",
  GITHUB_DATA_REPO:     process.env.GITHUB_DATA_REPO     ?? "Connext-Community",
};

export const isProd = env.NODE_ENV === "production";
