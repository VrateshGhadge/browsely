import 'server-only'
import { drizzle } from 'drizzle-orm/neon-http'

// Pooled connection string for application queries
export const db = drizzle(process.env.DATABASE_URL!)
