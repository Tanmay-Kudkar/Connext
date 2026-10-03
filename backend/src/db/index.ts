import pg from "pg";
import { newDb } from "pg-mem";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";
import * as schema from "./schema.js";

export let isInMemoryDb = false;

async function createPool(): Promise<pg.Pool> {
  const realPool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 1500,
  });

  try {
    const client = await realPool.connect();
    client.release();
    console.log(`[db] ✅ Connected to PostgreSQL database at ${env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")}`);
    return realPool;
  } catch (err) {
    console.warn(`[db] ℹ️ No active PostgreSQL connection found at ${env.DATABASE_URL.replace(/:[^:@]+@/, ":****@")}. Using In-Memory Database fallback.`);
    isInMemoryDb = true;

    const mem = newDb();

    // Disable strict AST coverage checks in pg-mem DDL planner
    (mem.public as any).config?.implementation?.("astCoverageCheck", () => {});

    // Register vector, int, and date types for pgvector & Postgres compatibility in pg-mem
    try {
      mem.public.registerType({
        name: "vector",
        serialize: (v: any) => String(v),
      });
      mem.public.registerType({
        name: "int",
        serialize: (v: any) => Number(v),
      });
      mem.public.registerType({
        name: "date",
        serialize: (v: any) => String(v),
      });
    } catch (e) {}

    mem.public.registerFunction({
      name: "vector",
      args: [],
      returns: "text",
      implementation: (val: any) => val,
    });

    const pgAdapter = mem.adapters.createPg();

    // Strip config.types and handle rowMode="array" so pg-mem doesn't throw
    const origClientQuery = pgAdapter.Client.prototype.query;
    pgAdapter.Client.prototype.query = function (config: any, values: any, cb: any) {
      let isArrayMode = false;
      if (config && typeof config === "object") {
        delete config.types;
        if (config.rowMode === "array") {
          isArrayMode = true;
          delete config.rowMode;
        }
      }
      
      const res = origClientQuery.call(this, config, values, cb);
      if (res && typeof res.then === "function") {
        return res.then((r: any) => {
          if (isArrayMode && r && Array.isArray(r.rows)) {
            r.rows = r.rows.map((row: any) => Object.values(row));
          }
          return r;
        });
      }
      return res;
    };

    const memPool = new pgAdapter.Pool() as any;
    const origPoolQuery = memPool.query;
    memPool.query = function (config: any, values: any, cb: any) {
      let isArrayMode = false;
      if (config && typeof config === "object") {
        delete config.types;
        if (config.rowMode === "array") {
          isArrayMode = true;
          delete config.rowMode;
        }
      }

      const res = origPoolQuery.call(this, config, values, cb);
      if (res && typeof res.then === "function") {
        return res.then((r: any) => {
          if (isArrayMode && r && Array.isArray(r.rows)) {
            r.rows = r.rows.map((row: any) => Object.values(row));
          }
          return r;
        });
      }
      return res;
    };

    return memPool as unknown as pg.Pool;
  }
}

export const pool = await createPool();
export const db = drizzle(pool, { schema });
