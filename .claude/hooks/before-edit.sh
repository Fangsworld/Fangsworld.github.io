#!/bin/bash
# Before Edit Hook
# 在使用 Edit 工具修改文件前自动执行

# 获取要编辑的文件路径
FILE_PATH="$1"

# 创建备份目录
BACKUP_DIR=".claude/backups"
mkdir -p "$BACKUP_DIR"

# 如果文件存在且在 articles 目录下，创建备份
if [[ -f "$FILE_PATH" && "$FILE_PATH" =~ articles/.*\.md$ ]]; then
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    FILENAME=$(basename "$FILE_PATH")
    BACKUP_PATH="$BACKUP_DIR/${TIMESTAMP}_${FILENAME}"

    # 创建备份
    cp "$FILE_PATH" "$BACKUP_PATH"
    echo "✅ 已备份文件: $BACKUP_PATH"
fi
