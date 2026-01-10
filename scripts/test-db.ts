#!/usr/bin/env tsx

/**
 * 数据库连接测试脚本
 * 运行方式: npx tsx scripts/test-db.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// 加载 .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { db } from '../db/index';
import { getArticleStats } from '../db/queries';

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...\n');

  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');

  try {
    // 测试数据库是否可用
    if (!db) {
      console.error('❌ 数据库未配置');
      console.log('\n请确保已设置 DATABASE_URL 环境变量');
      process.exit(1);
    }

    console.log('✅ 数据库连接成功');

    // 测试查询（不需要真实数据）
    console.log('\n📊 测试查询...');
    const testSlug = 'test-article-' + Date.now();
    const stats = await getArticleStats(testSlug);
    console.log('✅ 查询测试成功:', stats);

    console.log('\n🎉 数据库配置完成！');
    console.log('\n现在你可以启动开发服务器:');
    console.log('  npm run dev');
    console.log('\n访问任意文章页面，你应该能看到:');
    console.log('  - 文章统计（浏览量、点赞、评论）');
    console.log('  - 评论表单');
    console.log('  - 评论列表');

  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    console.log('\n可能的原因:');
    console.log('1. DATABASE_URL 未正确配置');
    console.log('2. 数据库表未创建（请在 Beekeeper Studio 中执行 SQL）');
    console.log('3. 网络连接问题');
    console.log('\n错误详情:', error);
    process.exit(1);
  }
}

testDatabaseConnection();
