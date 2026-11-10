const stylesheet = `:root{color-scheme:light;color:#2b251f;background:#faf6ef;font:100%/1.7 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}body{margin:0}main{max-width:38rem;margin:auto;padding:3rem 1.4rem}header,footer{padding:1rem 0;border-bottom:1px solid #ded3c5}a,.brand{color:#943e2a}h1{margin:0;font-size:2rem}h2{margin:1.8rem 0 .35rem;font-size:1.1rem}`
const pages = {
  privacy: { title: '隐私政策', other: 'support', body: `<p>适用于「人生故事」iOS App。生效日期为 2026 年 11 月 10 日。</p>
<h2>你的记录存储在哪里</h2>
<p>你创建的任务、专注记录、每日回顾、卡点、倒计时设置、榜样照片和文案存储在设备上，供 App 展示和编辑。开发者不会收到这些资料。</p>
<p>你可以在 App 内编辑或删除支持单项管理的内容。若要移除设备上的 App 数据，请在系统中选择「删除 App」。</p>
<h2>照片和提醒</h2>
<p>你选择榜样照片时，App 通过 iOS 照片选择器读取你选中的照片。专注结束提醒使用 iOS 本地通知。你可以在系统设置中调整通知权限。</p>
<h2>订阅和恢复购买</h2>
<p>购买、续订、付款和退款由 Apple 处理。App 使用 Apple StoreKit 验证订阅状态，用于开通会员功能和恢复购买。开发者不会收到你的银行卡信息。</p>
<h2>联系与隐私请求</h2>
<p>如果你对隐私有疑问，或希望了解如何处理你的记录，请发送邮件至 <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a>。我们使用你主动提供的邮箱和问题说明来回复和处理反馈。</p>` },
  support: { title: '技术支持', other: 'privacy', body: `<h2>购买后会员状态没有更新</h2>
<p>打开「设置 → 故事订阅」，确认使用购买时的 Apple 账户，然后点「恢复购买」。</p>
<h2>管理订阅或取消续订</h2>
<p>在「故事订阅」中点「管理订阅」，也可以在 iPhone 的「设置 → Apple 账户 → 订阅」中查看或取消续订。</p>
<h2>收不到专注提醒</h2>
<p>请在 iPhone 的「设置 → 通知 → 人生故事」中检查是否允许通知，并确认当前的专注模式是否限制了通知。</p>
<h2>联系我们</h2>
<p>客服邮箱为 <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a>。</p>
<p>反馈时可以附上 App 版本、iOS 版本和复现步骤。请勿提供账户密码、验证码或付款信息。</p>` },
} as const

export const dynamicParams = false

export function generateStaticParams() {
  return [{ document: 'privacy' }, { document: 'support' }]
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ document: string }> },
) {
  const { document } = await params
  if (document !== 'privacy' && document !== 'support') {
    return new Response(null, { status: 404 })
  }
  const { title, body, other } = pages[document]
  const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · 人生故事</title>
<style>${stylesheet}</style>
</head>
<body>
<main>
<header><p class="brand">人生故事</p><h1>${title}</h1></header>
${body}
<footer><a href="/life-story/${other}">${pages[other].title}</a></footer>
</main>
</body>
</html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}
