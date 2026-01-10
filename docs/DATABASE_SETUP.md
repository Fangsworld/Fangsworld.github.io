# 数据库集成指南

本文档介绍如何为网站配置 Neon 数据库并启用高级功能。

## 功能概览

- 📊 **文章统计** - 浏览量、点赞数统计
- 💬 **评论系统** - 用户评论（支持审核）
- ❤️ **点赞功能** - 文章点赞/取消点赞
- 📈 **热门文章** - 基于浏览量的排行

## 技术栈

- **数据库**: Neon (PostgreSQL Serverless)
- **ORM**: Drizzle ORM
- **验证**: Zod

## 快速开始

### 1. 创建 Neon 数据库

1. 访问 [https://neon.tech](https://neon.tech)
2. 使用 GitHub 账户登录
3. 点击 "Create a project"
4. 选择区域（推荐选择离你最近的区域）
5. 等待数据库创建完成
6. 复制 Connection String（连接字符串）

### 2. 配置环境变量

1. 复制 `.env.example` 为 `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. 在 `.env.local` 中填入你的 Neon 连接字符串:
   ```env
   DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
   ```

### 3. 初始化数据库

使用 psql 或 Neon 的 SQL Editor 执行 `db/migrations/0001_init.sql` 中的 SQL：

```sql
-- 在 Neon SQL Editor 中执行
CREATE TABLE IF NOT EXISTS articles (...);
CREATE TABLE IF NOT EXISTS comments (...);
CREATE TABLE IF NOT EXISTS likes (...);
```

完整 SQL 见: `db/migrations/0001_init.sql`

### 4. 启动开发服务器

```bash
npm run dev
```

访问任意文章页面，你会看到：
- 文章统计（浏览量、点赞、评论数）
- 评论表单
- 评论列表

## API 端点

### 文章统计 API

**获取统计数据:**
```http
GET /api/articles/[slug]/stats
```

**更新统计数据:**
```http
POST /api/articles/[slug]/stats
Content-Type: application/json

{
  "action": "view" | "like",
  "category": "reading",
  "title": "文章标题",
  "excerpt": "文章摘要"
}
```

### 评论 API

**获取评论列表:**
```http
GET /api/articles/[slug]/comments
```

**创建评论:**
```http
POST /api/articles/[slug]/comments
Content-Type: application/json

{
  "authorName": "用户名",
  "authorEmail": "email@example.com",
  "content": "评论内容",
  "parentId": 123  // 可选，回复评论时使用
}
```

## 部署到 Vercel

### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

### 3. 部署

```bash
vercel
```

### 4. 配置环境变量

在 Vercel Dashboard 中:
1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加 `DATABASE_URL` 变量

### 5. 重新部署

```bash
vercel --prod
```

## 数据库管理

### 使用 Neon SQL Editor

1. 访问 Neon Dashboard
2. 选择你的项目
3. 点击 "SQL Editor"
4. 执行 SQL 查询

### 常用查询

**查看所有文章统计:**
```sql
SELECT slug, title, views, likes, comment_count
FROM articles
ORDER BY views DESC;
```

**查看待审核评论:**
```sql
SELECT c.*, a.title
FROM comments c
JOIN articles a ON c.article_slug = a.slug
WHERE c.status = 'pending'
ORDER BY c.created_at DESC;
```

**批准评论:**
```sql
UPDATE comments
SET status = 'approved', updated_at = NOW()
WHERE id = 评论ID;
```

## 故障排除

### 数据库连接失败

1. 检查 `.env.local` 是否正确配置
2. 确认 Neon 数据库是否在线
3. 验证连接字符串格式

### API 返回 500 错误

1. 检查数据库表是否已创建
2. 查看控制台错误日志
3. 确认 Neon 配额是否用完

### 评论不显示

1. 检查评论 `status` 是否为 `approved`
2. 确认 article_slug 匹配
3. 查看数据库中的评论记录

## 扩展功能建议

### 管理后台

创建 `/admin` 路由实现：
- 评论审核界面
- 文章统计查看
- 热门文章排行

### 用户系统

添加用户认证：
- GitHub OAuth
- 自定义用户注册/登录
- 用户个人资料

### 邮件通知

- 新评论邮件通知
- 评论审核通知
- 每周热门文章推送

### 防垃圾评论

- Google reCAPTCHA
- 关键词过滤
- IP 黑名单

## 相关文件

- `db/schema.ts` - 数据库 Schema 定义
- `db/queries.ts` - 数据库查询函数
- `db/migrations/` - 数据库迁移文件
- `app/api/` - API 路由
- `components/articles/` - 前端组件

## 支持

- Neon 文档: https://neon.tech/docs
- Drizzle 文档: https://orm.drizzle.team
- Next.js 文档: https://nextjs.org/docs
