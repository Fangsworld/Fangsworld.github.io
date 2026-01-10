# 03 - Schema 设计

## 📚 学习目标

完成本章后，你将能够：
- 设计合理的数据表结构
- 选择正确的字段类型
- 设计表之间的关系
- 创建和使用索引

---

## 1. 什么是 Schema？

### 简单理解

Schema 就像是**建筑蓝图**，定义了数据库的完整结构。

```
┌─────────────────────────────────────────────────────────────┐
│                      Schema 概念                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Schema 定义：                                              │
│  ├─ 有哪些表                                                │
│  ├─ 每个表有哪些字段                                         │
│  ├─ 字段的类型                                              │
│  ├─ 字段的约束                                              │
│  ├─ 表之间的关系                                            │
│  └─ 索引的定义                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 实际例子

```typescript
export const articles = pgTable('articles', {
  // 字段定义
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  // ...

}, (table) => ({
  // 索引定义
  titleIdx: index('articles_title_idx').on(table.title),
});
```

---

## 2. 字段类型

### 基础类型

```typescript
import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  // 自增整数（主键）
  id: serial('id').primaryKey(),

  // 文本类型
  username: text('username').notNull(),      // 不能为空
  email: text('email').unique(),             // 唯一
  bio: text('bio'),                          // 可为空

  // 整数类型
  age: integer('age'),
  followersCount: integer('followers_count').default(0),

  // 布尔类型
  isActive: boolean('is_active').default(true),

  // 时间戳
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### 类型对照表

| Drizzle 类型 | PostgreSQL 类型 | 说明 | 示例 |
|-------------|-----------------|------|------|
| `serial()` | `serial` | 自增整数 | 1, 2, 3... |
| `integer()` | `integer` | 整数 | -100, 0, 100 |
| `text()` | `text` | 文本（任意长度） | "Hello World" |
| `boolean()` | `boolean` | 布尔值 | true, false |
| `timestamp()` | `timestamp` | 时间戳 | 2025-01-09 10:00:00 |
| `numeric()` | `numeric` | 精确小数 | 99.99 |
| `jsonb()` | `jsonb` | JSON 数据 | {"key": "value"} |
| `array()` | `array` | 数组 | [1, 2, 3] |

### 高级类型

```typescript
// JSONB 类型（存储 JSON 数据）
export const articles = pgTable('articles', {
  metadata: jsonb('metadata').$type<{
    author: string;
    tags: string[];
    readingTime: number;
  }>(),
});

// 数组类型
export const posts = pgTable('posts', {
  tags: text('tags').array(),
  // 存储为: ["react", "javascript", "typescript"]
});

// 枚举类型（使用 text + check）
export const users = pgTable('users', {
  role: text('role').notNull(), // 'admin' | 'user' | 'guest'
});
```

---

## 3. 字段约束

### Primary Key（主键）

```typescript
// 每个表都应该有主键
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),  // 主键，唯一标识
});

// 复合主键（多个字段组成）
export const orderItems = pgTable('order_items', {
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.orderId, table.productId] }),
}));
```

### Unique（唯一约束）

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').unique(),     // 邮箱必须唯一
  username: text('username').unique(), // 用户名必须唯一
});
```

### Not Null（非空约束）

```typescript
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),    // 标题不能为空
  content: text('content'),         // 内容可以为空
});
```

### Default（默认值）

```typescript
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  views: integer('views').default(0),           // 默认 0 次浏览
  published: boolean('published').default(false), // 默认未发布
  createdAt: timestamp('created_at').defaultNow(), // 默认当前时间
});
```

### Foreign Key（外键）

```typescript
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id, {
    onDelete: 'cascade',  // 删除文章时，同时删除评论
  }),
  content: text('content').notNull(),
});
```

---

## 4. 表关系设计

### 一对一（One-to-One）

```typescript
// 用户表
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
});

// 用户资料表（一对一）
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  bio: text('bio'),
  avatar: text('avatar'),
});
```

### 一对多（One-to-Many）

```typescript
// 文章表
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
});

// 评论表（一篇文章有多条评论）
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id').references(() => articles.id),
  content: text('content').notNull(),
});
```

### 多对多（Many-to-Many）

```typescript
// 文章表
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
});

// 标签表
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

// 文章-标签关联表（多对多）
export const articleTags = pgTable('article_tags', {
  articleId: integer('article_id').references(() => articles.id),
  tagId: integer('tag_id').references(() => tags.id),
}, (table) => ({
  pk: primaryKey({ columns: [table.articleId, table.tagId] }),
}));
```

---

## 5. 索引设计

### 什么是索引？

索引就像书的目录，让查询更快。

```
没有索引：
└─ 从第一页开始，一页页查找
└─ 查找时间：O(n)

有索引：
└─ 直接跳到对应位置
└─ 查找时间：O(log n)
```

### 创建索引

```typescript
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  views: integer('views').default(0),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  // 单列索引
  slugIdx: index('articles_slug_idx').on(table.slug),

  // 组合索引
  categoryViewsIdx: index('articles_category_views_idx')
    .on(table.category, table.views),

  // 唯一索引
  slugUnique: unique('articles_slug_unique').on(table.slug),
}));
```

### 索引策略

**什么时候创建索引？**

```typescript
// ✅ 需要索引的场景
.where(eq(articles.slug, 'xxx'))           // slug 字段
.where(eq(articles.category, 'reading'))  // category 字段
.orderBy(desc(articles.views))            // views 字段

// ❌ 不需要索引的场景
// • 数据量小（< 100 行）
// • 很少查询的字段
// • 频繁更新的字段
```

### 索引类型

```typescript
// 1. 单列索引
index('idx_title').on(table.title)

// 2. 组合索引
index('idx_category_date').on(table.category, table.createdAt)

// 3. 唯一索引
unique('idx_email').on(table.email)

// 4. 部分索引（只索引满足条件的行）
.index('idx_published')
.on(table.published)
.where(eq(table.published, true))
```

---

## 6. 你的博客 Schema 设计

### 完整的博客 Schema

```typescript
// db/schema.ts
import { pgTable, serial, text, integer, timestamp, boolean, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 文章表
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),  // reading, writing, logic, speech
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
  articleSlug: text('article_slug').notNull().references(() => articles.slug, {
    onDelete: 'cascade',
  }),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  content: text('content').notNull(),
  parentId: integer('parent_id'),  // 回复评论
  status: text('status').notNull().default('pending'),  // pending, approved, rejected
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  articleSlugIdx: index('comments_article_slug_idx').on(table.articleSlug),
  statusIdx: index('comments_status_idx').on(table.status),
  createdAtIdx: index('comments_created_at_idx').on(table.createdAt),
}));

// 点赞表
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  articleSlug: text('article_slug').notNull().references(() => articles.slug, {
    onDelete: 'cascade',
  }),
  ipAddress: text('ip_address').notNull(),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  articleSlugIdx: index('likes_article_slug_idx').on(table.articleSlug),
  uniqueLike: unique('likes_unique_idx').on(table.articleSlug, table.ipAddress),
}));

// 关系定义
export const articlesRelations = relations(articles, ({ many }) => ({
  comments: many(comments),
  likes: many(likes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  article: one(articles, {
    fields: [comments.articleSlug],
    references: [articles.slug],
  }),
  replies: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  article: one(articles, {
    fields: [likes.articleSlug],
    references: [articles.slug],
  }),
}));
```

### 设计说明

**文章表（articles）**
- `slug`：URL 友好的唯一标识符
- `category`：文章分类
- `views/likes/commentCount`：统计数据
- 索引：slug（查找）、category（筛选）、views（排序）

**评论表（comments）**
- `articleSlug`：关联到文章
- `parentId`：支持回复评论
- `status`：评论状态（待审核/已批准/已拒绝）
- 索引：articleSlug（查找评论）、status（筛选）

**点赞表（likes）**
- `articleSlug`：关联到文章
- `ipAddress`：防止重复点赞
- 唯一约束：同一 IP 对同一文章只能点赞一次

---

## 7. Schema 最佳实践

### ✅ 好的实践

```typescript
// 1. 使用有意义的主键
id: serial('id').primaryKey()  // ✅ 简单的自增 ID
// 而不是：username (可能变化)

// 2. 添加默认值
createdAt: timestamp('created_at').defaultNow()  // ✅ 自动设置
// 而不是手动设置

// 3. 使用外键约束
articleId: integer('article_id').references(() => articles.id)  // ✅ 保证数据一致性
// 而不是存储 ID 而不设置约束

// 4. 添加索引
slugIdx: index('idx_slug').on(table.slug)  // ✅ 加快查询
// 为经常查询的字段添加索引

// 5. 使用时间戳
createdAt: timestamp('created_at').defaultNow()
updatedAt: timestamp('updated_at').defaultNow()  // ✅ 记录时间
```

### ❌ 避免的做法

```typescript
// 1. 避免过度使用 text
content: text('content')  // ✅ 用于长文本
description: text('description')  // ⚠️ 考虑使用 varchar(255)

// 2. 避免冗余数据
// ❌ 在评论表中重复存储文章标题
export const comments = pgTable('comments', {
  articleTitle: text('article_title'),  // ❌ 冗余
});

// ✅ 使用外键关联
export const comments = pgTable('comments', {
  articleId: integer('article_id').references(() => articles.id),
});

// 3. 避免过早优化
// 不要为每个字段都创建索引
// 只为经常查询的字段创建索引
```

---

## ✅ 检查点

确认你理解了：

- [ ] Schema 的作用和重要性
- [ ] 常用的字段类型及其用途
- [ ] 字段约束（主键、唯一、非空、默认值）
- [ ] 表关系（一对一、一对多、多对多）
- [ ] 索引的作用和使用场景
- [ ] 你的博客 Schema 的设计思路

---

## 🚀 下一步

理解 Schema 设计后，继续学习：

**[04 - 数据查询](./04-数据查询.md)**

你将学会：
- CRUD 操作
- 复杂查询
- 关系查询
