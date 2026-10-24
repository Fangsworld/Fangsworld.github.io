# Claude Code Tools 配置

本目录包含了为博客项目配置的 Claude Code 工具。

## 📁 目录结构

```
.claude/
├── commands/        # Slash Commands (快捷命令)
│   └── new-post.md   # /new-post - 快速创建新文章
├── skills/          # Skills (智能工具)
│   └── article-optimizer/  # 文章优化 Skill
├── agents/          # Agents (自主助手)
│   └── content-manager.md  # 内容管理 Agent 说明
└── hooks/           # Hooks (自动化规则)
    └── before-edit.sh  # 编辑前自动备份
```

## 🚀 使用方法

### 1. Command: /new-post

快速创建新文章模板

```
/new-post
```

**功能**：
- 询问文章标题、分类、标签
- 自动生成 frontmatter
- 创建文件到对应目录

### 2. Skill: article-optimizer

优化文章内容和格式

```
使用 article-optimizer skill 优化这篇文章：articles/essays/xxx.md
```

**功能**：
- 检查 frontmatter 完整性
- 验证文件名与 title 一致性
- 分析内容质量并提供建议
- 自动修复格式问题

### 3. Agent: content-manager

批量管理内容

```
使用 content-manager agent 检查所有文章的 frontmatter
```

**功能**：
- 扫描所有文章
- 检查格式一致性
- 生成内容报告
- 识别需要更新的文章

**适用任务**：
- 批量检查文章
- 重建内容索引
- 检查死链
- 分析内容质量

### 4. Hook: before-edit

编辑文章前自动备份

**自动触发**：使用 Edit 工具修改 `.md` 文件时

**功能**：
- 自动创建备份到 `.claude/backups/`
- 文件名包含时间戳
- 防止误修改导致内容丢失

## 📝 启用 Hooks

Hooks 需要在 Claude Code 设置中配置：

1. 打开 Claude Code 设置
2. 找到 Hooks 配置项
3. 添加以下配置：

```json
{
  "hooks": {
    "PreToolUse": ".claude/hooks/before-edit.sh"
  }
}
```

或者设置环境变量：
```bash
export CLAUDE_HOOKS=".claude/hooks"
```

## 🗂️ 备份管理

备份文件存储在 `.claude/backups/` 目录：

```
.claude/backups/
├── 20250116_183022_如何学习逻辑？.md
├── 20250116_184530_AI时代mac工具建议清单2026年版.md
└── ...
```

定期清理旧备份：
```bash
# 删除 7 天前的备份
find .claude/backups -name "*.md" -mtime +7 -delete
```

## ⚙️ 自定义配置

### 添加新的 Command

在 `.claude/commands/` 创建 `.md` 文件：

```markdown
---
description: 命令描述
---

具体的提示词内容...
```

### 添加新的 Skill

在 `.claude/skills/` 创建目录和 `SKILL.md`：

```bash
mkdir -p .claude/skills/your-skill
touch .claude/skills/your-skill/SKILL.md
```

### 添加新的 Hook

在 `.claude/hooks/` 创建脚本文件：

```bash
#!/bin/bash
# Hook 逻辑
```

确保脚本有执行权限：
```bash
chmod +x .claude/hooks/your-hook.sh
```

## 📚 相关文档

- [Commands 说明](.claude/commands/README.md)
- [Skills 说明](.claude/skills/README.md)
- [Agents 说明](.claude/agents/README.md)
- [Hooks 说明](.claude/hooks/README.md)
