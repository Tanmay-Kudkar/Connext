import { execSync } from "node:child_process";
import path from "node:path";

export default async function globalSetup() {
  const backend = path.resolve(process.cwd(), "../backend");
  execSync("npx tsx src/db/seed.ts", {
    cwd: backend,
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL ?? "postgres://connext:connext@localhost:5432/connext",
      EMBEDDING_BASE_URL: "mock",
    },
  });
}
