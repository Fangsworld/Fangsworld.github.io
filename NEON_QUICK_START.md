# Neon 数据库快速配置指南

## 🚀 5 分钟快速配置

### 1️⃣ 创建 Neon 数据库

1. 访问 **https://neon.tech**
2. 使用 **GitHub** 账号登录（推荐）
3. 点击 **"Create a project"**
4. 输入项目名称：`fangsworld-blog`
5. 选择区域：**Singapore** (或其他离你近的区域)
6. 点击 **"Create project"**
7. 等待数据库创建完成（约 30 秒）

### 2️⃣ 获取连接字符串

在 Neon Dashboard 中找到 **Connection string**，类似：

```
postgresql://fangsworld:AbC123xYz@ep-cool-darkness-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

点击复制按钮复制这个字符串。

### 3️⃣ 配置环境变量

编辑 `.env.local` 文件：

```env
DATABASE_URL="这里粘贴你的连接字符串"
```

完整示例：
```env
DATABASE_URL="postgresql://fangsworld:AbC123xYz@ep-cool-darkness-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

### 4️⃣ 创建数据库表

在 Neon Dashboard 中：

1. 点击左侧菜单的 **"SQL Editor"**
2. 复制下面的 SQL 代码并粘贴到编辑器
3. 点击 **"Run"** 按钮

```sql
-- 文章统计表
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
);

-- 评论表
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
);

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    article_slug TEXT NOT NULL REFERENCES articles(slug) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS articles_views_idx ON articles(views);

CREATE INDEX IF NOT EXISTS comments_article_slug_idx ON comments(article_slug);
CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at);

CREATE INDEX IF NOT EXISTS likes_article_slug_idx ON likes(article_slug);
CREATE INDEX IF NOT EXISTS likes_unique_idx ON likes(article_slug, ip_address);
```

### 5️⃣ 测试连接

运行测试脚本：

```bash
npx tsx scripts/test-db.ts
```

如果看到 `✅ 数据库配置完成！`，说明配置成功！

### 6️⃣ 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000，打开任意文章，你应该能看到：

- 📊 文章统计（浏览量、点赞数、评论数）
- 💬 评论表单
- 📝 评论列表

---

## ✅ 功能验证清单

完成配置后，验证以下功能：

- [ ] 访问文章页面，看到统计数据显示
- [ ] 刷新页面，浏览量 +1
- [ ] 点击点赞按钮，点赞数变化
- [ ] 提交评论，显示"等待审核"
- [ ] 在 Neon SQL Editor 查看数据：
  ```sql
  -- 查看文章统计
  SELECT * FROM articles;

  -- 查看待审核评论
  SELECT * FROM comments WHERE status = 'pending';
  ```

---

## 🔧 常见问题

### Q: 提示 "DATABASE_URL environment variable is not set"

**A:** 检查 `.env.local` 文件是否存在，并且 DATABASE_URL 已正确填写。

### Q: 连接数据库超时

**A:**
- 检查网络连接
- 确认 Neon 数据库状态为 "Active"
- 尝试重新创建连接字符串

### Q: 表已存在错误

**A:** 这是正常的，SQL 使用了 `IF NOT EXISTS`，可以安全忽略。

### Q: 如何批准评论？

**A:** 在 Neon SQL Editor 中执行：
```sql
UPDATE comments
SET status = 'approved'
WHERE id = 评论ID;
```

---

## 📚 相关文档

- [Neon 官方文档](https://neon.tech/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- 完整配置指南: `docs/DATABASE_SETUP.md`

---

## 💡 下一步

配置完成后，你可以：

1. **部署到 Vercel**：
   - 在 Vercel 项目设置中添加 `DATABASE_URL` 环境变量
   - 部署后功能自动可用

2. **创建管理后台**：
   - 评论审核界面
   - 文章统计查看

3. **添加更多功能**：
   - 邮件通知
   - 用户系统
   - RSS 订阅
