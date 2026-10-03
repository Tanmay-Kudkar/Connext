import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { env } from "../env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function migrate(client?: pg.Client | pg.Pool) {
  const sql = fs.readFileSync(
    path.resolve(__dirname, "../../drizzle/0000_init.sql"),
    "utf8",
  );
  if (client) {
    await client.query(sql);
    return;
  }
  const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
  await pool.query(sql);
  await pool.end();
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
