# Claude 开发规范与注意事项

> 本项目由 AI 辅助开发，记录常见的坑和规范，避免重复犯错。

## 项目概览

- **框架**: Next.js 16.1.1 (App Router)
- **语言**: TypeScript (strict mode)
- **数据库**: PostgreSQL (Neon) + Drizzle ORM
- **样式**: CSS Modules + Tailwind CSS
- **内容**: Markdown/MDX 文章系统

## 目录结构

```
├── .claude/          # Claude Code 工具配置
│   ├── commands/    # Slash Commands
│   ├── skills/       # Skills (智能工具)
│   ├── agents/       # Agents (自主助手)
│   ├── hooks/        # Hooks (自动化规则)
│   └── backups/      # 自动备份文件
├── app/              # Next.js App Router
├── articles/         # 文章内容（按分类组织）
│   ├── ai/
│   ├── society/
│   ├── science/
│   ├── health/
│   ├── essays/
│   └── products/
├── components/       # React 组件
├── db/              # 数据库 schema 和查询
├── lib/             # 工具函数
└── scripts/         # 维护脚本
```

## 常见问题与坑

### 1. Slug URL 编码问题

**问题**: 数据库中存储的 slug 是 URL 编码的（如 `%E5%90%8D%E5%AD%97`），但文件系统中的是原始中文。

**解决**: 在匹配时需要编码 slug：
```typescript
// lib/articles.ts:42
views: statsMap.get(encodeURIComponent(article.slug))?.views || 0
```

### 2. 客户端数据获取

**问题**: 浏览量等动态数据需要在客户端获取，避免静态生成时数据固化。

**解决**: 使用 `useEffect` + `'use client'` 指令：
```typescript
'use client';
useEffect(() => {
  fetch(`/api/articles/${slug}/stats`)
    .then(res => res.json())
    .then(data => setViews(data.views));
}, [slug]);
```

### 3. marked 库 API 变更

**问题**: marked v17+ 的 `Renderer.code` 方法签名已变更。

**正确用法**:
```typescript
class Renderer extends marked.Renderer {
  code(code: string, language: string | undefined, isEscaped: boolean): string {
    // 处理代码高亮
  }
}
```

### 4. 字体 subsets 配置

**问题**: Google Fonts 的 `subsets` 不能是嵌套数组。

**正确**:
```typescript
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
});
```

### 5. TypeScript 类型推断

**问题**: Drizzle ORM 的类型需要正确导入。

```typescript
import type { Article, Comment } from '@/db/schema';
// 或使用 $inferSelect / $inferInsert
```

### 6. 评论 parentId 类型

**问题**: API 路由中 `parentId` 可能是 `null` 或 `undefined`，需要正确处理。

```typescript
parentId: data.parentId ? parseInt(data.parentId as string) : null
```

### 7. Next.js 部署配置

**问题**: EdgeOne 部署需要特定的 `next.config.ts` 配置。

### 8. 字体系统设计规范

**问题**: 字重过轻影响可读性，过重失去简洁感。需要平衡美观与阅读体验。

#### 字体配置

| 字体 | 用途 | 权重配置 |
|------|------|----------|
| **Inter** | 英文正文 | `300`, `400` |
| **Noto Sans SC** | 中文 | `300`, `400`, `500` |
| **Poppins** | 标题 | `400`, `500` |

#### 字重使用规范

```css
/* app/layout.tsx */
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400"],  /* 仅加载需要的权重 */
});

/* app/globals.css */
body {
  font-weight: 300;  /* 默认轻量，营造简洁感 */
}
```

#### 字重分层系统

| 层级 | 元素 | 字重 | 颜色变量 |
|------|------|------|----------|
| **一级标题** | hero-title, h1 | 500 | `--color-text-primary` |
| **二级标题** | h2, section-title | 400 | `--color-text-primary` |
| **三级标题** | h3 | 400 | `--color-text-primary` |
| **正文** | p, li | 400 | `--color-text-primary` |
| **小字** | meta, footer | 400 | `--color-text-secondary` |
| **辅助信息** | tags, muted | 300/400 | `--color-text-muted` |

#### 颜色与字重配合原则

**关键原则**: 字重越轻，颜色需要越深；字重越重，颜色可以越浅。

```css
/* ✅ 正确：轻字重 + 深颜色 */
.article-view-body {
  font-weight: 400;
  color: var(--color-text-primary);  /* #3b2418 深棕色 */
}

/* ❌ 错误：轻字重 + 浅颜色 */
.article-view-body {
  font-weight: 300;
  color: var(--color-text-secondary);  /* 太浅，阅读困难 */
}
```

#### 特殊场景处理

**文章详情页**: 正文需要更高对比度
```css
.article-view-body p {
  font-weight: 400;
  color: var(--color-text-primary);  /* 使用主色而非次色 */
}
```

**首页/卡片**: 保持简洁感的同时确保可读
```css
.article-excerpt {
  font-weight: 400;  /* 不是继承的300 */
  color: var(--color-text-secondary);
}
```

#### 注意事项

1. **同步更新**: 修改字重时需同步 `app/globals.css` 和 `styles/main.css`
2. **权重限制**: 只加载实际使用的字重，减少资源加载
3. **可读性优先**: 当美观与可读冲突时，优先选择可读性

### 9. 开发服务器启动失败 (ERR_CONNECTION_REFUSED)

**问题**: 运行 `npm run dev` 后访问 `localhost:3000` 显示 `ERR_CONNECTION_REFUSED`，服务器无法响应。

**原因**: 残留的 Node/Next.js 进程导致资源冲突。虽然端口 3000 可能显示未被占用，但残留进程会：
- 占用 Next.js 的内部锁文件或资源
- 导致新启动的开发服务器无法正常初始化
- 造成启动过程卡死或失败

**排查**:
```bash
# 检查残留进程
ps aux | grep -E "next|node" | grep -v grep | wc -l
# 如果输出 > 0，说明有残留进程
```

**解决**:
```bash
# 杀掉所有 Next.js 相关进程
pkill -f "next dev"
# 或杀掉所有 Node 进程（谨慎使用）
pkill -9 -f "node"

# 然后重新启动
npm run dev
```

**预防**: 正常关闭开发服务器时使用 `Ctrl+C`，避免强制退出终端。

## 开发规范

### 文件命名

- 组件文件: PascalCase (如 `ArticleCard.tsx`)
- 工具函数: camelCase (如 `getArticlesByCategory.ts`)
- **文章文件**: 必须遵守以下规范（详见"文章文件命名规范"章节）

### 文章文件命名规范

**⚠️ 重要**: 文章文件名直接影响 URL 路由和数据库关联，必须严格遵守以下规范：

#### 1. 基本规则

| 规则 | 说明 | 示例 |
|------|------|------|
| **文件名 = title** | 文件名必须与 frontmatter 中的 `title` 完全一致 | `title: "如何学习AI"` → 文件名: `如何学习AI.md` |
| **避免特殊字符** | 不要使用空格、`?`、`&`、`=`、`+`、`%` 等特殊字符 | ❌ `How to learn?.md` → ✅ `如何学习英语.md` |
| **使用中文标点** | 如需分隔，使用中文标点（：？）而非英文标点 | ✅ `AI时代：工具清单.md` |
| **不含编号前缀** | 不使用 `数字-标题` 格式 | ❌ `01-文章标题.md` → ✅ `文章标题.md` |

#### 2. 常见错误示例

```
❌ 错误示例：
- "How to learn english like a native speaker?.md"  # 包含空格和问号
- "01-系统思维_理解复杂问题的整体视角.md"           # 包含编号和下划线
- "在新时代如何写项目需求？.md"                      # title 是"创意的源泉"

✅ 正确示例：
- "像母语者一样学习英语.md"
- "系统思维：理解复杂问题的整体视角.md"
- "创意的源泉：如何激发和捕捉写作灵感.md"
```

#### 3. 修改文章时的检查清单

移动或重命名文章时，必须完成以下步骤：

- [ ] 移动文件到正确的分类目录 (`articles/<category>/`)
- [ ] 修改 frontmatter 中的 `category` 字段
- [ ] 确认文件名与 `title` 完全一致
- [ ] 验证浏览器中链接可访问
- [ ] 如有数据关联问题，考虑数据库迁移

#### 4. 数据库 Slug 关联

**问题背景**：数据库使用 URL 编码的 slug 作为主键来关联数据（浏览量、点赞、评论）。

```
文件系统: "系统思维：理解复杂问题的整体视角.md"
   ↓
生成 slug: "系统思维：理解复杂问题的整体视角"
   ↓
数据库存储: "%E7%B3%BB%E7%BB%9F%E6%80%9D%E7%BB%B4%EF%BC%9A%E7%90%86%E8%A7%A3%E5%A4%8D%E6%9D%82%E9%97%AE%E9%A2%98%E7%9A%84%E6%95%B4%E4%BD%93%E8%A7%86%E8%A7%92"
```

**风险**：如果文件名格式变更（如去除编号前缀），会导致数据库中旧数据找不到关联。

**处理方式**：
- 小规模调整：在数据库中手动更新 slug
- 大规模重构：清理数据库重新开始 (`npx tsx scripts/clear-db.ts`)

### 类型定义

- 优先使用 Drizzle 的类型推断：`$inferSelect`, `$inferInsert`
- 共享类型放在 `types/` 目录

### 数据库操作

- Schema 变更后运行: `npm run db:push`
- 本地开发使用 `npm run db:studio` 查看数据
- 健康检查: `npm run db:health`

### Git 提交规范

```
<type>: <description>

类型:
- feat: 新功能
- fix: 修复
- chore: 杂项（配置、依赖）
- style: 样式调整
- refactor: 重构
```

### 环境变量

- `.env.local` 本地开发（不提交）
- `.env.example` 变量模板（提交）
- 生产环境变量在部署平台配置

## 文章分类 (CATEGORIES)

- `ai` - AI 工具与协作实践
- `society` - 社会心理与人际关系
- `science` - 逻辑、数学与思维方法
- `health` - 身心状态与精力管理
- `essays` - 阅读、写作与个人随感
- `products` - 项目需求、工具与产品实践

## Claude Code 工具

项目配置了以下 Claude Code 工具来提升开发效率：

### Commands (快捷命令)

- **/new-post** - 快速创建新文章模板
  - 自动生成 frontmatter
  - 创建文件到对应分类目录

### Skills (智能工具)

- **article-optimizer** - 文章优化
  - 检查 frontmatter 完整性
  - 验证文件名与 title 一致性
  - 分析内容质量
  - 自动修复格式问题

### Agents (自主助手)

- **content-manager** - 内容管理
  - 批量检查文章
  - 重建内容索引
  - 检查死链
  - 分析内容质量

### Hooks (自动化规则)

- **before-edit** - 编辑前自动备份
  - 修改 `.md` 文件前自动创建备份
  - 备份存储在 `.claude/backups/`

详细说明见：[`.claude/README.md`](.claude/README.md)

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 数据库
npm run db:push       # 推送 schema 变更
npm run db:studio     # 打开数据库管理界面
npm run db:health     # 检查数据库连接

# 查看统计数据
npm run stats:view
```

## 更新日志

| 日期 | 问题/规范 | 说明 |
|------|----------|------|
| 2025-01-13 | 初始化文档 | 基于 git 历史记录整理 |
| 2025-01-14 | 字体系统设计规范 | 记录字重分层、颜色配合原则、特殊场景处理 |
| 2025-01-16 | Claude Code 工具配置 | 创建 Command、Skill、Agent、Hook 四种工具 |
| 2025-01-17 | 开发服务器启动失败 | 记录 ERR_CONNECTION_REFUSED 问题原因和解决方案 |
