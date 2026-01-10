import { HeroSection } from '@/components/home/HeroSection';
import { LatestArticles } from '@/components/home/LatestArticles';
import { getLatestArticlesCached } from '@/lib/cache';

export default async function HomePage() {
  const latestArticles = getLatestArticlesCached(10);

  return (
    <>
      <HeroSection />
      <LatestArticles articles={latestArticles} />
    </>
  );
}
