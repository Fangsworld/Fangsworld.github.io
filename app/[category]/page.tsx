import { CategoryHeader } from '@/components/articles/CategoryHeader';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { getArticlesByCategoryCached } from '@/lib/cache';
import { enrichArticlesWithViews } from '@/lib/articles';
import { Category, CATEGORIES, CATEGORY_NAMES } from '@/types/article';
import { notFound } from 'next/navigation';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: Category }>;
}) {
  const { category } = await params;

  // 验证分类是否有效
  if (!CATEGORIES.includes(category)) {
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
  return CATEGORIES.map((category) => ({
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

  const categoryTitle = CATEGORY_NAMES[category] ?? category;

  return {
    title: `${categoryTitle} - 宇文平野`,
    description: `浏览宇文平野的${categoryTitle}相关文章`,
  };
}
