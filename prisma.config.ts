import { defineConfig } from '@prisma/client'
import pg from 'pg'

export default defineConfig({
  adapter: {
    provider: 'pg',
    url: process.env.DATABASE_URL!,
    // Optional: Configure connection pool
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }),
  },
})
