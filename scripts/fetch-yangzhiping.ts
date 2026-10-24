#!/usr/bin/env npx tsx
/**
 * 阳志平文章批量抓取脚本
 * 使用 cheerio 解析 HTML 内容
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://yangzhiping.com';
const OUTPUT_DIR = path.join(__dirname, '../articles/external/yangzhiping');

// 2025 年文章列表
const articles2025 = [
  { slug: '20251027', title: '我是谁？关于人生叙事的十个要点', category: '阳志平的研究', dir: 'cognitive' },
  { slug: '20251016', title: '《聪明的阅读者》自序：世界何窄，方册何宽', category: '阳志平的书', dir: 'other' },
  { slug: '20251015', title: '《人生模式》自序：我确信岁月在奔跑', category: '阳志平的书', dir: 'other' },
  { slug: '20251009', title: '秋天，关于人生发展的 24 条心得', category: '阳志平谈人生发展', dir: 'development' },
  { slug: '20250916', title: '读了这四本书，你更懂第三代认知科学', category: '阳志平的阅读', dir: 'reading' },
  { slug: '20250905', title: '《成长的心智》自序：成为自己，不完美，但美好', category: '阳志平的书', dir: 'other' },
  { slug: '20250830', title: '开智十年，谢谢你', category: '阳志平谈工作', dir: 'other' },
  { slug: '20250823', title: '演讲预告｜第一德性：人应当如何生活？', category: '阳志平谈工作', dir: 'other' },
  { slug: '20250822', title: '能动与共生！第五届开智大会来了', category: '阳志平谈工作', dir: 'other' },
  { slug: '20250812', title: '如何用诗歌对抗异化？', category: '阳志平谈写作', dir: 'other' },
  { slug: '20250713', title: '理想女孩', category: '阳志平谈教育', dir: 'other' },
  { slug: '20250705', title: '夏天，关于人生发展的 24 条心得', category: '阳志平谈人生发展', dir: 'development' },
  { slug: '20250612', title: '元学教育的若干思考', category: '阳志平谈教育', dir: 'other' },
  { slug: '20250611', title: '首先，爱自己', category: '阳志平谈教育', dir: 'other' },
  { slug: '20250610', title: '《成长的心智》新书发布会演讲：成为自己——误区与解法', category: '阳志平的书', dir: 'other' },
  { slug: '20250609', title: '人，如何成为自己？', category: '阳志平的研究', dir: 'cognitive' },
  { slug: '20250423', title: '世界何窄，方册何宽', category: '阳志平的序跋集', dir: 'other' },
  { slug: '20250422', title: '在 21 世纪如何读经典？', category: '阳志平的阅读学', dir: 'reading' },
  { slug: '20250420', title: '通识千书2025年版', category: '阳志平的阅读学', dir: 'reading' },
  { slug: '20250406', title: '外婆', category: '阳志平的生活', dir: 'other' },
  { slug: '20250402', title: '春天，关于人生发展的 24 条心得', category: '阳志平谈人生发展', dir: 'development' },
  { slug: '20250118', title: '欢迎你，开智书友会的新朋友', category: '阳志平的阅读学', dir: 'reading' },
  { slug: '20250115', title: '2024 年读书札记', category: '阳志平的阅读', dir: 'reading' },
  { slug: '20250104', title: '冬天，关于人生发展的 24 条心得', category: '阳志平谈人生发展', dir: 'development' },
];

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchArticle(url: string): Promise<{ title: string; content: string; description: string; date: string } | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    // 提取标题
    const title = $('h1').first().text().trim();

    // 提取描述
    const description = $('meta[name="description"]').attr('content') || '';

    // 提取日期
    const date = $('time').first().text().trim();

    // 提取正文内容
    const contentDiv = $('.article-content');
    let content = '';

    // 将 HTML 转换为 Markdown 格式
    contentDiv.find('h1, h2, h3, h4').each((_, el) => {
      const level = (el as any).tagName === 'h1' ? '#' : (el as any).tagName === 'h2' ? '##' : (el as any).tagName === 'h3' ? '###' : '####';
      const text = $(el).text().trim();
      content += `\n\n${level} ${text}\n\n`;
    });

    contentDiv.find('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text) content += `${text}\n\n`;
    });

    contentDiv.find('li').each((_, el) => {
      const text = $(el).text().trim();
      if (text) content += `- ${text}\n`;
    });

    // 处理 strong 标签
    content = content.replace(/<strong[^>]*>/g, '**').replace(/<\/strong>/g, '**');

    return { title, content: content.trim(), description, date };
  } catch (error) {
    console.error(`   ❌ 抓取失败: ${error}`);
    return null;
  }
}

async function saveArticle(article: typeof articles2025[0]) {
  const dir = path.join(OUTPUT_DIR, article.dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const date = article.slug.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  const filename = `${date}-${sanitizeFilename(article.title)}.md`;
  const filepath = path.join(dir, filename);

  console.log(`📥 [${articles2025.indexOf(article) + 1}/${articles2025.length}] ${article.title}`);

  const data = await fetchArticle(`${BASE_URL}/essays/${article.slug}`);

  if (!data) {
    console.log(`   ⚠️  跳过（抓取失败）`);
    return false;
  }

  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
url: "${BASE_URL}/essays/${article.slug}"
date: ${date}
originalDate: ${data.date}
category: "${article.category}"
directory: "${article.dir}"
source: "yangzhiping.com"
---

# ${article.title}

${data.description ? `> ${data.description}\n\n` : ''}${data.content}
`;

  fs.writeFileSync(filepath, frontmatter, 'utf-8');
  console.log(`   ✅ 保存: ${article.dir}/${filename}`);
  return true;
}

async function main() {
  console.log('🚀 阳志平文章批量抓取（2025年）');
  console.log('================================\n');

  let success = 0;
  let failed = 0;

  for (const article of articles2025) {
    const result = await saveArticle(article);
    if (result) success++;
    else failed++;

    // 避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 抓取完成！`);
  console.log(`   成功: ${success} 篇`);
  console.log(`   失败: ${failed} 篇`);
}

main().catch(console.error);
