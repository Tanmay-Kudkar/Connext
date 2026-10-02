import { defineConfig, devices } from "@playwright/test";

const apiUrl = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3001";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm start",
      cwd: "../backend",
      url: "http://127.0.0.1:3001/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL ?? "postgres://connext:connext@localhost:5432/connext",
        EMBEDDING_BASE_URL: "mock",
        EMBEDDING_MODEL: "mock-hash",
        EMBEDDING_DIMENSIONS: "768",
        DEMO_LOGINS: "true",
        LOG_LEVEL: "error",
        PORT: "3001",
      },
    },
    {
      command: "npm run dev",
      cwd: ".",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ...process.env,
        API_INTERNAL_URL: apiUrl,
      },
    },
  ],
});
