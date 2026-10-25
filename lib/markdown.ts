import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';
import { Category } from '@/types/article';
import hljs from 'highlight.js';

// 创建自定义渲染器以支持代码高亮
const renderer = new Renderer();

// 重写代码块渲染方法
renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre class="hljs"><code class="hljs language-${language}" data-language="${language}">${highlighted}</code></pre>`;
};

// 配置 marked
marked.setOptions({
  renderer: renderer,
  breaks: true,
  gfm: true,
});

// 文章目录路径
const CONTENT_DIR = path.join(process.cwd(), 'articles');

// 获取文章的完整路径
export function getArticlePath(category: Category, slug: string): string {
  return path.join(CONTENT_DIR, category, `${slug}.md`);
}

// 读取并解析 Markdown 文件
export async function parseMarkdownFile(category: Category, slug: string) {
  // Decode URL-encoded slug
  const decodedSlug = decodeURIComponent(slug);
  if (decodedSlug.includes('/') || decodedSlug.includes('\\') || decodedSlug === '.' || decodedSlug === '..') {
    throw new Error('Invalid article slug');
  }
  const fullPath = getArticlePath(category, decodedSlug);

  // 检查文件是否存在
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Article not found: ${category}/${decodedSlug} (original: ${slug})`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // 使用 marked 将 markdown 转换为 HTML
  const htmlContent = await marked(content);

  // 去除内容中的第一个 h1 标题（避免与页面标题重复）
  const contentWithoutTitle = htmlContent.replace(/^<h1[^>]*>.*?<\/h1>\s*/gi, '');

  return {
    frontmatter: data,
    content: contentWithoutTitle,
  };
}

// 提取文章摘要（从 HTML 内容中）
export function extractExcerpt(htmlContent: string, maxLength: number = 150): string {
  // 创建临时元素来解析 HTML
  const tempDiv = typeof window !== 'undefined'
    ? document.createElement('div')
    : null;

  if (tempDiv) {
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    tempDiv.remove();

    const cleanedText = textContent.replace(/\s+/g, ' ').trim();

    if (cleanedText.length <= maxLength) {
      return cleanedText;
    }

    return cleanedText.substring(0, maxLength) + '...';
  }

  // 服务端简单处理
  const textContent = htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (textContent.length <= maxLength) {
    return textContent;
  }

  return textContent.substring(0, maxLength) + '...';
}
