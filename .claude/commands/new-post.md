---
description: 快速创建一篇新文章
---

请帮我创建一篇新文章，按以下步骤：

1. 询问文章标题
2. 确定文章分类（ai/society/science/health/essays/products）
3. 询问标签（3-5个）
4. 在对应分类目录下创建文件：`articles/{分类}/{标题}.md`
5. 使用以下 frontmatter 模板：

```markdown
---
title: "{标题}"
excerpt: "简短描述文章内容（50字以内）"
date: {YYYY-MM-DD}
tags: [{标签1}, {标签2}, {标签3}]
category: {分类}
id: {自动分配一个数字ID}
---
```

6. 确认文件名与 title 完全一致
7. 提醒用户：文件创建后可在 `articles/{分类}/` 目录下找到

注意：
- 文件名必须与 title 字段完全一致
- 避免使用特殊字符（？、&、=、空格等）
- 使用中文标点而非英文标点
