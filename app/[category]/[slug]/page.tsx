import { notFound } from 'next/navigation';
import { getArticleContentCached } from '@/lib/cache';
import { getCategoryName, formatDate } from '@/lib/utils';
import { Eye } from 'lucide-react';
import { Category } from '@/types/article';
import { Comments } from '@/components/articles/Comments';
import { BackButton } from '@/components/layout/BackButton';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

export const dynamic = 'force-dynamic';

async function getInitialStats(slug: string, category: string, title: string, excerpt?: string) {
  try {
    const { db } = await import('@/db');
    if (!db) {
      console.log('[getInitialStats] Database not available for:', slug);
      return null;
    }

    const { getOrCreateArticle, incrementArticleViews, getArticleStats } = await import('@/db/queries');

    console.log('[getInitialStats] Before increment for:', slug);

    // 确保文章存在并记录浏览
    await getOrCreateArticle(slug, category, title, excerpt);
    await incrementArticleViews(slug);

    // 获取统计数据
    const stats = await getArticleStats(slug);

    console.log('[getInitialStats] After increment for:', slug, 'stats:', stats);

    return stats;
  } catch (error) {
    console.error('Failed to get initial stats:', error);
    return null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: Category; slug: string }>;
}) {
  const { category, slug } = await params;

  try {
    const { frontmatter, content } = await getArticleContentCached(category, slug);

    // 服务端获取统计数据
    const initialStats = await getInitialStats(slug, category, frontmatter.title, frontmatter.excerpt);

    return (
      <ScrollToTop>
        <div className="article-view-container" style={{ opacity: 1, visibility: 'visible', transform: 'translateY(0)' }}>
          <div className="article-view-header">
            <BackButton fallback="/" />
          </div>

          <div className="article-view-content">
            <h1 className="article-view-title">{frontmatter.title}</h1>
            <div className="article-view-meta">
              <span className={`article-category ${frontmatter.category}`}>
                {getCategoryName(frontmatter.category)}
              </span>
              <span className="article-date">{formatDate(frontmatter.date)}</span>
              <span className="article-views">
                <Eye size={14} strokeWidth={2} />
                <span>{(initialStats?.views || 0).toLocaleString()}</span>
              </span>
            </div>

            <div className="article-view-body">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>

            <div className="article-view-tags">
              {frontmatter.tags.map((tag: string) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>

          <Comments
            category={category}
            title={frontmatter.title}
            excerpt={frontmatter.excerpt}
            initialStats={initialStats || undefined}
          />
        </div>
      </ScrollToTop>
    );
  } catch (error) {
    console.error('Error loading article:', error);
    notFound();
  }
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: Category; slug: string }>;
}) {
  const { category, slug } = await params;

  try {
    const { frontmatter } = await getArticleContentCached(category, slug);

    return {
      title: frontmatter.title,
      description: frontmatter.excerpt,
    };
  } catch {
    return {
      title: '文章未找到',
    };
  }
}
