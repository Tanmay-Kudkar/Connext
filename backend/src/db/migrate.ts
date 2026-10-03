import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { pool, isInMemoryDb } from "./index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function migrate(client?: pg.Client | pg.Pool) {
  let sql = fs.readFileSync(
    path.resolve(__dirname, "../../drizzle/0000_init.sql"),
    "utf8",
  );

  const targetPool = client ?? pool;

  if (isInMemoryDb) {
    // Clean SQL for pg-mem compatibility
    sql = sql
      .replace(/CREATE EXTENSION IF NOT EXISTS vector;/g, "")
      .replace(/CREATE INDEX IF NOT EXISTS posts_embedding_idx ON posts USING hnsw \(embedding vector_cosine_ops\);/g, "")
      .replace(/embedding vector\(768\)/g, "embedding text");

    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        await targetPool.query(stmt);
      } catch (err: any) {
        if (!err.message?.includes("Not supported")) {
          console.warn("[db-migrate] Notice:", err.message);
        }
      }
    }
    return;
  }

  await targetPool.query(sql);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(() => {
      console.log("Migrated.");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
