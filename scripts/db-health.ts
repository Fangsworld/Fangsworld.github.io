#!/usr/bin/env tsx
/**
 * 数据库健康检查脚本
 * 用途：检查数据库连接、表大小、索引使用情况等
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function healthCheck() {
  console.log('🔍 数据库健康检查\n');
  console.log('═'.repeat(60));

  // 1. 基本统计
  console.log('\n📊 基本统计:');
  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM articles) as articles,
      (SELECT COUNT(*) FROM comments) as comments,
      (SELECT COUNT(*) FROM likes) as likes,
      pg_size_pretty(pg_database_size(current_database())) as db_size
  `;
  console.log(`  • 文章数: ${stats[0].articles}`);
  console.log(`  • 评论数: ${stats[0].comments}`);
  console.log(`  • 点赞数: ${stats[0].likes}`);
  console.log(`  • 数据库大小: ${stats[0].db_size}`);

  // 2. 表大小
  console.log('\n📦 表大小:');
  const tableSizes = await sql`
    SELECT
      schemaname,
      tablename,
      pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
  `;
  tableSizes.forEach((table: any) => {
    console.log(`  • ${table.tablename}: ${table.size}`);
  });

  // 3. 索引使用情况
  console.log('\n🔑 索引统计:');
  try {
    const indexStats = await sql`
      SELECT
        schemaname,
        relname::text as table_name,
        indexrelname::text as index_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched
      FROM pg_stat_user_indexes
      WHERE schemaname = 'public'
      ORDER BY idx_scan DESC
    `;

    if (indexStats.length > 0) {
      indexStats.forEach((idx: any) => {
        const usage = idx.index_scans > 0 ? '✅' : '⏸️';
        console.log(`  ${usage} ${idx.index_name}`);
        console.log(`      表: ${idx.table_name}`);
        console.log(`      扫描次数: ${idx.index_scans}`);
      });
    } else {
      console.log('  ℹ️ 暂无索引统计信息');
    }
  } catch (e) {
    console.log('  ℹ️ 无法获取索引统计（权限限制）');
  }

  // 4. 查询性能（Top 5 慢查询）
  console.log('\n⚡ 查询性能:');
  try {
    const slowQueries = await sql`
      SELECT
        query,
        calls,
        total_time,
        mean_time
      FROM pg_stat_statements
      ORDER BY mean_time DESC
      LIMIT 5
    `;

    if (slowQueries.length > 0) {
      console.log('  慢查询 Top 5:');
      slowQueries.forEach((q: any, i: number) => {
        const queryPreview = q.query.substring(0, 50) + '...';
        console.log(`  ${i + 1}. ${queryPreview}`);
        console.log(`     调用次数: ${q.calls}, 平均时间: ${q.mean_time.toFixed(2)}ms`);
      });
    } else {
      console.log('  ℹ️ pg_stat_statements 未启用');
    }
  } catch (e) {
    console.log('  ℹ️ 无法获取慢查询统计（需要扩展）');
  }

  // 5. 连接数
  console.log('\n🔗 连接统计:');
  const connections = await sql`
    SELECT
      count(*) as total,
      count(*) FILTER (WHERE state = 'active') as active,
      count(*) FILTER (WHERE state = 'idle') as idle
    FROM pg_stat_activity
    WHERE datname = current_database()
  `;
  console.log(`  • 总连接: ${connections[0].total}`);
  console.log(`  • 活跃: ${connections[0].active}`);
  console.log(`  • 空闲: ${connections[0].idle}`);

  console.log('\n' + '═'.repeat(60));
  console.log('✅ 检查完成\n');
}

healthCheck().catch(console.error);
