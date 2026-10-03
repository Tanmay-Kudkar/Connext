import "dotenv/config";
import { env } from "./env.js";
import { isInMemoryDb } from "./db/index.js";
import { migrate } from "./db/migrate.js";
import { seed } from "./db/seed.js";
import { buildApp } from "./app.js";
import { assertEmbeddingConfig } from "./services/embeddings.js";

async function main() {
  await migrate();
  if (isInMemoryDb) {
    try {
      console.log("[db] Auto-seeding initial dataset into in-memory database...");
      await seed();
    } catch (err) {
      console.warn("[db] Seed notice:", err);
    }
  }

  try {
    await assertEmbeddingConfig();
  } catch (err) {
    console.error("Embedding config failed", err);
    process.exit(1);
  }

  const app = await buildApp();
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  console.log(`[server] 🚀 Connext API running at http://localhost:${env.PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
