import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { projects } from '@/lib/projects';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/ai', '/products', '/essays', '/projects'];
  return [
    ...pages.map(path => ({ url: new URL(path, SITE_URL).href })),
    ...getAllArticles().map(article => ({
      url: new URL(`/${article.category}/${encodeURIComponent(article.slug)}`, SITE_URL).href,
    })),
    ...projects.map(project => ({ url: `${SITE_URL}/projects/${project.slug}` })),
  ];
}
