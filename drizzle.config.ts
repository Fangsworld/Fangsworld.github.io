import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { resolve } from 'path';

// 加载 .env.local 文件
config({ path: resolve(process.cwd(), '.env.local') });

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
