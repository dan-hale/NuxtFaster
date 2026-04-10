import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "~~/db/schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function useDb() {
  if (dbInstance) return dbInstance;
  const config = useRuntimeConfig();
  const url = config.databaseUrl as string;
  if (!url) {
    throw new Error("DATABASE_URL / NUXT_DATABASE_URL is not set");
  }
  const sql = neon(url);
  dbInstance = drizzle({ client: sql, schema });
  return dbInstance;
}
