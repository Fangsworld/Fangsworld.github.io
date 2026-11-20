import type { Metadata } from 'next';

export const SITE_URL = 'https://www.yuwenpingye.com';
export const SITE_NAME = '宇文平野';
export const SITE_TITLE = '宇文平野｜用作品书写人生';
export const SITE_DESCRIPTION = '跨学科的 AI 实践者。从认知科学、内容与传播、写作和经济的视角理解 AI，记录思考、实践与作品。';

export function pageMetadata(title: string, description: string, pathname: string, options: { article?: boolean; date?: string; tags?: string[] } = {}): Metadata {
  const url = new URL(pathname, SITE_URL).href;
  const imagePath = pathname === '/' ? '/share/home' : `/share${pathname}`;
  const image = { url: new URL(imagePath, SITE_URL).href, width: 1200, height: 630, alt: `${title} · ${SITE_NAME}` };
  const fullTitle = pathname === '/' ? SITE_TITLE : `${title}｜${SITE_NAME}`;
  const date = options.date ? new Date(options.date) : undefined;
  return {
    title: pathname === '/' ? { absolute: SITE_TITLE } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle, description, url, siteName: SITE_NAME, locale: 'zh_CN', images: [image],
      ...(options.article ? {
        type: 'article', authors: [SITE_NAME], tags: options.tags,
        ...(date && !Number.isNaN(date.getTime()) ? { publishedTime: date.toISOString() } : {}),
      } : { type: 'website' }),
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [image.url] },
  };
}
