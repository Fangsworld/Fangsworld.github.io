# 📚 数据库学习文档

欢迎来到数据库学习中心！这里包含了从入门到高级的所有数据库知识。

## 🗂️ 文档导航

### 📖 学习路线

建议按顺序阅读以下文档：

```
┌─────────────────────────────────────────────────────────────┐
│                      学习路线图                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  第1步：基础入门                                             │
│  └─ 01-基础入门.md                                          │
│      • 什么是数据库                                          │
│      • 为什么需要数据库                                      │
│      • Neon + Drizzle 简介                                  │
│                                                             │
│  第2步：环境配置                                             │
│  └─ 02-环境配置.md                                          │
│      • 创建 Neon 数据库                                     │
│      • 配置 Drizzle ORM                                     │
│      • 首次连接测试                                         │
│                                                             │
│  第3步：Schema 设计                                          │
│  └─ 03-Schema设计.md                                       │
│      • 数据表设计                                            │
│      • 字段类型选择                                          │
│      • 关系设计                                              │
│      • 索引优化                                              │
│                                                             │
│  第4步：数据查询                                             │
│  └─ 04-数据查询.md                                          │
│      • CRUD 操作                                            │
│      • 复杂查询                                              │
│      • 关系查询                                              │
│                                                             │
│  第5步：Drizzle Kit                                         │
│  └─ 05-Drizzle-Kit.md                                      │
│      • 数据库迁移                                            │
│      • Schema 管理                                          │
│      • 版本控制                                              │
│                                                             │
│  第6步：Drizzle Studio                                      │
│  └─ 06-Drizzle-Studio.md                                   │
│      • 可视化界面使用                                        │
│      • 数据管理                                              │
│      • 调试技巧                                              │
│                                                             │
│  第7步：性能优化                                             │
│  └─ 07-性能优化.md                                          │
│      • 索引优化                                              │
│      • 查询优化                                              │
│      • 缓存策略                                              │
│                                                             │
│  第8步：高级功能                                             │
│  └─ 08-高级功能.md                                          │
│      • 事务处理                                              │
│      • 备份恢复                                              │
│      • 监控告警                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 📋 快速参考

- [快速参考卡片](./DB_QUICK_REFERENCE.md) - 常用命令速查
- [常见问题解答](./FAQ.md) - 常见问题汇总

---

## 🎯 学习目标

完成本学习路线后，你将能够：

- ✅ 理解数据库基本概念
- ✅ 独立配置 Neon + Drizzle 环境
- ✅ 设计高效的数据表结构
- ✅ 编写复杂的数据库查询
- ✅ 使用 Drizzle Kit 管理迁移
- ✅ 使用 Drizzle Studio 管理数据
- ✅ 优化数据库性能
- ✅ 处理生产环境问题

---

## 🚀 快速开始

### 完全零基础？

从 **[01-基础入门.md](./01-基础入门.md)** 开始学习

### 已经有基础？

跳到 **[快速参考卡片](./DB_QUICK_REFERENCE.md)** 查看常用命令

### 遇到问题？

查看 **[常见问题解答](./FAQ.md)** 或 **[故障排除](./故障排除.md)**

---

## 📊 当前项目状态

```bash
# 查看数据库健康状态
npm run db:health

# 打开可视化界面
npm run db:studio

# 检查迁移状态
npm run db:migrate-check
```

**当前数据库信息：**
- 数据库：Neon PostgreSQL
- ORM：Drizzle ORM
- 表数量：3 个（articles, comments, likes）
- 文章数：16 篇
- 大小：~7.6 MB

---

## 🔧 项目文件结构

```
fangsworld.github.io/
├── db/
│   ├── schema.ts          # 数据库 Schema 定义
│   ├── index.ts           # 数据库连接
│   ├── queries.ts         # 查询函数
│   └── migrations/        # 迁移文件
│
├── drizzle.config.ts      # Drizzle Kit 配置
│
├── scripts/
│   ├── db-health.ts       # 健康检查脚本
│   └── db-migrate-check.ts # 迁移检查脚本
│
└── docs/                  # 本文档目录
    ├── README.md          # 本文件
    ├── 01-基础入门.md
    ├── 02-环境配置.md
    └── ...
```

---

## 💡 学习建议

### 学习节奏

- **每天 30 分钟**：学习一个概念
- **动手实践**：每个章节都要实际操作
- **记录笔记**：写下你遇到的问题和解决方案

### 实践建议

1. **边学边做**：不要只看，要动手操作
2. **测试环境**：在本地测试，不要直接操作生产数据库
3. **备份习惯**：重要操作前先备份数据
4. **版本控制**：将 schema 变更纳入版本控制

---

## 📚 扩展资源

### 官方文档

- [Neon 文档](https://neon.tech/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [Drizzle Kit](https://kit.drizzle.team)
- [PostgreSQL 文档](https://www.postgresql.org/docs)

### 推荐阅读

- [SQL 必知必会](https://www.bookstack.cn/books/sql-fifty)
- [数据库系统概念](https://www.bookstack.cn/books/database-system-concepts)
- [高性能 MySQL](https://www.bookstack.cn/read/high-performance-mysql)

---

## 🆘 获取帮助

遇到问题？这里有帮助：

1. **查看文档**：先搜索相关文档
2. **检查 FAQ**：常见问题有解答
3. **查看日志**：`npm run db:health`
4. **官方 Discord**：[Drizzle Discord](https://discord.gg/WcRKz2FFxN)

---

## 📝 更新日志

- **2025-01-09**: 创建完整学习路线
- **2025-01-09**: 添加 Drizzle Studio 指南
- **2025-01-09**: 添加性能优化建议

---

**开始学习** → [01-基础入门.md](./01-基础入门.md)
