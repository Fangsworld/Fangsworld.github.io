# 数据库优化与 Drizzle 生态系统完整指南

## 📚 目录
1. [Drizzle 生态系统概览](#drizzle-生态系统概览)
2. [数据库优化策略](#数据库优化策略)
3. [Drizzle ORM 最佳实践](#drizzle-orm-最佳实践)
4. [Drizzle Kit 使用指南](#drizzle-kit-使用指南)
5. [Drizzle Studio 使用指南](#drizzle-studio-使用指南)

---

## 🎯 Drizzle 生态系统概览

```
┌─────────────────────────────────────────────────────────┐
│                  Drizzle 生态系统                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Drizzle ORM  │  │ Drizzle Kit  │  │Drizzle Studio│ │
│  │              │  │              │  │              │ │
│  │ • 类型安全查询│  │ • 迁移管理   │  │ • 可视化界面 │ │
│  │ • Schema定义 │  │ • 生成SQL    │  │ • 数据查看   │ │
│  │ • 关系映射   │  │ • Studio推送 │  │ • 在线编辑   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                 │          │
│         └─────────────────┴─────────────────┘          │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │  PostgreSQL │                      │
│                    │   (Neon)    │                      │
│                    └─────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 数据库优化策略

### 1. 查询优化

#### 问题：N+1 查询
```typescript
// ❌ 错误示例 - N+1 查询
async function getArticlesWithComments() {
  const articles = await db.select().from(articles);

  // 每篇文章都执行一次查询！
  for (const article of articles) {
    article.comments = await db.select()
      .from(comments)
      .where(eq(comments.articleSlug, article.slug));
  }

  return articles;
}
// 执行次数：1 + N 次查询（N = 文章数）
```

```typescript
// ✅ 正确示例 - 批量查询
async function getArticlesWithComments() {
  const articles = await db.select().from(articles);

  // 一次性获取所有评论
  const allComments = await db.select()
    .from(comments)
    .where(inArray(comments.articleSlug, articles.map(a => a.slug)));

  // 在内存中组装
  const commentsMap = new Map<string, Comment[]>();
  allComments.forEach(comment => {
    if (!commentsMap.has(comment.articleSlug)) {
      commentsMap.set(comment.articleSlug, []);
    }
    commentsMap.get(comment.articleSlug)!.push(comment);
  });

  return articles.map(article => ({
    ...article,
    comments: commentsMap.get(article.slug) || [],
  }));
}
// 执行次数：2 次查询
```

#### 使用连接查询（JOIN）
```typescript
import { sql } from 'drizzle-orm';

// 获取文章及其评论数
async function getArticlesWithCommentCount() {
  return await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      views: articles.views,
      commentCount: sql<number>`COUNT(${comments.id})`.mapWith(Number),
    })
    .from(articles)
    .leftJoin(comments, eq(articles.slug, comments.articleSlug))
    .groupBy(articles.id);
}
```

### 2. 分页优化

#### ❌ 使用 OFFSET 的分页（慢）
```typescript
// 当 OFFSET 很大时，性能很差
async function getArticles(page: number) {
  const limit = 10;
  const offset = (page - 1) * limit;

  return await db.select()
    .from(articles)
    .limit(limit)
    .offset(offset); // 跳过前面的所有行！
}
```

#### ✅ 使用游标分页（快）
```typescript
// 基于最后一条记录的 ID 来获取下一页
async function getArticlesCursor(lastId?: number) {
  const limit = 10;

  const query = db.select()
    .from(articles)
    .orderBy(desc(articles.id))
    .limit(limit);

  if (lastId) {
    query.where(lt(articles.id, lastId));
  }

  return await query;
}
```

### 3. 事务优化

```typescript
import { db } from '@/db';

// 批量操作使用事务
async function incrementMultipleViews(slugs: string[]) {
  return await db.transaction(async (tx) => {
    for (const slug of slugs) {
      await tx.update(articles)
        .set({ views: sql`${articles.views} + 1` })
        .where(eq(articles.slug, slug));
    }
  });
}
```

### 4. 查询结果缓存

```typescript
import { unstable_cache } from 'next/cache';

// 缓存热门文章（5分钟）
export const getPopularArticles = unstable_cache(
  async (limit = 10) => {
    return await db.select()
      .from(articles)
      .orderBy(desc(articles.views))
      .limit(limit);
  },
  ['popular-articles'],
  { revalidate: 300 } // 5分钟
);
```

### 5. 只查询需要的字段

```typescript
// ❌ 查询所有字段
const allArticles = await db.select().from(articles);

// ✅ 只查询需要的字段
const articleList = await db.select({
  id: articles.id,
  title: articles.title,
  slug: articles.slug,
  views: articles.views,
}).from(articles);
```

### 6. 使用 Prepared Statements

```typescript
// Drizzle ORM 自动使用 prepared statements
// 但你可以显式创建以获得更好的性能

const getArticleBySlug = db.query.articles.findFirst({
  where: eq(articles.slug, sql.placeholder('slug')),
});

// 多次调用时性能更好
await getArticleBySlug.execute({ slug: 'article-1' });
await getArticleBySlug.execute({ slug: 'article-2' });
```

---

## 🛠️ Drizzle ORM 最佳实践

### 1. 类型安全的查询

```typescript
// 自动推断返回类型
const result = await db.select({
  id: articles.id,
  title: articles.title,
})
  .from(articles)
  .where(eq(articles.views, 0));

// 类型：{ id: number; title: string; }[]
type ArticleWithViews = typeof result;
```

### 2. 使用 Query API（推荐）

```typescript
// 更简洁的查询 API
const article = await db.query.articles.findFirst({
  where: eq(articles.slug, 'my-article'),
  with: {
    comments: {
      where: eq(comments.status, 'approved'),
      orderBy: [desc(comments.createdAt)],
      limit: 10,
    },
  },
});
```

### 3. 关系查询

```typescript
// 更新 schema 添加关系
import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  // ... 其他字段
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  articleSlug: text('article_slug').notNull().references(() => articles.slug),
  // ... 其他字段
});

// 定义关系
export const articlesRelations = relations(articles, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  article: one(articles, {
    fields: [comments.articleSlug],
    references: [articles.slug],
  }),
}));

// 使用关系查询
const articleWithComments = await db.query.articles.findFirst({
  where: eq(articles.slug, 'my-article'),
  with: {
    comments: true, // 自动获取所有关联评论
  },
});
```

### 4. 组合条件查询

```typescript
import { and, or, eq, gte, lte } from 'drizzle-orm';

// 复杂条件
const result = await db.select()
  .from(articles)
  .where(
    and(
      or(
        eq(articles.category, 'reading'),
        eq(articles.category, 'writing')
      ),
      gte(articles.views, 100),
      lte(articles.views, 1000)
    )
  );
```

---

## 📦 Drizzle Kit 使用指南

### Drizzle Kit 是什么？
- **数据库迁移工具**：管理 schema 变更
- **SQL 生成器**：从 schema 生成 SQL
- **类型生成器**：从数据库生成 TypeScript 类型

### 常用命令

```bash
# 1. 生成迁移文件（当 schema 变化后）
npx drizzle-kit generate

# 2. 执行迁移
npx drizzle-kit migrate

# 3. 推送 schema 到数据库（开发环境）
npx drizzle-kit push

# 4. 打开 Drizzle Studio
npx drizzle-kit studio

# 5. 查看数据库状态
npx drizzle-kit introspect

# 6. 生成 TypeScript 类型（从现有数据库）
npx drizzle-kit generate
```

### 迁移工作流

```bash
# 步骤 1: 修改 schema.ts
# 例如：添加新字段

# 步骤 2: 生成迁移
npm run db:generate

# 步骤 3: 查看生成的 SQL
cat db/migrations/0001_new_field.sql

# 步骤 4: 执行迁移
npm run db:migrate

# 步骤 5: 验证
npx drizzle-kit studio
```

### package.json 脚本示例

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "db:introspect": "drizzle-kit introspect",
    "db:check": "drizzle-kit check"
  }
}
```

---

## 🎨 Drizzle Studio 使用指南

### 什么是 Drizzle Studio？
- **本地数据库 GUI**：像 phpMyAdmin，但更现代
- **实时数据查看**：查看、编辑、删除数据
- **查询构建器**：可视化构建查询

### 启动 Studio

```bash
# 方法 1：使用命令
npx drizzle-kit studio

# 方法 2：使用 npm script
npm run db:studio

# Studio 会在 http://localhost:4983 打开
```

### Studio 功能

```
┌─────────────────────────────────────────────────┐
│            Drizzle Studio 界面                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Tables:          🔍 Search:                │
│  ├─ articles         [搜索框...]               │
│  ├─ comments                                   │
│  └─ likes                                     │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  articles (10 rows)                       │ │
│  ├───────────────────────────────────────────┤ │
│  │  ID  │ Slug    │ Title  │ Views │ Actions│ │
│  ├───────────────────────────────────────────┤ │
│  │  1   │ test-1  │ Hello  │ 100   │ ✏️ 🗑️ │ │
│  │  2   │ test-2  │ World  │ 200   │ ✏️ 🗑️ │ │
│  │  ...                                     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [+ Add Row]  [Export]  [Schema]               │
└─────────────────────────────────────────────────┘
```

### 使用技巧

1. **快速编辑数据**：双击单元格直接编辑
2. **过滤数据**：使用右上角的搜索框
3. **添加关系**：在 Schema 视图中可视化关系
4. **导出数据**：Export 按钮导出为 JSON/CSV

---

## 📊 完整优化清单

### ✅ 基础优化（已完成）
- [x] 使用 Drizzle ORM
- [x] 定义索引
- [x] 设置迁移
- [x] 配置 Drizzle Kit

### 🚀 进阶优化（建议实施）
- [ ] 添加 Redis 缓存层
- [ ] 实现连接池配置
- [ ] 设置查询超时
- [ ] 添加慢查询日志
- [ ] 实现读写分离（如果流量大）

### 📈 性能监控
- [ ] 集成 Sentry 性能监控
- [ ] 添加查询日志
- [ ] 设置数据库指标收集
- [ ] 配置告警

---

## 🔧 实用工具脚本

### 1. 数据库备份脚本
```typescript
// scripts/backup-db.ts
import { neon } from '@neondatabase/serverless';
import { writeFileSync } from 'fs';

const sql = neon(process.env.DATABASE_URL!);

async function backup() {
  const tables = ['articles', 'comments', 'likes'];

  for (const table of tables) {
    const data = await sql`SELECT * FROM ${sql(table)}`;
    writeFileSync(`backups/${table}-${Date.now()}.json`, JSON.stringify(data, null, 2));
  }
}

backup();
```

### 2. 慢查询分析
```typescript
// scripts/slow-queries.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function analyzeSlowQueries() {
  const result = await sql`
    SELECT
      query,
      calls,
      total_time,
      mean_time,
      max_time
    FROM pg_stat_statements
    ORDER BY mean_time DESC
    LIMIT 10
  `;

  console.table(result);
}
```

### 3. 数据库健康检查
```typescript
// scripts/health-check.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function healthCheck() {
  const stats = await sql`
    SELECT
      (SELECT COUNT(*) FROM articles) as article_count,
      (SELECT COUNT(*) FROM comments) as comment_count,
      (SELECT COUNT(*) FROM likes) as like_count,
      pg_database_size('neondb') / 1024 / 1024 as db_size_mb
  `;

  console.log('📊 Database Stats:', stats);
}
```

---

## 📚 推荐资源

### 官方文档
- Drizzle ORM: https://orm.drizzle.team/
- Drizzle Kit: https://kit.drizzle.team/
- Neon 文档: https://neon.tech/docs

### 下一步
1. 设置 Redis 缓存
2. 实现全文搜索
3. 添加数据库监控
4. 优化查询性能
