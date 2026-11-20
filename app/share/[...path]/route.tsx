import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getAllArticles } from '@/lib/articles';
import { projects } from '@/lib/projects';
import { CATEGORY_NAMES } from '@/types/article';
import { SITE_NAME } from '@/lib/seo';

export const dynamic = 'force-static';
export const dynamicParams = false;

function sharePages() {
  return [
    { path: ['home'], title: '用作品书写人生', label: '跨学科的 AI 实践者' },
    ...(['ai', 'products', 'essays'] as const).map(category => ({ path: [category], title: CATEGORY_NAMES[category], label: '思考与实践' })),
    { path: ['projects'], title: '把想法做成作品', label: '应用 · 工具 · 内容' },
    ...getAllArticles().map(article => ({ path: [article.category, article.slug], title: article.title, label: CATEGORY_NAMES[article.category] })),
    ...projects.map(project => ({ path: ['projects', project.slug], title: project.name, label: project.subtitle })),
  ];
}

export function generateStaticParams() {
  return sharePages().map(page => ({ path: page.path }));
}

let fontData: Promise<ArrayBuffer> | undefined;
function loadFont() {
  fontData ??= readFile(path.join(process.cwd(), 'assets/fonts/NotoSansSC-share.ttf'))
    .then(buffer => Uint8Array.from(buffer).buffer);
  return fontData;
}

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const page = sharePages().find(page => page.path.join('/') === segments.map(decodeURIComponent).join('/'));
  if (!page) return new Response('Not found', { status: 404 });
  const title = page.title.length > 65 ? `${page.title.slice(0, 64)}…` : page.title;
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: '#faf8f3', color: '#2b2926', fontFamily: 'NotoSC', borderTop: '8px solid #357366' }}>
      <div style={{ display: 'flex', fontSize: 26, color: '#357366' }}>{page.label}</div>
      <div style={{ display: 'flex', fontSize: title.length > 32 ? 46 : 60, lineHeight: 1.45, maxWidth: 1056 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#716b62' }}>
        <span>{SITE_NAME}</span><span>yuwenpingye.com</span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: [{ name: 'NotoSC', data: await loadFont(), weight: 500, style: 'normal' }] },
  );
}
