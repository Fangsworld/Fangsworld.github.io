---
title: "Next.js 个人博客网站重构"
excerpt: "使用 Next.js 14+ App Router 重构个人博客网站，实现更好的性能和开发体验。"
date: 2025-1-9
tags: ["Next.js", "React", "TypeScript", "Web开发"]
category: projects
id: 101
---

# Next.js 个人博客网站重构

这是一个完整的个人博客网站重构项目，将原有的静态 HTML 网站升级为现代化的 Next.js 应用。

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: CSS Modules + CSS Variables
- **Markdown**: marked + highlight.js
- **图标**: lucide-react
- **部署**: GitHub Pages / Vercel

## 核心功能

### 1. 动态路由系统
使用 Next.js 的动态路由实现文章分类和详情页：

```typescript
// app/[category]/page.tsx
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: Category }>;
}) {
  const { category } = await params;
  const articles = getArticlesByCategoryCached(category);
  return <CategoryTemplate category={category} articles={articles} />;
}
```

### 2. 性能优化
- **React Cache**: 缓存数据获取，避免重复读取文件
- **静态生成**: 支持 SSG/SSR 混合渲染模式
- **代码分割**: 自动优化加载性能

### 3. 内容管理
- Markdown 文件管理文章
- 自动解析 frontmatter
- 代码语法高亮
- 响应式设计

### 4. 搜索功能
- 实时搜索
- 多字段匹配（标题、摘要、标签）
- 搜索结果高亮
- 客户端搜索，零延迟

## 项目亮点

1. **类型安全**: 全面使用 TypeScript
2. **现代化架构**: App Router + Server Components
3. **优秀的开发体验**: HMR + TypeScript
4. **易于扩展**: 模块化组件设计

## 成果展示

- 📄 40+ 篇文章完美迁移
- 🎨 保留原有设计风格
- ⚡ 性能提升显著
- 🔍 新增搜索功能
- 💻 代码高亮支持

## 技术难点与解决方案

### 问题1: 中文文件名 URL 编码
```typescript
// 解决方案：URL 解码
const decodedSlug = decodeURIComponent(slug);
```

### 问题2: Hydration 错误
```typescript
// 解决方案：添加 suppressHydrationWarning
<body className={inter.className} suppressHydrationWarning>
```

### 问题3: 代码高亮集成
```typescript
// 解决方案：使用 marked + highlight.js
marked.setOptions({
  renderer: {
    code(code, language) {
      const highlighted = hljs.highlight(code, { language }).value;
      return `<pre><code class="hljs">${highlighted}</code></pre>`;
    },
  },
});
```

## 未来规划

- [ ] 实现管理后台
- [ ] 添加评论系统
- [ ] RSS 订阅
- [ ] 深色模式
- [ ] 文章阅读进度条

## 项目地址

GitHub: [fangsworld/fangsworld.github.io](https://github.com/Fangsworld/fangsworld.github.io)
