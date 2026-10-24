import { config } from 'dotenv';
config({ path: '.env.local' });

async function checkSlugs() {
  const { db } = await import('../db');
  const { articles } = await import('../db/schema');

  if (!db) {
    console.error('数据库未配置，请检查 DATABASE_URL');
    process.exit(1);
  }

  const allArticles = await db.select({
    slug: articles.slug,
    category: articles.category,
    views: articles.views,
    likes: articles.likes
  }).from(articles);

  console.log('数据库中的文章 (前20条):');
  allArticles.slice(0, 20).forEach(a => {
    console.log(`  slug: ${a.slug}, category: ${a.category}, views: ${a.views}, likes: ${a.likes}`);
  });

  process.exit(0);
}

checkSlugs();
