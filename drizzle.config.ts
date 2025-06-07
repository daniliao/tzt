import { defineConfig } from 'drizzle-kit';
import path from 'path'
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const connectionString = process.env.NEON_DATABASE_URL || '';
const [host, port, user, ***REMOVED***, database] = connectionString
  .replace('postgres://', '')
  .split(/[\/:@?]/);

export default defineConfig({
  schema: './src/data/server/db-schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    host,
    port: parseInt(port),
    user,
    ***REMOVED***,
    database,
    ssl: true
  },
});
