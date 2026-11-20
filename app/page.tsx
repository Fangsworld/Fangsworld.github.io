import { getViewCounts } from '@/lib/view-counts';

export const revalidate = 120;
import { HeroSection } from '@/components/home/HeroSection';
import { LatestArticles } from '@/components/home/LatestArticles';
import { getLatestArticlesCached } from '@/lib/cache';

export default async function HomePage() {
  const counts = await getViewCounts();
  const latestArticles = getLatestArticlesCached(10).map(article => ({
    ...article, views: counts[encodeURIComponent(article.slug)],
  }));

  return (
    <>
      <HeroSection />
      <LatestArticles articles={latestArticles} />
    </>
  );
}
