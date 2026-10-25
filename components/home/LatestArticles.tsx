import { ArticleMetadata } from '@/types/article';
import { ArticleList } from '@/components/articles/ArticleList';

export function LatestArticles({ articles }: { articles: ArticleMetadata[] }) {
  return (
    <section className="latest-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">最近更新</h2>
          <p className="section-subtitle">分享最新的思考与创作</p>
        </div>
        <ArticleList articles={articles} className="latest-articles" />
      </div>
    </section>
  );
}
