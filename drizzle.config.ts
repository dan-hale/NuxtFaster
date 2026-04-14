import { env } from 'node:process'
import { defineConfig } from 'drizzle-kit'

if (!env.DATABASE_URL)
  throw new Error('POSTGRES_URL is not set')

export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
