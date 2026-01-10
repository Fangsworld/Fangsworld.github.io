#!/usr/bin/env tsx
/**
 * 网站统计查看脚本
 * 显示：文章统计、访问统计、热门文章等
 */

import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function viewStats() {
  console.log('\n📊 网站统计数据\n');
  console.log('═'.repeat(60));

  // 1. 基础统计
  console.log('\n📈 基础统计:');
  const basic = await sql`
    SELECT
      (SELECT COUNT(*) FROM articles) as total_articles,
      (SELECT SUM(views) FROM articles) as total_views,
      (SELECT SUM(likes) FROM articles) as total_likes,
      (SELECT COUNT(*) FROM comments WHERE status = 'approved') as total_comments,
      (SELECT COUNT(DISTINCT category) FROM articles) as categories
  `;
  console.log(`  📝 文章总数: ${basic[0].total_articles}`);
  console.log(`  👁️  总浏览量: ${basic[0].total_views}`);
  console.log(`  ❤️  总点赞数: ${basic[0].total_likes}`);
  console.log(`  💬 总评论数: ${basic[0].total_comments}`);
  console.log(`  📂 分类数量: ${basic[0].categories}`);

  // 2. 热门文章 Top 10
  console.log('\n🔥 热门文章 Top 10:');
  const topArticles = await sql`
    SELECT
      title,
      category,
      views,
      likes,
      comment_count
    FROM articles
    WHERE views > 0
    ORDER BY views DESC
    LIMIT 10
  `;

  topArticles.forEach((article: any, i: number) => {
    const rank = i + 1;
    const emoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `  ${rank}.`;
    console.log(`  ${emoji} ${article.title.substring(0, 30)}...`);
    console.log(`      👁️ ${article.views} | ❤️ ${article.likes} | 💬 ${article.comment_count} | 📂 ${article.category}`);
  });

  // 3. 分类统计
  console.log('\n📂 分类统计:');
  const categoryStats = await sql`
    SELECT
      category,
      COUNT(*) as count,
      SUM(views) as total_views,
      SUM(likes) as total_likes
    FROM articles
    GROUP BY category
    ORDER BY total_views DESC
  `;

  const categoryNames: Record<string, string> = {
    reading: '阅读',
    writing: '写作',
    logic: '逻辑',
    speech: '言语',
  };

  categoryStats.forEach((cat: any) => {
    const name = categoryNames[cat.category] || cat.category;
    console.log(`  📚 ${name}:`);
    console.log(`     文章数: ${cat.count} | 浏览: ${cat.total_views} | 点赞: ${cat.total_likes}`);
  });

  // 4. 最受喜爱文章（点赞最多）
  console.log('\n❤️  最受喜爱文章 Top 5:');
  const mostLiked = await sql`
    SELECT
      title,
      likes,
      views,
      round((likes::numeric / NULLIF(views::numeric, 0) * 100), 2) as like_rate
    FROM articles
    WHERE views > 0
    ORDER BY likes DESC
    LIMIT 5
  `;

  mostLiked.forEach((article: any, i: number) => {
    console.log(`  ${i + 1}. ${article.title.substring(0, 35)}...`);
    console.log(`     ❤️ ${article.likes} | 👁️ ${article.views} | 点赞率: ${article.like_rate}%`);
  });

  // 5. 评论最多文章
  console.log('\n💬 讨论最热烈文章 Top 5:');
  const mostCommented = await sql`
    SELECT
      title,
      comment_count,
      views
    FROM articles
    WHERE comment_count > 0
    ORDER BY comment_count DESC
    LIMIT 5
  `;

  mostCommented.forEach((article: any, i: number) => {
    console.log(`  ${i + 1}. ${article.title.substring(0, 35)}...`);
    console.log(`     💬 ${article.comment_count} 条评论 | 👁️ ${article.views} 浏览`);
  });

  // 6. 最近活跃
  console.log('\n🕐 最近发布文章 (最新 5 篇):');
  const recent = await sql`
    SELECT
      title,
      created_at,
      views
    FROM articles
    ORDER BY created_at DESC
    LIMIT 5
  `;

  recent.forEach((article: any, i: number) => {
    const date = new Date(article.created_at).toLocaleDateString('zh-CN');
    console.log(`  ${i + 1}. ${article.title.substring(0, 30)}...`);
    console.log(`     📅 ${date} | 👁️ ${article.views}`);
  });

  // 7. 评论统计
  console.log('\n💭 评论统计:');
  const commentStats = await sql`
    SELECT
      status,
      COUNT(*) as count
    FROM comments
    GROUP BY status
  `;

  const statusNames: Record<string, string> = {
    approved: '✅ 已批准',
    pending: '⏳ 待审核',
    rejected: '❌ 已拒绝',
  };

  commentStats.forEach((stat: any) => {
    const name = statusNames[stat.status] || stat.status;
    console.log(`  ${name}: ${stat.count}`);
  });

  console.log('\n' + '═'.repeat(60));
  console.log('✅ 统计完成\n');
}

viewStats().catch(console.error);
