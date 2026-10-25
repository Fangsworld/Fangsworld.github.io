import { cache } from 'react';
import {
  getAllArticles,
  getArticlesByCategory,
  getArticleBySlug,
  getLatestArticles,
  searchArticles,
  getArticlesByTag,
  getArticlesByDateRange,
} from './articles';
import { Category, ArticleMetadata } from '@/types/article';

// ===== 缓存的文章元数据获取函数 =====
// 使用 React Cache 确保在单次请求中相同函数只执行一次

/**
 * 获取所有文章的缓存版本
 * 在单次渲染请求中，多次调用只会执行一次文件读取
 */
export const getAllArticlesCached = cache((): ArticleMetadata[] => {
  return getAllArticles();
});

/**
 * 获取指定分类文章的缓存版本
 */
export const getArticlesByCategoryCached = cache((category: Category): ArticleMetadata[] => {
  return getArticlesByCategory(category);
});

/**
 * 获取最新文章的缓存版本
 */
export const getLatestArticlesCached = cache((limit: number = 10): ArticleMetadata[] => {
  return getLatestArticles(limit);
});

/**
 * 根据 slug 获取文章元数据的缓存版本
 */
export const getArticleBySlugCached = cache((category: Category, slug: string): ArticleMetadata | null => {
  return getArticleBySlug(category, slug);
});

/**
 * 搜索文章的缓存版本
 */
export const searchArticlesCached = cache((query: string): ArticleMetadata[] => {
  return searchArticles(query);
});

/**
 * 根据标签获取文章的缓存版本
 */
export const getArticlesByTagCached = cache((tag: string): ArticleMetadata[] => {
  return getArticlesByTag(tag);
});

/**
 * 根据日期范围获取文章的缓存版本
 */
export const getArticlesByDateRangeCached = cache((startDate: Date, endDate: Date): ArticleMetadata[] => {
  return getArticlesByDateRange(startDate, endDate);
});

// ===== 缓存的完整文章内容获取 =====

/**
 * 获取文章完整内容（包含 frontmatter 和 body）
 * 使用缓存避免重复读取和解析 markdown 文件
 */
export const getArticleContentCached = cache(async (category: Category, slug: string) => {
  const { parseMarkdownFile } = await import('./markdown');
  return await parseMarkdownFile(category, slug);
});

// ===== 缓存失效工具 =====

/**
 * 清除所有文章相关的缓存
 * 在文章更新后调用此函数
 */
export function clearArticleCache(): void {
  // React Cache 会在每次请求后自动失效
  // 但如果需要手动控制，可以重新导出未缓存的函数
  console.log('Article cache will be cleared on next request');
}
