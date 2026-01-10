import { HeroSection } from '@/components/home/HeroSection';
import { LatestArticles } from '@/components/home/LatestArticles';
import { getLatestArticlesCached } from '@/lib/cache';
import { enrichArticlesWithViews } from '@/lib/articles';

export default async function HomePage() {
  const latestArticles = getLatestArticlesCached(10);
  // 服务端获取浏览量数据
  const articlesWithViews = await enrichArticlesWithViews(latestArticles);

  return (
    <>
      <HeroSection />
      <LatestArticles articles={articlesWithViews} />
    </>
  );
}
