#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkIndexes() {
  console.log('📊 检查数据库索引...\n');

  // 检查 articles 表的索引
  const articleIndexes = await sql`
    SELECT
      indexname,
      indexdef
    FROM pg_indexes
    WHERE tablename = 'articles'
  `;

  console.log('📝 Articles 表的索引:');
  articleIndexes.forEach((idx: any) => {
    console.log(`  • ${idx.indexname}`);
  });

  // 测试查询性能（使用 EXPLAIN ANALYZE）
  console.log('\n⚡ 测试查询性能:\n');

  // 测试 1: 根据 slug 查找
  console.log('1. 根据 slug 查找文章:');
  const slugTest = await sql`
    EXPLAIN ANALYZE
    SELECT * FROM articles WHERE slug = '41-_%E5%A6%82%E4%BD%95%E9%98%85%E8%AF%BB%E4%B8%80%E6%9C%AC%E4%B9%A6_%E7%B2%BE%E8%A6%81_%E4%BB%8E%E8%A2%AB%E5%8A%A8%E9%98%85%E8%AF%BB%E5%88%B0%E4%B8%BB%E5%8A%A8%E6%80%9D%E8%80%83'
  `;
  console.log(`  执行时间: ${slugTest[0]['QUERY PLAN']}`);

  // 测试 2: 按浏览量排序
  console.log('\n2. 按浏览量排序获取热门文章:');
  const viewsTest = await sql`
    EXPLAIN ANALYZE
    SELECT * FROM articles ORDER BY views DESC LIMIT 10
  `;
  console.log(`  执行时间: ${viewsTest[0]['QUERY PLAN']}`);
}

checkIndexes().catch(console.error);
