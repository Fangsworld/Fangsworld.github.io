import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleMetadata, Category, CATEGORIES } from '@/types/article';
import { getMarkdownFiles } from './markdown';
import { generateSlug } from './utils';

/**
 * 为文章列表添加浏览量数据
 */
export async function enrichArticlesWithViews(articles: ArticleMetadata[]): Promise<ArticleMetadata[]> {
  try {
    // 检查环境变量
    const dbUrl = process.env.DATABASE_URL;
    console.log('[enrichArticlesWithViews] DATABASE_URL exists:', !!dbUrl);
    console.log('[enrichArticlesWithViews] DATABASE_URL prefix:', dbUrl?.substring(0, 20) + '...');

    const { db } = await import('@/db');
    console.log('[enrichArticlesWithViews] db object:', !!db);

    if (!db) {
      console.log('[enrichArticlesWithViews] Database not available, returning articles without views');
      return articles.map(article => ({ ...article, views: 0 }));
    }

    const { getArticlesStats } = await import('@/db/queries');
    const slugs = articles.map(a => a.slug);

    console.log('[enrichArticlesWithViews] Fetching stats for slugs:', slugs.slice(0, 3));

    // 批量获取所有文章的统计数据
    const stats = await getArticlesStats(slugs);

    console.log('[enrichArticlesWithViews] Got stats count:', stats.length);
    console.log('[enrichArticlesWithViews] Sample stats:', stats.slice(0, 2));

    const statsMap = new Map(stats.map(s => [s.slug, s]));

    // 合并数据（数据库中 slug 是 URL 编码的，所以需要编码 article.slug 来匹配）
    const result = articles.map(article => ({
      ...article,
      views: statsMap.get(encodeURIComponent(article.slug))?.views || 0,
    }));

    console.log('[enrichArticlesWithViews] Result sample:', result.slice(0, 2).map(a => ({ slug: a.slug, views: a.views })));

    return result;
  } catch (error) {
    console.error('[enrichArticlesWithViews] Failed to enrich articles with views:', error);
    console.error('[enrichArticlesWithViews] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    // 出错时返回带 0 浏览量的文章
    return articles.map(article => ({ ...article, views: 0 }));
  }
}

// 内容目录路径
const CONTENT_DIR = path.join(process.cwd(), 'articles');

// 从文件名生成 slug（移除 .md 扩展名）
function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

// 读取单个文章的元数据
export function getArticleMetadata(category: Category, filename: string): ArticleMetadata {
  const filePath = path.join(CONTENT_DIR, category, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);

  return {
    id: data.id || 0,
    title: data.title || '',
    excerpt: data.excerpt || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    category,
    slug: slugFromFilename(filename),
  };
}

// 获取指定分类的所有文章元数据
export function getArticlesByCategory(category: Category): ArticleMetadata[] {
  const files = getMarkdownFiles(category);

  return files
    .map(filename => getArticleMetadata(category, filename))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取所有文章的元数据
export function getAllArticles(): ArticleMetadata[] {
  const allArticles: ArticleMetadata[] = [];

  for (const category of CATEGORIES) {
    const categoryArticles = getArticlesByCategory(category);
    allArticles.push(...categoryArticles);
  }

  // 按日期降序排序
  return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取最新的 N 篇文章
export function getLatestArticles(limit: number = 10): ArticleMetadata[] {
  const allArticles = getAllArticles();
  return allArticles.slice(0, limit);
}

// 根据 slug 和分类获取文章元数据
export function getArticleBySlug(category: Category, slug: string): ArticleMetadata | null {
  const filename = `${slug}.md`;
  const filePath = path.join(CONTENT_DIR, category, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return getArticleMetadata(category, filename);
}

// 根据关键词搜索文章
export function searchArticles(query: string): ArticleMetadata[] {
  const allArticles = getAllArticles();
  const lowercaseQuery = query.toLowerCase();

  return allArticles.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(lowercaseQuery);
    const excerptMatch = article.excerpt.toLowerCase().includes(lowercaseQuery);
    const tagsMatch = article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery));

    return titleMatch || excerptMatch || tagsMatch;
  });
}

// 获取所有文章的路径（用于静态生成）
export function getAllArticlePaths(): Array<{ category: Category; slug: string }> {
  const paths: Array<{ category: Category; slug: string }> = [];

  for (const category of CATEGORIES) {
    const files = getMarkdownFiles(category);
    for (const file of files) {
      paths.push({
        category,
        slug: slugFromFilename(file),
      });
    }
  }

  return paths;
}

// 获取指定分类的所有 slug
export function getSlugsByCategory(category: Category): string[] {
  const files = getMarkdownFiles(category);
  return files.map(slugFromFilename);
}

// 根据日期范围获取文章
export function getArticlesByDateRange(startDate: Date, endDate: Date): ArticleMetadata[] {
  const allArticles = getAllArticles();
  const start = startDate.getTime();
  const end = endDate.getTime();

  return allArticles.filter(article => {
    const articleDate = new Date(article.date).getTime();
    return articleDate >= start && articleDate <= end;
  });
}

// 根据标签获取文章
export function getArticlesByTag(tag: string): ArticleMetadata[] {
  const allArticles = getAllArticles();
  const lowercaseTag = tag.toLowerCase();

  return allArticles.filter(article =>
    article.tags.some(articleTag => articleTag.toLowerCase() === lowercaseTag)
  );
}
