import { unstable_cache } from 'next/cache';
import { isDatabaseEnabled } from '@/db';
import { getArticlesStats } from '@/db/queries';
import { getAllArticles } from './articles';

// A short-lived snapshot is included in the rendered HTML. Live counting remains
// client-side, so a slow statistics request never replaces the article itself.
export const getViewCounts = unstable_cache(async (): Promise<Record<string, number>> => {
  if (!isDatabaseEnabled) return {};
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const slugs = getAllArticles().map(article => article.slug);
    const stats = await Promise.race([
      getArticlesStats(slugs),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Statistics snapshot timed out')), 2000);
      }),
    ]);
    const counts = Object.fromEntries(slugs.map(slug => [encodeURIComponent(slug), 0]));
    for (const stat of stats) counts[stat.slug] = stat.views;
    return counts;
  } catch {
    return {};
  } finally {
    clearTimeout(timeout);
  }
}, ['article-view-counts'], { revalidate: 120 });
