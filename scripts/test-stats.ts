#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// 加载 .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function test() {
  console.log('Testing database query...\n');
  
  // 获取所有文章的浏览量
  const articles = await sql`
    SELECT slug, views, likes, comment_count
    FROM articles
    ORDER BY views DESC
    LIMIT 10
  `;
  
  console.log('Current articles in database:');
  articles.forEach((a: any) => {
    console.log(`  ${a.slug}: views=${a.views}, likes=${a.likes}`);
  });
}

test().catch(console.error);
