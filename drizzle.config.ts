import { defineConfig } from 'drizzle-kit';
import path from 'path'
export default defineConfig({
  schema: './src/data/server/db-schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
});
