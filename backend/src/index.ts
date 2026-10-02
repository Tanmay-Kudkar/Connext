import { env } from "./env.js";
import { migrate } from "./db/migrate.js";
import { buildApp } from "./app.js";
import { assertEmbeddingConfig } from "./services/embeddings.js";

async function main() {
  await migrate();
  try {
    await assertEmbeddingConfig();
  } catch (err) {
    console.error("Embedding config failed", err);
    process.exit(1);
  }
  const app = await buildApp();
  await app.listen({ port: env.PORT, host: "0.0.0.0" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
