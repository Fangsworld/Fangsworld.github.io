# Hooks 说明

## 什么是 Hooks？

Hooks 是在特定事件发生时自动执行的脚本，用于自动化重复性任务。

## 当前可用的 Hooks

### Git Pre-commit Hook ✅ 已启用

**触发时机**：执行 `git commit` 时，在提交完成前自动触发

**功能**：自动备份即将提交的文章文件

**备份位置**：`.claude/backups/`

**备份命名**：`{时间戳}_{文件名}`

例如：`20250116_214834_数学学习的方法？.md`

**状态**：✅ 已启用并正常工作

## Hook 工作原理

Git Hook 位于 `.git/hooks/pre-commit`，每次提交前会自动执行：

```bash
git commit -m "message"  # 自动触发备份
```

Hook 会扫描暂存区中 `articles/` 目录下的所有 `.md` 文件，并在提交前创建备份。

## 如何使用

无需任何配置！Hook 已经自动启用。

每次提交包含文章文件的更改时，会自动创建备份并显示：

```
✅ 已备份: 文章名.md
```

## 验证 Hook 是否生效

1. 查看备份目录：
   ```bash
   ls -la .claude/backups/
   ```

2. 修改任意文章文件并提交：
   ```bash
   # 编辑文件
   vim articles/essays/某篇文章.md

   # 添加到暂存区
   git add articles/essays/某篇文章.md

   # 提交（hook 会自动触发）
   git commit -m "更新文章"
   ```

3. 查看备份目录，应该会出现新的备份文件

## 清理旧备份

定期清理 7 天前的备份：

```bash
find .claude/backups -name "*.md" -mtime +7 -delete
```

或手动清理所有备份：

```bash
rm -rf .claude/backups/*.md
```

## Hook 脚本位置

- **实际 Hook**：`.git/hooks/pre-commit`（Git 自动执行）
- **说明文档**：`.claude/hooks/README.md`
- **手动备份脚本**：`.claude/hooks/before-edit.sh`（需手动运行）

## 技术细节

Hook 使用 `git -c core.quotepath=false` 来正确处理中文文件名，避免 Git 对非 ASCII 字符的八进制编码问题。

## 其他 Hook（手动运行）

### before-edit.sh

原始的 Claude Code Hook，由于 Claude Code CLI 的限制，无法自动触发。如需使用，可以手动运行：

```bash
.claude/hooks/before-edit.sh "文章文件路径.md"
```
