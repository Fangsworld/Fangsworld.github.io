#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function test() {
  const testSlug = '41-_%E5%A6%82%E4%BD%95%E9%98%85%E8%AF%BB%E4%B8%80%E6%9C%AC%E4%B9%A6_%E7%B2%BE%E8%A6%81_%E4%BB%8E%E8%A2%AB%E5%8A%A8%E9%98%85%E8%AF%BB%E5%88%B0%E4%B8%BB%E5%8A%A8%E6%80%9D%E8%80%83';
  
  console.log('Testing query for slug:', testSlug);
  
  const result = await sql`
    SELECT slug, views
    FROM articles
    WHERE slug = ${testSlug}
  `;
  
  console.log('Query result:', result);
}

test().catch(console.error);
