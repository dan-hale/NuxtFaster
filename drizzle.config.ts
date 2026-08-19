import { env } from 'node:process'
import { defineConfig } from 'drizzle-kit'

const {TURSO_DATABASE_URL, TURSO_AUTH_TOKEN} = env
if (!TURSO_DATABASE_URL)   throw new Error('TURSO_DATABASE_URL is required')
if (!TURSO_AUTH_TOKEN) throw new Error('TURSO_AUTH_TOKEN is required')

export default defineConfig({
  schema: './db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
})
