'use client';

import { useEffect, useState } from 'react';
import { ArticleMetadata } from '@/types/article';
import { ArticleCard } from './ArticleCard';

export function ArticleList({ articles, className }: { articles: ArticleMetadata[]; className: string }) {
  const [views, setViews] = useState<Record<string, number>>({});
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ slugs: articles.map(article => article.slug).join(',') });
    fetch(`/api/articles/batch-stats?${params}`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Stats unavailable');
        return response.json();
      })
      .then(data => {
        setViews(Object.fromEntries((data.stats || []).map((stat: { slug: string; views: number }) => [stat.slug, stat.views])));
      })
      .catch(() => { /* Article content stays usable without statistics. */ });
    return () => controller.abort();
  }, [articles]);
  return <div className={className}>{articles.map(article => (
    <ArticleCard key={`${article.category}/${article.slug}`} article={{ ...article, views: views[encodeURIComponent(article.slug)] ?? article.views }} />
  ))}</div>;
}
