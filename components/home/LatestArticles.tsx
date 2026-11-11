import { ArticleMetadata } from '@/types/article';
import { ArticleList } from '@/components/articles/ArticleList';

export function LatestArticles({ articles }: { articles: ArticleMetadata[] }) {
  return (
    <section className="latest-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">最近更新</h2>
        </div>
        <ArticleList articles={articles} className="latest-articles" />
      </div>
    </section>
  );
}
