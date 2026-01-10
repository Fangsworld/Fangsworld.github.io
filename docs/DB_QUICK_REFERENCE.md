# 数据库命令快速参考

## 📦 Drizzle Kit 命令

```bash
# 生成迁移文件
npm run db:generate

# 推送 schema 到数据库（开发环境，快速）
npm run db:push

# 执行迁移（生产环境）
npm run db:migrate

# 打开 Drizzle Studio（可视化界面）
npm run db:studio

# 从数据库生成 TypeScript 类型
npm run db:introspect

# 检查 schema 是否有效
npm run db:check

# 数据库健康检查
npm run db:health

# 检查迁移状态
npm run db:migrate-check
```

## 🔄 典型工作流

### 开发新功能
```bash
# 1. 编辑 db/schema.ts
vim db/schema.ts

# 2. 生成迁移
npm run db:generate

# 3. 查看生成的 SQL
cat db/migrations/0001_*.sql

# 4. 推送到数据库（开发环境）
npm run db:push

# 5. 打开 Studio 验证
npm run db:studio
```

### 生产部署
```bash
# 1. 生成迁移
npm run db:generate

# 2. 提交代码
git add .
git commit -m "Add new database field"
git push

# 3. 在服务器上执行迁移
npm run db:migrate
```

## 📊 健康检查输出解读

```
📊 基本统计:
  • 文章数: 16           ← 总文章数量
  • 评论数: 2            ← 总评论数量
  • 点赞数: 2            ← 总点赞数量
  • 数据库大小: 7776 kB  ← 数据库占用空间

📦 表大小:
  • articles: 128 kB     ← 各表占用空间
  • comments: 80 kB
  • likes: 64 kB

🔑 索引统计:
  ✅ articles_slug_idx   ← 绿色✅ = 正在使用
  ⏸️ articles_views_idx  ← 灰色⏸️ = 暂未使用（数据少）

🔗 连接统计:
  • 总连接: 1            ← 当前数据库连接数
  • 活跃: 1              ← 正在执行的查询
  • 空闲: 0              ← 空闲连接
```

## 🎯 索引状态说明

- ✅ **活跃索引**：正在被查询使用，性能提升有效
- ⏸️ **未使用索引**：数据量太少，数据库选择全表扫描
- 📈 **未来会启用**：当数据量增长后，数据库会自动使用

## ⚠️ 常见问题

### 1. 迁移失败
```bash
# 检查迁移状态
npm run db:migrate-check

# 查看迁移 SQL
cat db/migrations/0001_*.sql
```

### 2. Schema 不同步
```bash
# 重新生成 schema
npm run db:introspect
```

### 3. 数据库连接失败
```bash
# 检查环境变量
cat .env.local | grep DATABASE_URL

# 测试连接
npm run db:health
```

## 🚀 性能优化建议

### 当前状态（文章数 < 100）
- ✅ 索引已设置
- ✅ 查询性能良好
- ⏸️ 暂时不需要额外优化

### 当文章数 > 100 时
- [ ] 添加 Redis 缓存
- [ ] 实现查询结果缓存
- [ ] 优化慢查询

### 当文章数 > 1000 时
- [ ] 实现读写分离
- [ ] 添加连接池配置
- [ ] 考虑分表策略

## 📚 相关文档

- [完整优化指南](./DATABASE_OPTIMIZATION.md)
- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Neon 数据库文档](https://neon.tech/docs)
