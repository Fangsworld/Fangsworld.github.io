import { db } from './index';
import { articles, comments, likes } from './schema';
import { eq, desc, and, sql, inArray } from 'drizzle-orm';

// 辅助函数：获取数据库实例
function getDb() {
  if (!db) {
    throw new Error('Database is not available. Please set DATABASE_URL environment variable.');
  }
  return db;
}

// ===== 文章统计相关 =====

/**
 * 获取或创建文章记录
 */
export async function getOrCreateArticle(slug: string, category: string, title: string, excerpt?: string) {
  const database = getDb();
  // 先解码再编码，确保不会双重编码
  const normalizedSlug = encodeURIComponent(decodeURIComponent(slug));
  const existing = await database.select().from(articles).where(eq(articles.slug, normalizedSlug)).limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const [newArticle] = await database.insert(articles)
    .values({
      slug: normalizedSlug,
      category,
      title,
      excerpt: excerpt || '',
    })
    .returning();
  return newArticle;
}

/**
 * 增加文章浏览量
 */
export async function incrementArticleViews(slug: string) {
  const database = getDb();
  // 先解码再编码，确保不会双重编码
  const normalizedSlug = encodeURIComponent(decodeURIComponent(slug));
  await database.update(articles)
    .set({
      views: sql`${articles.views} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(articles.slug, normalizedSlug));
}

/**
 * 获取热门文章（按浏览量排序）
 */
export async function getPopularArticles(limit: number = 10) {
  const database = getDb();
  return await database.select()
    .from(articles)
    .orderBy(desc(articles.views))
    .limit(limit);
}

/**
 * 获取文章统计数据
 */
export async function getArticleStats(slug: string) {
  const database = getDb();
  // 先解码再编码，确保不会双重编码
  const normalizedSlug = encodeURIComponent(decodeURIComponent(slug));
  const [article] = await database.select({
    views: articles.views,
    likes: articles.likes,
    commentCount: articles.commentCount,
  })
    .from(articles)
    .where(eq(articles.slug, normalizedSlug))
    .limit(1);

  return article || { views: 0, likes: 0, commentCount: 0 };
}

/**
 * 批量获取多篇文章的统计数据
 */
export async function getArticlesStats(slugs: string[]): Promise<Array<{ slug: string; views: number; likes: number; commentCount: number }>> {
  if (slugs.length === 0) return [];

  const database = getDb();

  // 将 slugs 进行 URL 编码以匹配数据库中存储的格式
  const encodedSlugs = slugs.map(s => encodeURIComponent(s));

  console.log('[getArticlesStats] Input slugs:', slugs.slice(0, 3));
  console.log('[getArticlesStats] Encoded slugs:', encodedSlugs.slice(0, 3));

  const result = await database
    .select({
      slug: articles.slug,
      views: articles.views,
      likes: articles.likes,
      commentCount: articles.commentCount,
    })
    .from(articles)
    .where(inArray(articles.slug, encodedSlugs));

  console.log('[getArticlesStats] Result count:', result.length);

  return result;
}

// ===== 评论相关 =====

/**
 * 创建评论
 */
export async function createComment(data: {
  articleSlug: string;
  authorName: string;
  authorEmail: string;
  content: string;
  parentId?: number;
}) {
  const database = getDb();
  const [comment] = await database.insert(comments)
    .values({
      ...data,
      status: 'pending', // 默认需要审核
    })
    .returning();

  // 增加文章评论计数
  await database.update(articles)
    .set({
      commentCount: sql`${articles.commentCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(articles.slug, data.articleSlug));

  return comment;
}

/**
 * 获取文章的已批准评论
 */
export async function getApprovedComments(articleSlug: string) {
  const database = getDb();
  return await database.select()
    .from(comments)
    .where(
      and(
        eq(comments.articleSlug, articleSlug),
        eq(comments.status, 'approved')
      )
    )
    .orderBy(desc(comments.createdAt));
}

/**
 * 获取待审核评论（用于管理后台）
 */
export async function getPendingComments() {
  const database = getDb();
  return await database.select()
    .from(comments)
    .where(eq(comments.status, 'pending'))
    .orderBy(desc(comments.createdAt));
}

/**
 * 批准评论
 */
export async function approveComment(commentId: number) {
  const database = getDb();
  const [comment] = await database.update(comments)
    .set({
      status: 'approved',
      updatedAt: new Date(),
    })
    .where(eq(comments.id, commentId))
    .returning();

  return comment;
}

/**
 * 拒绝评论
 */
export async function rejectComment(commentId: number) {
  const database = getDb();
  const [comment] = await database.update(comments)
    .set({
      status: 'rejected',
      updatedAt: new Date(),
    })
    .where(eq(comments.id, commentId))
    .returning();

  // 减少文章评论计数
  if (comment) {
    await database.update(articles)
      .set({
        commentCount: sql`GREATEST(${articles.commentCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(articles.slug, comment.articleSlug));
  }

  return comment;
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: number) {
  const database = getDb();
  const [comment] = await database.select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1);

  if (comment) {
    await database.delete(comments).where(eq(comments.id, commentId));

    // 减少文章评论计数
    await database.update(articles)
      .set({
        commentCount: sql`GREATEST(${articles.commentCount} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(articles.slug, comment.articleSlug));
  }

  return comment;
}

// ===== 点赞相关 =====

/**
 * 切换点赞状态
 */
export async function toggleLike(articleSlug: string, ipAddress: string, userAgent?: string) {
  const database = getDb();
  // 检查是否已经点赞
  const [existing] = await database.select()
    .from(likes)
    .where(
      and(
        eq(likes.articleSlug, articleSlug),
        eq(likes.ipAddress, ipAddress)
      )
    )
    .limit(1);

  if (existing) {
    // 取消点赞
    await database.delete(likes).where(eq(likes.id, existing.id));

    // 减少文章点赞计数
    await database.update(articles)
      .set({
        likes: sql`GREATEST(${articles.likes} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(articles.slug, articleSlug));

    return { liked: false, totalLikes: (await getArticleStats(articleSlug)).likes };
  } else {
    // 添加点赞
    await database.insert(likes).values({
      articleSlug,
      ipAddress,
      userAgent,
    });

    // 增加文章点赞计数
    await database.update(articles)
      .set({
        likes: sql`${articles.likes} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(articles.slug, articleSlug));

    return { liked: true, totalLikes: (await getArticleStats(articleSlug)).likes };
  }
}

/**
 * 检查用户是否已点赞
 */
export async function hasUserLiked(articleSlug: string, ipAddress: string) {
  const database = getDb();
  const [existing] = await database.select()
    .from(likes)
    .where(
      and(
        eq(likes.articleSlug, articleSlug),
        eq(likes.ipAddress, ipAddress)
      )
    )
    .limit(1);

  return !!existing;
}
