import { notFound } from 'next/navigation';
import { getArticleContentCached } from '@/lib/cache';
import { getCategoryName, formatDate } from '@/lib/utils';
import { Category, CATEGORIES } from '@/types/article';
import { getAllArticlePaths } from '@/lib/articles';
import { ArticleInteractions, ArticleViews } from '@/components/articles/ArticleInteractions';
import styles from './page.module.css';
import 'highlight.js/styles/github-dark.css';
import { Comments } from '@/components/articles/Comments';
import { BackButton } from '@/components/layout/BackButton';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

// Only known Markdown files are published; article HTML never waits for the database.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticlePaths();
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: Category; slug: string }>;
}) {
  const { category, slug } = await params;
  if (!CATEGORIES.includes(category)) notFound();

  try {
    const { frontmatter, content } = await getArticleContentCached(category, slug);

    return (
      <ArticleInteractions key={`${category}/${slug}`} slug={slug} category={category} title={frontmatter.title} excerpt={frontmatter.excerpt}>
        <ScrollToTop>
          <div className={`${styles.root} article-view-container`} style={{ opacity: 1, visibility: 'visible', transform: 'translateY(0)' }}>
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
                <ArticleViews />
              </div>

              <div className="article-view-body">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>

              <div className="article-view-tags">
                {frontmatter.tags?.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <Comments />
          </div>
        </ScrollToTop>
      </ArticleInteractions>
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
  if (!CATEGORIES.includes(category)) notFound();

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
