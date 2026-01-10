import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, Renderer } from 'marked';
import { Category } from '@/types/article';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// 创建自定义渲染器以支持代码高亮
const renderer = new Renderer();

// 重写代码块渲染方法
renderer.code = function(code, language) {
  const lang = language && hljs.getLanguage(language) ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: lang }).value;
  return `<pre class="hljs"><code class="hljs language-${lang}" data-language="${lang}">${highlighted}</code></pre>`;
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

// 获取指定目录下的所有 Markdown 文件
export function getMarkdownFiles(category: Category): string[] {
  const categoryPath = path.join(CONTENT_DIR, category);

  if (!fs.existsSync(categoryPath)) {
    return [];
  }

  const files = fs.readdirSync(categoryPath);
  return files.filter(file => file.endsWith('.md'));
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
