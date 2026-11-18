const pages = {
  privacy: `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>小团圆隐私政策</title>
<meta name="description" content="小团圆 App 如何处理你的照片和资料。">
<style>
:root {
  --bg: #FAF5EC; --card: #FFFFFF; --text: #2B2420; --muted: #6E625A; --accent: #B34F2B; --line: #EADFCF; --todo: #FFF1C2;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #1C1917; --card: #262220; --text: #F2ECE6; --muted: #B5A99F; --accent: #E8865C; --line: #3A322D; --todo: #5A4A1A; }
}
:root[data-theme="dark"] { --bg: #1C1917; --card: #262220; --text: #F2ECE6; --muted: #B5A99F; --accent: #E8865C; --line: #3A322D; --todo: #5A4A1A; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.75 -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
main { max-width: 720px; margin: 0 auto; padding: 40px 16px 64px; }
header { margin-bottom: 28px; }
h1 { font-size: 28px; line-height: 1.3; margin: 0 0 8px; }
.meta { color: var(--muted); font-size: 14px; margin: 0; }
.summary { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px; margin: 0 0 32px; }
.summary p { margin: 0 0 8px; font-weight: 600; }
.summary ul { margin: 0; padding-left: 20px; }
h2 { font-size: 19px; margin: 36px 0 10px; color: var(--accent); }
p, li { margin: 0 0 10px; }
ul { padding-left: 22px; }
.todo { background: var(--todo); border-radius: 4px; padding: 0 4px; }
footer { margin-top: 44px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; }
</style>
</head>
<body>
<main>
<header>
<h1>小团圆隐私政策</h1>
<p class="meta">生效日期：2026 年 11 月 18 日 · 开发者：Fang Liao</p>
</header>

<section class="summary">
<p>简单来说</p>
<ul>
<li>你的照片和资料只在你的手机上处理和保存，我们没有服务器，看不到它们。</li>
<li>没有账号、广告、第三方统计或追踪。</li>
<li>只有你自己点“分享”或“发送”时，内容才会离开手机，发给你选的对象。</li>
</ul>
</section>

<h2>1. 我们是谁</h2>
<p>“小团圆”是一款帮你整理相册、并把证件、病历、票据等重要资料单独收好的 iPhone App，由 Fang Liao 开发和运营。本政策说明 App 会处理哪些信息、为什么处理，以及你能怎么管理它们。</p>

<h2>2. App 在你手机上处理的信息</h2>
<p>以下信息都只在你的 iPhone 上处理和保存，不会上传到我们这里：</p>
<ul>
<li><strong>你授权访问的照片。</strong>App 读取照片和它的拍摄时间、拍摄地点等信息，用来按时间和地点分组、找出相似照片、识别哪些是资料。你可以在系统设置里只授权部分照片，或随时撤销授权。</li>
<li><strong>照片里的文字。</strong>App 用 iPhone 自带的文字识别功能，在手机上读出照片里的文字，用来判断它是不是资料，并填写姓名、日期、出具单位、证件编号、有效期等信息。</li>
<li><strong>收进“资料”的内容。</strong>包括资料图片的副本、识别出的文字，以及你填写或修改的姓名、日期、类别、备注等。证件、病历等可能属于敏感个人信息，它们只保存在你的手机上。</li>
<li><strong>整理记录。</strong>例如你把哪些照片标为精选或待删除、你做过的纠正（比如“这不是资料”），用来记住你的选择，避免重复处理。</li>
<li><strong>纠正统计。</strong>你修改分组或资料判断时，App 会在手机上记下这次判断的依据和修改类型，例如“两组照片相隔约 1 到 3 小时”。这些记录不含照片、文字、姓名、精确时间或地点，只在你主动发送时才会离开手机，见第 4 节。</li>
</ul>
<p>这些数据使用 iOS 文件保护加密保存在 App 里，并且不参与 iCloud 或电脑备份。</p>

<h2>3. 我们不收集什么</h2>
<ul>
<li>我们没有自己的服务器，不接收、不存储你的照片、资料或识别出的文字。</li>
<li>App 不需要注册账号，也不收集姓名、手机号、邮箱等联系方式。</li>
<li>App 不含广告，不使用第三方统计或分析工具，不追踪你在其他 App 或网站上的活动。</li>
<li>面容 ID 或触控 ID 解锁完全由 iOS 系统完成，App 拿不到你的面部或指纹数据。</li>
</ul>

<h2>4. 信息什么时候会离开你的手机</h2>
<ul>
<li><strong>你主动分享。</strong>当你分享原图、导出 PDF 时，文件会发给你在系统分享菜单里选的应用或联系人，之后由接收方按其规则处理。</li>
<li><strong>你主动发送纠正统计。</strong>在“隐私与设置 → 帮助改进识别”里，你可以先看完整的统计内容，再自己决定是否发送。统计只有数字和固定的类别名称，不含照片、文字、姓名、时间和位置。如果你发给我们，我们只用它来改进分组和资料识别的规则。</li>
<li><strong>Apple 提供的服务。</strong>如果你的原图存在 iCloud 照片里，查看时可能由系统从 iCloud 下载。订阅的购买、恢复和验证由 Apple 的 App Store 完成；我们不会收到你的付款信息，购买时也不会发送你的照片或资料。这些服务按 Apple 的隐私政策处理。</li>
</ul>

<h2>5. 删除照片</h2>
<p>App 不会自己删除你相册里的照片。只有你在“待删除”里确认后，App 才会请系统删除，系统还会再弹窗让你确认。删除的照片会进入系统相册的“最近删除”，通常可以在 30 天内恢复。</p>

<h2>6. 你可以怎么管理自己的信息</h2>
<ul>
<li>在资料详情里删除某份资料，只会删除 App 里的副本，不影响相册原图。</li>
<li>在“隐私与设置”里清除扫描记录，或查看、恢复被标为“不是资料”的内容。</li>
<li>在系统设置里修改或撤销照片访问权限。</li>
<li>删除 App 会清除它在手机上保存的全部数据。因为这些数据不参与备份，删除后无法找回，请保留好相册原图。</li>
</ul>

<h2>7. 未成年人</h2>
<p>本 App 面向成年人，用来整理自己和家人的照片与资料。我们不会有意收集未成年人的个人信息；如果你是未成年人，请在监护人的陪同下使用。</p>

<h2>8. 政策更新</h2>
<p>App 的功能变化时，我们可能更新本政策，并在本页更新生效日期。如果变化涉及信息离开手机的方式，我们会在 App 里提示你。</p>

<h2>9. 联系我们</h2>
<p>对本政策或你的信息有任何疑问，请发邮件到 <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a>。</p>

<footer>小团圆 · Fang Liao</footer>
</main>
</body>
</html>
`,
  support: `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>小团圆相册技术支持</title><style>
:root {
  --bg: #FAF5EC; --card: #FFFFFF; --text: #2B2420; --muted: #6E625A; --accent: #B34F2B; --line: #EADFCF; --todo: #FFF1C2;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #1C1917; --card: #262220; --text: #F2ECE6; --muted: #B5A99F; --accent: #E8865C; --line: #3A322D; --todo: #5A4A1A; }
}
:root[data-theme="dark"] { --bg: #1C1917; --card: #262220; --text: #F2ECE6; --muted: #B5A99F; --accent: #E8865C; --line: #3A322D; --todo: #5A4A1A; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 16px/1.75 -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
main { max-width: 720px; margin: 0 auto; padding: 40px 16px 64px; }
header { margin-bottom: 28px; }
h1 { font-size: 28px; line-height: 1.3; margin: 0 0 8px; }
.meta { color: var(--muted); font-size: 14px; margin: 0; }
.summary { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px 20px; margin: 0 0 32px; }
.summary p { margin: 0 0 8px; font-weight: 600; }
.summary ul { margin: 0; padding-left: 20px; }
h2 { font-size: 19px; margin: 36px 0 10px; color: var(--accent); }
p, li { margin: 0 0 10px; }
ul { padding-left: 22px; }
.todo { background: var(--todo); border-radius: 4px; padding: 0 4px; }
footer { margin-top: 44px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; }
</style></head>
<body><main><header><h1>小团圆相册技术支持</h1><p class="meta">整理照片，收好重要资料。</p></header>
<section class="summary"><p>联系我们</p><a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a></section>
<h2>订阅与恢复</h2><p>在相册右上角“更多”中进入会员页，可查看月付、年付方案，恢复有效购买或管理 Apple 订阅。订阅由 Apple 账户处理。</p>
<h2>照片与档案</h2><p>照片识别和资料管理在本机完成。请保留相册原件，并将需要备份的档案导出。卸载 App 会删除本机档案。</p>
<p>反馈问题时，请说明 App 版本、iOS 版本、操作步骤和出现的现象。</p>
<footer><a href="/xiaotuanyuan/privacy">隐私政策</a> · <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">使用条款</a></footer>
</main></body></html>`,
} as const

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ document: string }> },
) {
  const { document } = await params
  if (document !== 'privacy' && document !== 'support') {
    return new Response(null, { status: 404 })
  }
  return new Response(pages[document], {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
