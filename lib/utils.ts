// 通用工具函数

import { CATEGORY_NAMES, type Category } from '@/types/article';

// 格式化日期 - 使用阿拉伯数字避免 hydration 错误
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

// 从标题生成 slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-_]/g, '') // 移除特殊字符（保留下划线和连字符）
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/-+/g, '-') // 多个连字符替换为单个
    .trim();
}

// 延迟执行
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取分类名称
export function getCategoryName(category: string): string {
  return CATEGORY_NAMES[category as Category] || category;
}
