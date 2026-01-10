#!/usr/bin/env tsx
/**
 * 数据库迁移检查脚本
 * 用途：检查 schema 和实际数据库是否同步
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function checkMigrationStatus() {
  console.log('🔄 数据库迁移状态检查\n');

  // 检查是否存在迁移表
  const migrationTable = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'drizzle_migrations'
    )
  `;

  if (migrationTable[0].exists) {
    console.log('✅ 迁移表存在');

    const migrations = await sql`
      SELECT * FROM drizzle_migrations
      ORDER BY created_at DESC
      LIMIT 10
    `;

    if (migrations.length > 0) {
      console.log(`\n📝 最近的迁移 (${migrations.length} 条):`);
      migrations.forEach((m: any) => {
        console.log(`  • ${m.name}`);
        console.log(`    创建时间: ${m.created_at}`);
        console.log(`    Hash: ${m.hash}`);
      });
    } else {
      console.log('\n ℹ️ 尚未执行任何迁移');
    }
  } else {
    console.log('⚠️ 迁移表不存在，需要执行迁移');
  }

  // 检查 schema 定义
  console.log('\n📋 Schema 定义:');
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;

  tables.forEach((t: any) => {
    console.log(`  • ${t.table_name}`);
  });
}

checkMigrationStatus().catch(console.error);
