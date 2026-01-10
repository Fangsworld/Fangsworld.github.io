import { ArticleMetadata } from '@/types/article';
import { ArticleCard } from '@/components/articles/ArticleCard';

interface LatestArticlesProps {
  articles: ArticleMetadata[];
}

export function LatestArticles({ articles }: LatestArticlesProps) {
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
