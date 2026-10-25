
import styles from './ArticleCard.module.css';
import Link from 'next/link';
import { ArticleMetadata } from '@/types/article';
import { getCategoryName, formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';

interface ArticleCardProps {
  article: ArticleMetadata;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/${article.category}/${article.slug}`} className={`article-card ${styles.root}`}>
      <div className="article-meta">
        <span className={`article-category ${article.category}`}>
          {getCategoryName(article.category)}
        </span>
        <span className="article-date">{formatDate(article.date)}</span>
        <span className="article-views">
          <Eye size={12} strokeWidth={2} />
          <span>{(article.views || 0).toLocaleString()}</span>
        </span>
      </div>
      <h3 className="article-title">{article.title}</h3>
      <p className="article-excerpt">{article.excerpt}</p>
      <div className="article-footer">
        <div className="article-tags">
          {article.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
