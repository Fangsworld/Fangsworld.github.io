import { CategoryHeader } from '@/components/articles/CategoryHeader';
import { ArticleList } from '@/components/articles/ArticleList';
import { getAllArticlesCached, getArticlesByCategoryCached } from '@/lib/cache';
import { Category, CATEGORIES, CATEGORY_NAMES, ESSAY_CATEGORIES } from '@/types/article';
import { notFound, permanentRedirect } from 'next/navigation';

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

  if (category !== 'essays' && ESSAY_CATEGORIES.includes(category)) {
    permanentRedirect('/essays');
  }

  const articles = category === 'essays'
    ? getAllArticlesCached().filter((article) => ESSAY_CATEGORIES.includes(article.category))
    : getArticlesByCategoryCached(category);

  return (
    <div className="container section-page">
      <CategoryHeader category={category} />
      <ArticleList articles={articles} className="articles-grid" />
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
