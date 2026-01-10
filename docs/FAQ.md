# 常见问题解答（FAQ）

这里汇总了学习和使用过程中遇到的常见问题。

---

## 📖 学习相关

### Q1: 我需要什么基础才能学习数据库？

**A:** 基础要求：
- 了解 JavaScript 基础
- 了解 TypeScript 基础
- 有使用过终端/命令行的经验

**不需要**：
- 不需要有 SQL 经验
- 不需要有数据库经验
- 不需要有后端开发经验

### Q2: 学习这个需要多长时间？

**A:** 建议的学习时间：

| 章节 | 预计时间 | 说明 |
|------|----------|------|
| 基础入门 | 30 分钟 | 理解概念 |
| 环境配置 | 45 分钟 | 实际操作 |
| Schema 设计 | 1 小时 | 设计和练习 |
| 数据查询 | 1.5 小时 | 各种查询练习 |
| Drizzle Kit | 30 分钟 | 迁移操作 |
| Drizzle Studio | 15 分钟 | 界面使用 |

**总计：约 4 小时**

### Q3: 我应该按什么顺序学习？

**A:** 推荐顺序：

1. 先读 **[README.md](./README.md)** - 了解整体结构
2. 按顺序学习 **01-04 章**
3. 边学边做 - 每章都要实际操作
4. 查看 **[快速参考](./DB_QUICK_REFERENCE.md)** - 遇到问题时查阅

---

## 🛠️ 环境配置问题

### Q4: Neon 免费额度够用吗？

**A:** 免费额度包括：
- 0.5 GB 存储
- 300 小时计算时间/月
- 无限分支

**对于个人博客：**
- ✅ 完全够用
- 可以存储数百篇文章
- 月访问量 < 10,000 没问题

### Q5: 如何连接到 Neon 数据库？

**A:** 有几种方式：

**方式 1：使用 Drizzle Studio（推荐）**
```bash
npm run db:studio
# 访问 https://local.drizzle.studio
```

**方式 2：使用 Neon SQL Editor**
1. 访问 Neon Dashboard
2. 选择你的项目
3. 点击 "SQL Editor"

**方式 3：使用 psql 命令行**
```bash
psql "postgresql://username:password@hostname/database"
```

### Q6: 忘记数据库连接字符串怎么办？

**A:** 重新获取：

1. 访问 [Neon Console](https://console.neon.tech)
2. 选择你的项目
3. 在项目详情页找到 "Connection string"
4. 复制并更新 `.env.local`

### Q7: 数据库连接失败怎么办？

**A:** 检查清单：

```bash
# 1. 检查环境变量
cat .env.local | grep DATABASE_URL

# 2. 测试连接
npm run db:health

# 3. 确认 Neon 数据库在线
# 访问 Neon Dashboard 查看状态

# 4. 检查网络连接
ping your-hostname.aws.neon.tech
```

---

## 📝 Schema 设计问题

### Q8: 如何修改 Schema？

**A:** 步骤：

1. **修改 `db/schema.ts`**
   ```typescript
   // 添加新字段
   export const articles = pgTable('articles', {
     // ... 现有字段
     newField: text('new_field'),  // 新增
   });
   ```

2. **生成迁移**
   ```bash
   npm run db:generate
   ```

3. **执行迁移**
   ```bash
   npm run db:push  # 开发环境
   ```

### Q9: 如何删除表？

**A:** 方式 1：使用 SQL

```sql
DROP TABLE IF EXISTS table_name CASCADE;
```

方式 2：使用 Drizzle Studio

1. 打开 `npm run db:studio`
2. 选择表
3. 点击删除按钮

### Q10: 如何重置数据库？

**A:** 开发环境：

```sql
-- 删除所有表
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 重新执行迁移
npm run db:push
```

---

## 🔍 查询问题

### Q11: 如何调试查询？

**A:** 方法：

**方法 1：查看生成的 SQL**
```typescript
import { sql } from 'drizzle-orm';

const query = db.select()
  .from(articles)
  .where(eq(articles.slug, 'test'));

console.log(query.toSQL());  // 查看生成的 SQL
```

**方法 2：使用 Drizzle Studio**
1. 打开 Studio
2. 在 SQL Editor 中测试查询

**方法 3：添加日志**
```typescript
console.log('Executing query...');
const result = await db.select().from(articles);
console.log('Result:', result);
```

### Q12: 查询很慢怎么办？

**A:** 优化步骤：

1. **添加索引**
   ```typescript
   index('idx_slug').on(table.slug)
   ```

2. **只查询需要的字段**
   ```typescript
   db.select({ id, title }).from(articles)  // ✅
   db.select().from(articles)  // ❌
   ```

3. **使用 EXPLAIN ANALYZE**
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM articles WHERE slug = 'xxx';
   ```

4. **检查是否全表扫描**
   ```bash
   npm run db:health
   # 查看 "索引统计" 部分
   ```

### Q13: 如何处理特殊字符？

**A:** URL 编码：

```typescript
// 数据库存储 URL 编码的 slug
const encodedSlug = encodeURIComponent(slug);

// 查询时
await db.select()
  .from(articles)
  .where(eq(articles.slug, encodedSlug));
```

---

## 🚀 Drizzle Kit 问题

### Q14: generate 和 push 有什么区别？

**A:** 对比：

| 命令 | 用途 | 场景 |
|------|------|------|
| `db:generate` | 生成迁移文件 | 生产环境，需要版本控制 |
| `db:push` | 直接推送 Schema | 开发环境，快速迭代 |

**建议：**
- 开发：用 `db:push`（更快）
- 生产：用 `generate` + `migrate`（更安全）

### Q15: 迁移失败了怎么办？

**A:** 步骤：

1. **查看错误信息**
   ```bash
   npm run db:push
   # 仔细阅读错误信息
   ```

2. **检查迁移文件**
   ```bash
   cat db/migrations/0001_*.sql
   ```

3. **手动修复**
   - 在 Neon SQL Editor 中执行修正的 SQL
   - 或删除问题表后重新推送

### Q16: 如何回滚迁移？

**A:** 手动回滚：

1. **创建回滚 SQL**
   ```sql
   -- 撤销上一次的变更
   ALTER TABLE articles DROP COLUMN new_field;
   ```

2. **执行回滚**
   ```bash
   # 在 Neon SQL Editor 中执行
   ```

3. **更新迁移记录**
   ```sql
   DELETE FROM drizzle_migrations WHERE hash = 'xxx';
   ```

---

## 🎨 Drizzle Studio 问题

### Q17: Studio 无法连接怎么办？

**A:** 检查：

1. **确认配置文件**
   ```typescript
   // drizzle.config.ts 必须加载环境变量
   import { config } from 'dotenv';
   config({ path: resolve(process.cwd(), '.env.local') });
   ```

2. **检查环境变量**
   ```bash
   cat .env.local | grep DATABASE_URL
   ```

3. **重启 Studio**
   ```bash
   pkill -f "drizzle-kit studio"
   npm run db:studio
   ```

### Q18: Studio 显示证书错误？

**A:** 解决方法：

1. **Chrome/Edge**: 点击 "Advanced" → "Proceed to localhost"
2. **Firefox**: 点击 "Advanced" → "Accept the Risk"

### Q19: Studio 的数据是实时的吗？

**A:** 是的：
- ✅ Studio 中的修改立即生效
- ✅ 代码中的修改立即在 Studio 中显示
- ✅ 不需要刷新页面

---

## 📊 性能问题

### Q20: 我的数据库很大了，怎么优化？

**A:** 优化策略：

**1. 添加索引**
```typescript
// 为经常查询的字段添加索引
index('idx_views').on(table.views)
```

**2. 清理旧数据**
```sql
-- 删除旧数据
DELETE FROM articles WHERE created_at < NOW() - INTERVAL '1 year';
```

**3. 使用连接池**
```typescript
// Drizzle 自动管理连接
// Neon 自动处理连接池
```

**4. 启用缓存**
```typescript
import { unstable_cache } from 'next/cache';

export const getArticles = unstable_cache(
  async () => db.select().from(articles),
  ['articles'],
  { revalidate: 300 }  // 5分钟缓存
);
```

### Q21: 数据库快满了怎么办？

**A:** 方案：

**1. 检查占用**
```bash
npm run db:health
# 查看 "表大小" 部分
```

**2. 清理数据**
```sql
-- 删除测试数据
DELETE FROM articles WHERE title LIKE '测试%';

-- 清理旧评论
DELETE FROM comments WHERE created_at < NOW() - INTERVAL '2 years';
```

**3. 升级 Neon 计划**
- 免费版：0.5 GB
- 付费版：从 $19/月起，更大空间

---

## 🚨 错误排查

### Q22: "column does not exist" 错误

**A:** 原因和解决：

```typescript
// ❌ 错误：字段名不匹配
.where(eq(articles.slug_name, 'xxx'))

// ✅ 正确：字段名要与 schema 一致
.where(eq(articles.slug, 'xxx'))
```

### Q23: "relation does not exist" 错误

**A:** 原因：表不存在

**解决：**
```bash
# 1. 检查表是否存在
npm run db:studio

# 2. 创建表
npm run db:push

# 3. 检查 schema 定义
cat db/schema.ts
```

### Q24: "unique constraint" 错误

**A:** 原因：重复数据

```typescript
// ❌ 错误：插入重复的 slug
await db.insert(articles)
  .values({ slug: 'existing-slug' });  // 已存在

// ✅ 解决：检查后插入
const existing = await db.select()
  .from(articles)
  .where(eq(articles.slug, 'existing-slug'));

if (!existing.length) {
  await db.insert(articles)
    .values({ slug: 'existing-slug' });
}
```

---

## 💡 最佳实践

### Q25: 如何组织查询代码？

**A:** 推荐结构：

```
db/
├── schema.ts          # Schema 定义
├── index.ts           # 数据库连接
├── queries.ts         # 查询函数
│   ├── articles       # 文章相关查询
│   ├── comments       # 评论相关查询
│   └── likes          # 点赞相关查询
└── migrations/        # 迁移文件
```

### Q26: 如何备份和恢复？

**A:** 备份方案：

**1. 导出数据**
```bash
npm run db:studio
# 点击 Export 按钮 → 下载 JSON/CSV
```

**2. 使用 pg_dump**
```bash
pg_dump "postgresql://..." > backup.sql
```

**3. Neon 自动备份**
- Neon 每天自动备份
- 可以在 Dashboard 中恢复

---

## 📚 更多资源

### 学习资源

- [Drizzle ORM 文档](https://orm.drizzle.team)
- [Neon 文档](https://neon.tech/docs)
- [PostgreSQL 教程](https://www.postgresqltutorial.com)

### 获取帮助

- [Drizzle Discord](https://discord.gg/WcRKz2FFxN)
- [Neon GitHub Discussions](https://github.com/neondatabase/neon/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/drizzle-orm)

---

## 🔍 问题索引

| 问题类型 | 相关章节 |
|---------|---------|
| 环境配置 | [02 - 环境配置](./02-环境配置.md) |
| Schema 设计 | [03 - Schema 设计](./03-Schema设计.md) |
| 数据查询 | [04 - 数据查询](./04-数据查询.md) |
| Drizzle Kit | [05 - Drizzle Kit](./05-Drizzle-Kit.md) |
| Drizzle Studio | [06 - Drizzle Studio](./06-Drizzle-Studio.md) |
| 性能优化 | [07 - 性能优化](./07-性能优化.md) |

---

还有其他问题？查看 [完整文档索引](./README.md) 或查看 [快速参考](./DB_QUICK_REFERENCE.md)。
