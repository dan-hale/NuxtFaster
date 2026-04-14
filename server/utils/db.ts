import { env } from 'node:process'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '~~/db/schema'

if (!env.DATABASE_URL)
  throw new Error('POSTGRES_URL is not set')

const sql = neon(env.DATABASE_URL)
const dbInstance = drizzle({ client: sql, schema })

export function useDb() {
  return dbInstance
}
