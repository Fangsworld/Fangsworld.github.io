# MCP 配置使用指南

## 已配置的 MCP Servers

### 1. blog-articles（文件系统访问）
- **功能**：直接访问博客文章目录
- **路径**：`/Users/dashulan/Documents/GitHub/fangsworld.github.io/articles`
- **用途**：读取、写入、搜索文章文件

### 2. blog-database（数据库访问）
- **功能**：访问 PostgreSQL 数据库
- **数据库**：Neon PostgreSQL
- **用途**：查询浏览量、评论、点赞等数据

### 3. web-search（搜索引擎）
- **状态**：已禁用（需要 API Key）
- **用途**：搜索最新信息

## 如何启用 MCP

### 方式 1：重启 Claude Code（推荐）

完全退出 Claude Code 并重新启动。

### 方式 2：使用命令行参数

```bash
claude --mcp-config ~/Library/Application\ Support/Claude\ Code/config.json
```

## 验证 MCP 是否工作

重启后，在 Claude Code 中询问：

```
列出所有可用的 MCP 工具
```

如果配置成功，你会看到类似：

```
Available MCP tools:
- blog-articles: read_file, write_file, list_directory, search_files
- blog-database: query, execute_sql
```

## 实际使用示例

### 示例 1：读取文章

```
使用 MCP 读取 articles/essays/如何在日常工作流中学习英语？.md
```

### 示例 2：查询数据库

```
查询浏览量最高的 5 篇文章
```

### 示例 3：批量操作

```
使用 MCP 给所有文章添加 "published: true" 字段
```

## 常见问题

### Q: MCP 没有生效？
A: 确保：
1. 完全退出了 Claude Code
2. 配置文件路径正确
3. npx 可以正常使用

### Q: 数据库连接失败？
A: 检查：
1. DATABASE_URL 是否正确
2. 网络连接是否正常
3. 数据库是否允许外部连接

### Q: 如何启用 web-search？
A: 1. 申请 Brave API Key
2. 更新配置文件中的 BRAVE_API_KEY
3. 将 disabled 改为 false

## 配置文件位置

- **macOS**: `~/Library/Application Support/Claude Code/config.json`
- **Linux**: `~/.config/claude-code/config.json`

## 更新配置

编辑配置文件后，需要重启 Claude Code 才能生效。
