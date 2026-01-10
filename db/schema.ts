import { pgTable, serial, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// 文章统计表
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  views: integer('views').notNull().default(0),
  likes: integer('likes').notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('articles_slug_idx').on(table.slug),
  categoryIdx: index('articles_category_idx').on(table.category),
  viewsIdx: index('articles_views_idx').on(table.views),
}));

// 评论表
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleSlug: text('article_slug').notNull().references(() => articles.slug, { onDelete: 'cascade' }),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  content: text('content').notNull(),
  parentId: integer('parent_id'),
  status: text('status').notNull().default('pending'), // pending, approved, rejected
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  articleSlugIdx: index('comments_article_slug_idx').on(table.articleSlug),
  statusIdx: index('comments_status_idx').on(table.status),
  createdAtIdx: index('comments_created_at_idx').on(table.createdAt),
}));

// 点赞表（使用 IP 地址防止重复点赞）
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  articleSlug: text('article_slug').notNull().references(() => articles.slug, { onDelete: 'cascade' }),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  articleSlugIdx: index('likes_article_slug_idx').on(table.articleSlug),
  uniqueLike: index('likes_unique_idx').on(table.articleSlug, table.ipAddress),
}));

// 类型定义
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
