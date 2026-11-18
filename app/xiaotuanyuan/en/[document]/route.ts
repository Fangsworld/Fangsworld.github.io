const pages = {
  privacy: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Little Reunion Photos — Privacy Policy</title><style>
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
</style></head><body><main>
<header><h1>Privacy Policy</h1><p class="meta">Little Reunion Photos · Effective November 18, 2026 · Developer Fang Liao</p></header>
<section class="summary"><p>Your photos and documents stay on your device.</p><ul><li>Photo analysis and text recognition run on your device.</li><li>The app has no account system, advertising, third-party analytics or cross-app tracking.</li><li>You choose when to export or share a file and who receives it.</li></ul></section>
<h2>Photos and documents</h2><p>The app reads photos you select or authorize through iOS. Photos, extracted text, document details, notes and organization records are stored in the app’s local storage. They are not automatically uploaded to a developer-operated server.</p>
<h2>Device permissions and protection</h2><p>You can change photo access in iOS Settings. Face ID, Touch ID and device authentication are handled by Apple. The app does not receive your biometric data. Local documents use iOS file protection.</p>
<h2>Apple services and subscriptions</h2><p>Apple may download an original photo from iCloud Photos when it is needed. Product information, purchases, renewals, payment and subscription verification are handled through Apple StoreKit. Photos and document text are not included in purchase requests. The developer does not receive your payment details.</p>
<h2>Sharing and support</h2><p>When you export a PDF or share a photo, the selected file is sent to the app or person you choose in the system share sheet. The recipient then handles it under its own policies.</p><p>You can inspect an optional recognition improvement report before choosing to share it. The report uses counts and fixed categories, without photos, extracted document text, names, dates or locations.</p><p>If you contact us by email, we use the information you choose to send to respond to your request.</p>
<h2>Deletion and backups</h2><p>Deleting a document inside the app removes its local copy and keeps the original photo in your photo library. Deleting photos from the photo library requires your confirmation and iOS confirmation. Deleted photos normally remain in Recently Deleted for 30 days.</p><p>The app’s archive folder is excluded from system backups. Deleting the app removes its local archive. Keep your original photos and export files you need to back up. Restoring a subscription restores membership, while your local documents require their own backup.</p>
<h2>Children</h2><p>The app is intended to help people organize their own and their family’s photos and documents. We do not knowingly collect children’s personal information. Minors should use the app with a parent or guardian.</p>
<h2>Updates and contact</h2><p>We may update this policy as the app changes. The effective date will be updated on this page. Changes affecting how information leaves your device will be explained in the app.</p><p>For privacy questions, contact <a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a>.</p>
<footer><a href="/xiaotuanyuan/en/support">Support</a> · <a href="/xiaotuanyuan/privacy">简体中文</a></footer>
</main></body></html>`,
  support: `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Little Reunion Photos — Support</title><style>
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
</style></head><body><main>
<header><h1>Little Reunion Photos Support</h1><p class="meta">Organize your photos and keep important documents together.</p></header>
<section class="summary"><p>Contact us</p><a href="mailto:liaofang415@gmail.com">liaofang415@gmail.com</a></section>
<h2>Membership and purchases</h2><p>Open the membership screen from the More menu in the photo library to view monthly and yearly plans, restore an active purchase or manage your Apple subscription. Purchases are handled by your Apple account.</p>
<h2>Photos and documents</h2><p>Photo analysis, text recognition and document storage run on your device. Keep your original photos and export documents you want to back up. Deleting the app removes its local archive.</p>
<p>When reporting a problem, include the app version, iOS version, what you did and what happened.</p>
<footer><a href="/xiaotuanyuan/en/privacy">Privacy Policy</a> · <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/">Terms of Use</a> · <a href="/xiaotuanyuan/support">简体中文</a></footer>
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
