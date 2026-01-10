'use client';

import { useState, useEffect } from 'react';
import { ArticleMetadata } from '@/types/article';
import { ArticleCard } from '@/components/articles/ArticleCard';

interface LatestArticlesProps {
  articles: ArticleMetadata[];
}

export function LatestArticles({ articles: initialArticles }: LatestArticlesProps) {
  const [articles, setArticles] = useState<ArticleMetadata[]>(initialArticles);

  // 客户端获取浏览量数据
  useEffect(() => {
    async function loadViews() {
      try {
        const slugs = articles.map(a => encodeURIComponent(a.slug));
        const response = await fetch(`/api/articles/batch-stats?slugs=${slugs.join(',')}`);
        if (response.ok) {
          const stats = await response.json();
          const statsMap = new Map(stats.map((s: { slug: string; views: number }) => [s.slug, s.views]));

          setArticles(prev => prev.map(article => ({
            ...article,
            views: statsMap.get(encodeURIComponent(article.slug)) || article.views || 0,
          })));
        }
      } catch (error) {
        console.error('Failed to load views:', error);
      }
    }

    loadViews();
  }, [initialArticles]);

  return (
    <section className="latest-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">最近更新</h2>
          <p className="section-subtitle">分享最新的思考与创作</p>
        </div>
        <div className="latest-articles">
          {articles.map((article) => (
            <ArticleCard key={`${article.category}-${article.slug}`} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
