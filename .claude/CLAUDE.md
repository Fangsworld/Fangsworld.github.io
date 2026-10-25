# 项目开发规范

## 当前架构

- Next.js 16 App Router + React 19 + TypeScript。
- 内容来自 `articles/<category>/*.md`，使用 gray-matter 和 marked，不是 MDX 页面体系。
- Neon PostgreSQL + Drizzle 保存统计、点赞和评论；正文不等待互动查询。
- 普通 CSS + CSS Modules，没有 Tailwind。共享变量在 `app/globals.css`，组件样式逐步迁移到组件旁的模块文件。
- 开发、构建、环境变量及修改入口以根目录 `README.md` 为准。

## 日常修改

1. 用 `npm run dev:offline` 调整内容和样式，保持服务器运行并利用热更新。
2. 修改实际使用的组件与样式；不要同步维护旧站点 `styles/main.css`。
3. 一次只调整一个区域；移动样式时保持视觉不变，设计调整单独进行。
4. 颜色、字号、间距优先引用共享变量。文章正文排版与卡片、评论样式分开维护。
5. 运行 `npm run check`；发布前执行构建并查看首页、分类页、文章页和搜索的桌面/手机布局。
6. 使用数据库功能时运行正常开发模式；离线预览不代表数据库功能已验证。

`Index.html`、`styles/main.css`、`scripts/app.js` 是旧版参考文件，不是 Next.js 页面入口。未确认用途前不删除，日常修改不需要同步它们。

## 内容与链接

主站分类是 `ai`、`society`、`science`、`health`、`essays`、`products`。导入资料目录 `articles/external/` 不在默认读取范围内。

当前文件名构成 slug，分类构成 URL 的另一部分。标题可以直接修改，不要求文件名等于标题。已有文章文件名、分类应保持稳定；若必须变更，先制定旧链接重定向和数据库关联迁移，保留统计、点赞和评论。不得通过清空数据库解决关联问题。

数据库存储的 slug 使用 URL 编码；注意原始中文、路由参数和数据库值的边界，避免重复编码。不要在样式修改中顺带批量重命名文章。

marked v17 的代码渲染器接收 token 对象；以 `lib/markdown.ts` 和已安装类型定义为准，不使用旧版位置参数签名。

## 互动与权限

- `DISABLE_DATABASE=true` 关闭数据库功能，用于本地快速预览。
- `DATABASE_URL` 和 `ADMIN_API_TOKEN` 只配置在服务端，不使用 `NEXT_PUBLIC_` 前缀。
- 所有 `/api/admin/comments` 管理操作必须先通过共享 `requireAdmin` 校验，再访问数据库。未配置 token 时默认关闭。
- 鉴权回归测试：`node --test tests/admin-auth.test.mjs`（本地 Node.js 22.18+ / 24+）。
- Schema 或数据迁移单独计划、备份和验证；不要在普通 UI 调整中自动执行 `db:push` 或数据清理脚本。

## 开发环境

启动失败时先看终端错误、端口占用和当前项目的开发服务器；只停止确认属于本项目的进程，不批量杀掉所有 Node 进程。

若读取文件、lint 或编译异常缓慢，检查文件是否已下载到本地。macOS 云同步的 `dataless` 文件可能触发按需下载；需要结合实际时间测量确认，不能一概归因于框架。

`npm run check` 验证应用代码；`scripts/` 是独立维护工具，改动时单独检查。`.claude/` 中的内容辅助命令、备份脚本是开发工具，不是线上运行依赖。
