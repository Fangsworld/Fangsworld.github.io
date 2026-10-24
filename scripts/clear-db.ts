import { config } from 'dotenv';
config({ path: '.env.local' });

async function clearDatabase() {
  const { db } = await import('../db');
  const { articles, comments, likes } = await import('../db/schema');
  const { sql } = await import('drizzle-orm');

  console.log('🗑️ 清理数据库...');

  if (!db) {
    console.error('数据库未配置，请检查 DATABASE_URL');
    process.exit(1);
  }

  // 删除所有数据（按依赖顺序）
  await db.delete(comments);
  await db.delete(likes);
  await db.delete(articles);

  // 重置自增序列
  await db.execute(sql`ALTER SEQUENCE articles_id_seq RESTART WITH 1`);
  await db.execute(sql`ALTER SEQUENCE comments_id_seq RESTART WITH 1`);

  console.log('✅ 数据库已清理，数据将重新开始积累');
  process.exit(0);
}

clearDatabase();
