import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.POSTGRES_URL ??
      process.env.DATABASE_URL ??
      "",
  },
  verbose: true,
  strict: true,
});
