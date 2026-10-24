import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
config({ path: '.env.local' });

/**
 * 分类重构迁移：把数据库 articles.category 中的旧分类名更新为新分类名。
 * slug 未变（文章只换了目录），因此浏览量/点赞/评论不受影响。
 */
async function migrateCategories() {
  const { db } = await import('../db');
  const { articles } = await import('../db/schema');
  const { eq } = await import('drizzle-orm');
  const { CATEGORIES } = await import('../types/article');

  if (!db) {
    console.error('数据库未配置，请检查 DATABASE_URL');
    process.exit(1);
  }

  // 依据 articles/<category>/<slug>.md 反查 slug -> 新分类
  const slugToCategory = new Map<string, string>();
  for (const category of CATEGORIES) {
    const dir = path.join(process.cwd(), 'articles', category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      slugToCategory.set(file.slice(0, -3), category);
    }
  }

  console.log(`📂 文件系统中共找到 ${slugToCategory.size} 篇文章`);

  const rows = await db.select({ slug: articles.slug, category: articles.category }).from(articles);

  let updated = 0;
  for (const row of rows) {
    const decoded = decodeURIComponent(row.slug);
    const nextCategory = slugToCategory.get(decoded);
    if (!nextCategory || nextCategory === row.category) continue;
    await db.update(articles).set({ category: nextCategory }).where(eq(articles.slug, row.slug));
    console.log(`  ✅ ${decoded}: ${row.category} → ${nextCategory}`);
    updated++;
  }

  console.log(`✅ 迁移完成，共更新 ${updated} 条记录（共 ${rows.length} 条）`);
  process.exit(0);
}

migrateCategories();
