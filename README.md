# 宇文平野的个人网站

基于 Next.js 16 App Router、React 19 和 TypeScript。文章来自 `articles/<category>/*.md`，由 gray-matter 和 marked 解析；Neon PostgreSQL + Drizzle 只负责浏览量、点赞和评论。样式使用普通 CSS 与组件 CSS Modules，没有 Tailwind。

## 开发与验证

本地完整验证使用 **Node.js 22.18+（或 24+）**；权限测试直接导入 TypeScript，较旧 Node.js 无法按当前命令运行。

```bash
npm ci
npm run dev:offline   # 不连接数据库，适合文章、布局和样式预览
npm run dev           # 启用已配置的数据库功能
npm run check         # 快速检查：TypeScript 与应用 lint
npm run verify        # 完整验证：lint、鉴权测试、离线构建、类型检查、静态路由测试
npm run build:offline # 不依赖数据库的生产构建
npm run build
npm start
```

`npm run verify` 按顺序运行，任一步失败即停止；先完成离线构建再检查生成的路由类型和预渲染清单。`test:static` 依赖刚生成的 `.next/prerender-manifest.json`，不要用历史构建结果代替本次验证。完整验证不连接生产数据库，但会更新本地构建产物。

不要在每次 CSS 修改后重新 build；保持开发服务器运行，通过热更新预览。`scripts/` 是独立维护工具，不在日常应用类型检查范围内；修改这些脚本时单独运行相应验证。

数据库配置写入 `.env.local` 的 `DATABASE_URL`。`DISABLE_DATABASE=true` 强制关闭数据库连接；不要在需要评论与统计的生产部署中打开此选项。离线预览用于验证内容和 UI，不证明线上数据库功能正常。修改此环境变量后需重启开发服务；生产环境修改后需重新部署。

## 评论管理接口

`GET /api/admin/comments`、`PATCH /api/admin/comments/:id`、`DELETE /api/admin/comments/:id` 都要求服务端配置 `ADMIN_API_TOKEN`，并在请求中提供 `Authorization: Bearer <token>`。未配置 token 时接口默认关闭（503），无效凭据返回 401。请使用随机长 token，只在服务端环境配置；不要使用 `NEXT_PUBLIC_` 前缀或放进客户端代码。

权限校验发生在数据库访问之前；普通读者查看已批准评论不需要管理 token。管理接口的 GET 响应禁止缓存。本地 Node.js 22.18+ / 24+ 可直接运行权限回归检查：

```bash
node --test tests/admin-auth.test.mjs
```

## 修改入口

| 需求 | 入口 |
| --- | --- |
| 首页 | `app/page.tsx`、`components/home/` |
| 分类页 | `app/[category]/page.tsx` |
| 文章详情 | `app/[category]/[slug]/page.tsx`、`components/articles/` |
| 导航、页脚 | `components/layout/` |
| 搜索 | `components/search/`、`app/api/search/route.ts` |
| 颜色、字号、间距 | `app/globals.css` 中的共享变量 |
| 组件样式 | 对应组件旁的 `*.module.css`；尚未迁移的规则在 `app/globals.css` |
| 文章解析 | `lib/articles.ts`、`lib/markdown.ts` |
| 数据库与 API | `db/`、`app/api/` |

正文内容与互动数据分开加载，数据库延迟不应阻塞正文。修改样式时优先使用已有变量，不新增另一套全局覆盖规则。

## 内容与兼容性

当前 URL 与文件名及分类有关。修改文章标题无需同步重命名文件；移动或重命名已有文章必须保留旧链接，并迁移数据库关联，不能通过清空统计或评论解决。稳定文章 ID 的迁移尚未实施。

`articles/external/` 是导入资料，目前不属于主站六个分类的默认读取范围。

## 旧版文件

`Index.html`、`styles/main.css`、`scripts/app.js` 和根目录 `images/` 是旧版静态站点材料，保留供参考，未作为当前 Next.js 的页面入口。不要同步修改旧版样式。`app/page.module.css` 是未使用的模板样式；`out/` 是历史构建产物，不能当作本次发布结果。确认外部用途后再归档或删除。

当前仓库提供 `edgeone.json`，声明 `nextjs` 框架、`npm run build` 和 `.next` 输出。仓库名称虽然以 `.github.io` 结尾，但本项目包含服务端 API，不能直接把 `.next` 当静态文件发布到 GitHub Pages。实际线上项目设置仍需在部署平台确认。

## 排查修改慢

分别记录开发启动、CSS 热更新、文章预览更新和生产构建耗时，不要将它们混为一个指标。首次编译和缓存后的编译应分开比较；不要在测量期间反复清理 `.next`。

本次检查发现本地部分依赖文件带有 macOS `dataless` 标记，读取可能需要云端下载。请让仓库及依赖保持本地可用，或放在不进行云端按需卸载的开发目录；这是一项待确认的环境因素，不能据此认定全部延迟都由云同步造成。

发布前至少检查首页、分类页、文章页与搜索，在桌面和手机宽度确认布局；启用数据库时另外验证评论与统计。所有生产密钥通过部署平台注入，不提交到 Git。
