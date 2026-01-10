import { CategoryHeader } from '@/components/articles/CategoryHeader';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { getArticlesByCategoryCached } from '@/lib/cache';
import { enrichArticlesWithViews } from '@/lib/articles';
import { Category } from '@/types/article';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: Category }>;
}) {
  const { category } = await params;

  // 验证分类是否有效
  const validCategories: Category[] = ['reading', 'writing', 'logic', 'speech', 'projects'];
  if (!validCategories.includes(category)) {
    notFound();
  }

  const articles = getArticlesByCategoryCached(category);
  // 服务端获取浏览量数据
  const articlesWithViews = await enrichArticlesWithViews(articles);

  return (
    <div className="container">
      <CategoryHeader category={category} />
      <div className="articles-grid">
        {articlesWithViews.map((article) => (
          <ArticleCard key={`${article.category}-${article.slug}`} article={article} />
        ))}
      </div>
    </div>
  );
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  const categories: Category[] = ['reading', 'writing', 'logic', 'speech', 'projects'];
  return categories.map((category) => ({
    category,
  }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: Category }>;
}) {
  const { category } = await params;

  const categoryTitles: Record<Category, string> = {
    reading: '阅读',
    writing: '写作',
    logic: '逻辑',
    speech: '言语',
    projects: '项目',
  };

  return {
    title: `${categoryTitles[category]} - 宇文平野`,
    description: `浏览宇文平野的${categoryTitles[category]}相关文章`,
  };
}
