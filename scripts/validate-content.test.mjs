import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEntries } from './validate-content.mjs';

function entry(overrides = {}) {
  return { category: 'ai', filename: '稳定链接.md', file: 'articles/ai/稳定链接.md', source: '---\ntitle: 可以修改的标题\nexcerpt: 文章摘要\ndate: 2026-1-12\ntags: [学习]\ncategory: ai\nid: 1\n---\n文章正文', ...overrides };
}

test('valid legacy date and title/filename differences preserve existing URLs', () => {
  assert.deepEqual(validateEntries([entry()]).errors, []);
});
test('impossible calendar dates are rejected even when YAML normalizes them', () => {
  assert.match(validateEntries([entry({ source: entry().source.replace('2026-1-12', '2025-02-30') })]).errors.join('\n'), /date/);
  assert.deepEqual(validateEntries([entry({ source: entry().source.replace('2026-1-12', '2024-02-29') })]).errors, []);
});
test('missing metadata, incorrect types and category mismatch fail', () => {
  const source = entry().source.replace('title: 可以修改的标题\n', '').replace('tags: [学习]', 'tags: 学习').replace('category: ai', 'category: essays');
  const errors = validateEntries([entry({ source })]).errors.join('\n');
  assert.match(errors, /title/); assert.match(errors, /tags/); assert.match(errors, /category/);
});
test('duplicate routes and cross-category slug collisions fail', () => {
  assert.match(validateEntries([entry(), entry()]).errors.join('\n'), /重复路由/);
  const other = entry({ category: 'essays', file: 'articles/essays/稳定链接.md', source: entry().source.replace('category: ai', 'category: essays') });
  assert.match(validateEntries([entry(), other]).errors.join('\n'), /跨分类重复 slug/);
});
test('malformed frontmatter and empty body fail', () => {
  assert.match(validateEntries([entry({ source: '---\ntitle: [\n---\n正文' })]).errors.join('\n'), /解析失败/);
  assert.match(validateEntries([entry({ source: entry().source.replace('文章正文', '') })]).errors.join('\n'), /正文为空/);
});
test('duplicate legacy IDs warn without breaking otherwise valid content', () => {
  const result = validateEntries([entry(), entry({ filename: '另一条链接.md', file: 'articles/ai/另一条链接.md' })]);
  assert.deepEqual(result.errors, []);
  assert.match(result.warnings.join('\n'), /重复 frontmatter id/);
});
test('percent-containing filenames and conflicting explicit slug fail', () => {
  assert.match(validateEntries([entry({ filename: '100%.md' })]).errors.join('\n'), /不安全/);
  assert.match(validateEntries([entry({ source: entry().source.replace('id: 1', 'id: 1\nslug: other') })]).errors.join('\n'), /slug 与文件名不一致/);
});
