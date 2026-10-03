import { db } from './src/db/index.js';
import { institutions } from './src/db/schema.js';
import { migrate } from './src/db/migrate.js';

async function run() {
  try {
    await migrate();
    const res = await db.select().from(institutions);
    console.log("DB RESULT:", res);
  } catch (e) {
    console.error("TEST ERROR:", e);
  }
  process.exit(0);
}

run();
