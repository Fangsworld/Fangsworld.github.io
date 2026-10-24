// 文章分类类型
export type Category = 'ai' | 'society' | 'science' | 'health' | 'essays' | 'products';

// 文章元数据接口
export interface ArticleMetadata {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  category: Category;
  slug: string;
  views?: number;  // 可选的浏览量
}

// 完整文章接口
export interface Article extends ArticleMetadata {
  content: string; // HTML 或 MDX 序列化后的内容
}

// 分类名称映射
export const CATEGORY_NAMES: Record<Category, string> = {
  ai: 'AI',
  society: '社会',
  science: '科学',
  health: '健康',
  essays: '随感',
  products: '产品',
};

// 获取分类名称
export function getCategoryName(category: Category): string {
  return CATEGORY_NAMES[category] || category;
}

// 所有分类列表
export const CATEGORIES: Category[] = ['ai', 'society', 'science', 'health', 'essays', 'products'];
