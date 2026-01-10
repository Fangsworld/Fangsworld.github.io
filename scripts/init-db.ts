#!/usr/bin/env tsx

/**
 * 初始化数据库表
 * 运行方式: npx tsx scripts/init-db.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// 加载 .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function initDatabase() {
  console.log('🔧 开始初始化数据库...\n');

  try {
    // 创建文章统计表
    console.log('创建 articles 表...');
    await sql`
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT,
        views INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        comment_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ articles 表创建成功');

    // 创建评论表
    console.log('创建 comments 表...');
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        content TEXT NOT NULL,
        parent_id INTEGER,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ comments 表创建成功');

    // 创建点赞表
    console.log('创建 likes 表...');
    await sql`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log('✅ likes 表创建成功');

    // 创建索引
    console.log('\n创建索引...');

    await sql`CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug)`;
    await sql`CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category)`;
    await sql`CREATE INDEX IF NOT EXISTS articles_views_idx ON articles(views)`;
    console.log('✅ articles 索引创建成功');

    await sql`CREATE INDEX IF NOT EXISTS comments_article_slug_idx ON comments(article_slug)`;
    await sql`CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status)`;
    await sql`CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at)`;
    console.log('✅ comments 索引创建成功');

    await sql`CREATE INDEX IF NOT EXISTS likes_article_slug_idx ON likes(article_slug)`;
    await sql`CREATE INDEX IF NOT EXISTS likes_unique_idx ON likes(article_slug, ip_address)`;
    console.log('✅ likes 索引创建成功');

    // 验证表创建
    console.log('\n🔍 验证表创建...');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `;

    console.log('✅ 数据库中的表:');
    tables.forEach((table: any) => {
      console.log(`   - ${table.table_name}`);
    });

    console.log('\n🎉 数据库初始化完成！');
    console.log('\n现在可以启动开发服务器:');
    console.log('  npm run dev');

  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
