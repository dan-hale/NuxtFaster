import { env } from 'node:process'
import { drizzle } from 'drizzle-orm/libsql'
import { relations } from '~~/db/relations'

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = env
if (!TURSO_DATABASE_URL)
  throw new Error('TURSO_DATABASE_URL is required')
if (!TURSO_AUTH_TOKEN)
  throw new Error('TURSO_AUTH_TOKEN is required')

export const db = drizzle({
  connection: {
    url: TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  relations,
})
