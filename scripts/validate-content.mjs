#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import ts from 'typescript';

const isText = value => typeof value === 'string' && value.trim().length > 0;

// YAML may normalize impossible dates (for example February 30), so check the
// source calendar date as well as the parsed value. Legacy unpadded dates work.
function validDate(data, frontmatter) {
  const line = frontmatter.match(/^date\s*:\s*(.*?)\s*$/m)?.[1];
  const scalar = line?.replace(/\s+#.*$/, '').replace(/^(['"])(.*)\1$/, '$2');
  const match = scalar?.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[Tt ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2}))?$/);
  if (!match || !(typeof data === 'string' || data instanceof Date)) return false;
  const [, year, month, day] = match.map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return false;
  return Number.isFinite(new Date(data).getTime());
}

export function validateEntries(entries) {
  const errors = [];
  const warnings = [];
  const routes = new Map();
  const slugs = new Map();
  const ids = new Map();
  const error = (entry, message) => errors.push(`${entry.file}: ${message}`);

  for (const entry of entries) {
    const { category, filename, source } = entry;
    const slug = filename.slice(0, -3);
    const route = `/${category}/${slug}`;
    const routeKey = route.normalize('NFC');
    if (routes.has(routeKey)) error(entry, `重复路由 ${route}（另见 ${routes.get(routeKey)}）`);
    routes.set(routeKey, entry.file);

    // The current database uses slug alone, even though page URLs include category.
    const slugKey = slug.normalize('NFC');
    if (slugs.has(slugKey) && slugs.get(slugKey).category !== category) {
      error(entry, `跨分类重复 slug，会混用统计和评论（另见 ${slugs.get(slugKey).file}）`);
    }
    slugs.set(slugKey, entry);
    if (!slug.trim() || slug !== slug.trim() || /[%/?#\\\u0000-\u001f]/.test(slug)) {
      error(entry, '文件名包含不安全的路由字符或首尾空格；请规划旧链接重定向后再重命名');
    }

    let parsed;
    try {
      parsed = matter(source);
    } catch (cause) {
      error(entry, `frontmatter 解析失败：${cause.message.split('\n')[0]}`);
      continue;
    }
    const { data, content } = parsed;
    if (!source.replace(/^\uFEFF/, '').startsWith('---\n') && !source.replace(/^\uFEFF/, '').startsWith('---\r\n')) {
      error(entry, '缺少 YAML frontmatter');
    }
    for (const field of ['title', 'excerpt']) {
      if (!isText(data[field])) error(entry, `${field} 必须是非空字符串`);
    }
    if (data.category !== category) error(entry, `category 必须与目录 ${category} 一致`);
    if (!Array.isArray(data.tags) || data.tags.some(tag => !isText(tag))) {
      error(entry, 'tags 必须是字符串数组，且每项非空');
    }
    if (!validDate(data.date, source)) error(entry, 'date 缺失或无效；请使用真实日历日期 YYYY-MM-DD');
    if (!content.trim()) error(entry, '文章正文为空');
    if (data.slug !== undefined && data.slug !== slug) {
      error(entry, 'frontmatter slug 与文件名不一致；当前路由仍由文件名决定');
    }
    if (data.id !== undefined) {
      if (!Number.isSafeInteger(data.id) || data.id <= 0) {
        warnings.push(`${entry.file}: id 不是正整数；尚未用作永久文章标识`);
      } else {
        const files = ids.get(data.id) || [];
        files.push(entry.file);
        ids.set(data.id, files);
      }
    }
  }
  for (const [id, files] of ids) {
    if (files.length > 1) warnings.push(`重复 frontmatter id ${id}：${files.join('、')}；当前链接和数据库不使用该 id，本次不自动修改`);
  }
  return { errors, warnings, count: entries.length };
}

export async function validateContent(root) {
  // Read the same category registry as the application without requiring Node's
  // experimental TypeScript loader (the deployed Node 20 runtime is supported).
  const categorySource = readFileSync(path.join(root, 'types/article.ts'), 'utf8');
  const { outputText } = ts.transpileModule(categorySource, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
  });
  const { CATEGORIES } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
  if (!Array.isArray(CATEGORIES) || !CATEGORIES.length || CATEGORIES.some(category => !/^[a-z][a-z0-9-]*$/.test(category)) || new Set(CATEGORIES).size !== CATEGORIES.length) {
    throw new Error('CATEGORIES 必须是非空、无重复的安全目录名数组');
  }
  const entries = [];
  for (const category of CATEGORIES) {
    const directory = path.join(root, 'articles', category);
    for (const filename of readdirSync(directory).filter(name => name.endsWith('.md')).sort()) {
      const file = path.join('articles', category, filename);
      entries.push({ category, filename, file, source: readFileSync(path.join(root, file), 'utf8') });
    }
  }
  const result = validateEntries(entries);
  if (!entries.length) result.errors.push('未发现可发布文章');
  return { ...result, categories: CATEGORIES.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
    const result = await validateContent(root);
    for (const warning of result.warnings) console.warn(`WARN ${warning}`);
    for (const error of result.errors) console.error(`ERROR ${error}`);
    console.log(`内容验证：${result.count} 篇文章，${result.categories} 个分类，${result.errors.length} 个错误，${result.warnings.length} 个提醒。`);
    process.exitCode = result.errors.length ? 1 : 0;
  } catch (error) {
    console.error(`内容验证失败：${error.message}`);
    process.exitCode = 1;
  }
}
