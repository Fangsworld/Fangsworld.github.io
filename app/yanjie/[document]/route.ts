const stylesheet = `:root{color-scheme:light;color:#2b251f;background:#faf6ef;font:100%/1.7 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}body{margin:0}main{max-width:38rem;margin:auto;padding:3rem 1.4rem}header,footer{padding:1rem 0;border-bottom:1px solid #ded3c5}a,.brand{color:#943e2a}h1{margin:0;font-size:2rem}h2{margin:1.8rem 0 .35rem;font-size:1.1rem}`
const pages = {
  privacy: { title: '隐私政策', other: 'support', body: `<p>适用于「言界输入法」iOS App。生效日期：2026 年 11 月 25 日。</p>
<h2>本机输入与个人资料</h2><p>基础输入、个人资料和主动提交的写作训练在设备本地运行。我们不上传日常输入正文，不自动读取剪贴板，不使用广告或第三方追踪 SDK。资料仅在你选择并授权后进入键盘共享容器，可随时关闭并撤回。键盘建议保留有限的本机采用计数和不再建议设置，不保存宿主输入全文。</p>
<h2>个人表达训练</h2><p>提交片段仅临时用于本机规则分析。你点击记录后，只保存所选表达、另一种表达、取舍和复习日期，不保存整篇提交内容。你可以查看、导出或删除记录。资料不通过购买恢复自动同步；删除 App 可能丢失未备份的本地资料。</p>
<h2>可选输入统计</h2><p>输入统计默认关闭；仅在你开启独立限时授权后记录本机操作计数。扩展写回计数还需系统完全访问授权。密码、邮箱、电话号码等敏感字段会跳过，不保存输入正文。可在「分析」停止统计并管理记录。基础输入和资料只读无需完全访问。</p>
<h2>订阅与导出</h2><p>Apple 处理购买、续订、退款和付款信息。App 使用 StoreKit 核对已验证交易、商品与期限以提供权益，不接收银行卡或付款密码。同一 Apple 购买账户可恢复有效订阅。导出或分享由你主动发起，文件交给你选择的存储位置或接收方。</p>
<h2>联系与权利</h2><p>没有言界云端账号或云同步数据。你可以在 App 中管理、导出和删除本地资料与训练记录，在 Apple 账户中管理订阅。联系 <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a> 时，我们使用你主动提供的邮箱和问题说明处理反馈。请勿发送密码、验证码、付款资料或敏感输入内容。</p>` },
  support: { title: '技术支持', other: 'privacy', body: `<h2>开启输入法</h2><p>在 iPhone「设置 → 通用 → 键盘 → 键盘 → 添加新键盘」中添加言界输入法。基础输入无需订阅或完全访问。资料共享需要你在 App 中明确选择和授权。</p>
<h2>使用表达训练</h2><p>在「知识库」打开「个人表达训练」，输入一段文字，点「完成输入」，再点「看看建议」。免费查看每个片段的第一条建议。言界进阶开放全部当前规则建议、记录表达取舍、按薄弱点复习和主动关联本机资料。训练采用本机规则及关键词匹配，没有云端语义模型，不自动改写或发送宿主文字。</p>
<h2>购买与恢复</h2><p>点击页面右上角 VIP 打开「言界进阶」。月付与年付权益相同，实际价格、期限以 Apple 商品和确认页为准；当前无计时试用。购买后若权益未更新，确认使用购买时的 Apple 账户并点「恢复购买」。</p>
<h2>取消订阅</h2><p>在言界进阶中点「管理或取消订阅」，也可打开 iPhone「设置 → Apple 账户 → 订阅」。关闭续费后，已付款期限内权益继续有效。到期后仍可查看、导出和删除已保存训练记录；基础输入、现有知识卡和本人资料管理保持免费。本订阅不包含 Mac 权益。</p>
<h2>备份与反馈</h2><p>资料和训练记录保存在本机，请在删除 App 或换机前导出并核对备份。恢复购买不会同步本地资料。技术支持邮箱：<a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a>。请提供 App 版本、iOS 版本及复现步骤，不要发送密码、验证码或敏感正文。</p>
<p><a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Apple 标准使用条款</a></p>` },
} as const

const englishPages = {
  privacy: { title: 'Privacy policy', other: 'support', body: `<p>For the Yanjie Chinese Keyboard iOS app. Effective November 25, 2026.</p>
<h2>On-device input and notes</h2><p>Basic input, personal notes and writing passages you submit are processed on your device. We do not upload everyday typed text, automatically read the clipboard, or use advertising or third-party tracking SDKs. Only notes you select and authorize enter the keyboard's shared container. You can turn sharing off and withdraw them. Keyboard suggestions retain limited local usage counts and dismissal preferences, not the full text typed in other apps.</p>
<h2>Writing practice</h2><p>Submitted passages are used temporarily for local rule checks. Saving a choice keeps the selected expression, an alternative, your decision and a review date, not the whole passage. You can read, export or delete records. Restoring purchases does not sync local notes. Deleting the app may remove data that has not been backed up.</p>
<h2>Optional input statistics</h2><p>Statistics are off by default and require separate, time-limited consent. Writing counts back from the keyboard also requires Full Access. Sensitive fields such as passwords, email addresses and phone numbers are skipped; typed text is not saved. Stop statistics or manage records in Insights. Basic typing and read-only notes do not require Full Access.</p>
<h2>Subscriptions and exports</h2><p>Apple handles purchases, renewals, refunds and payment information. The app uses StoreKit to check verified transactions, products and expiry dates to provide access. It does not receive bank card details or payment passwords. The same Apple purchasing account can restore active subscriptions. Exports and sharing happen only when you choose a destination or recipient.</p>
<h2>Contact and control</h2><p>There is no Yanjie cloud account or cloud-synced data. Manage, export or delete local notes and practice records in the app, and manage subscriptions in your Apple account. If you contact <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a>, we use the email address and issue description you choose to provide to respond. Do not send passwords, verification codes, payment details or sensitive typed content.</p>` },
  support: { title: 'Support', other: 'privacy', body: `<h2>Add the keyboard</h2><p>On iPhone, open Settings → General → Keyboard → Keyboards → Add New Keyboard, then select 言界输入法. Hold the globe key in a text field to switch keyboards. Basic input does not require a subscription or Full Access. Sharing notes requires your explicit selection and consent in the app.</p>
<h2>Practice your writing</h2><p>Open Library → Writing practice. Enter a Chinese passage, tap Done typing, then Review suggestions. The first suggestion for each passage is free. Yanjie Advance unlocks all current rule suggestions, saved writing choices, spaced review and optional links to local notes. Practice uses bounded local rules and keyword matching, not a cloud language model. It does not automatically rewrite or send text in other apps.</p>
<h2>Purchase and restore</h2><p>Tap VIP on a root page to open Yanjie Advance. Monthly and yearly plans have the same features; the actual price and term appear in the app and Apple's confirmation. There is no timed trial. If purchased access has not updated, check that you are using the same Apple purchasing account and tap Restore purchases.</p>
<h2>Cancel a subscription</h2><p>Tap Manage or cancel subscription in Yanjie Advance, or open iPhone Settings → Apple Account → Subscriptions. Turning off renewal leaves access available until the paid term ends. After expiry you can still read, export and delete saved practice records. Basic typing, existing learning cards and personal note management remain free. The separate Mac app is not included.</p>
<h2>Backups and feedback</h2><p>Notes and practice records stay on your device. Export and verify backups before deleting the app or changing devices. Purchase restoration does not sync local data. Contact <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a> with your app version, iOS version and steps to reproduce the issue. Do not send passwords, verification codes or sensitive text.</p>
<p><a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Apple standard terms of use</a></p>` },
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
  const english = new URL(_request.url).searchParams.get('lang') === 'en'
  const localizedPages = english ? englishPages : pages
  const { title, body, other } = localizedPages[document]
  const brand = english ? 'Yanjie Chinese Keyboard' : '言界输入法'
  const html = `<!doctype html>
<html lang="${english ? 'en' : 'zh-CN'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · ${brand}</title>
<style>${stylesheet}</style>
</head>
<body>
<main>
<header><p class="brand">${brand}</p><h1>${title}</h1></header>
${body}
<footer><a href="/">${english ? 'Developer website' : '开发者主页'}</a> · <a href="/yanjie/${other}${english ? '?lang=en' : ''}">${localizedPages[other].title}</a> · <a href="/yanjie/${document}${english ? '' : '?lang=en'}">${english ? '中文' : 'English'}</a></footer>
</main>
</body>
</html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
