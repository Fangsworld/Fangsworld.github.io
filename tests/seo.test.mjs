import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { load } from 'cheerio';
import { pageMetadata, SITE_TITLE } from '../lib/seo.ts';

const html = pathname => load(readFileSync(new URL(`../.next/server/app/${pathname}.html`, import.meta.url), 'utf8'));

test('home positioning appears in title, description and sharing metadata', () => {
  const $ = html('index');
  assert.equal($('title').text(), SITE_TITLE);
  assert.match($('meta[name="description"]').attr('content'), /跨学科的 AI 实践者/);
  assert.equal(new URL($('link[rel="canonical"]').attr('href')).href, 'https://www.yuwenpingye.com/');
  assert.equal($('meta[property="og:image"]').attr('content'), 'https://www.yuwenpingye.com/share/home');
  assert.equal($('meta[name="twitter:card"]').attr('content'), 'summary_large_image');
});

test('work metadata is specific to the work and has no duplicated author suffix', () => {
  const $ = html('projects/milo');
  assert.equal($('title').text(), '一念 · One Thought｜宇文平野');
  assert.equal($('meta[property="og:url"]').attr('content'), $('link[rel="canonical"]').attr('href'));
  assert.equal($('meta[property="og:image"]').attr('content'), 'https://www.yuwenpingye.com/share/projects/milo');
});

test('canonical and article image URLs encode Chinese slugs once', () => {
  const metadata = pageMetadata('如何阅读？', '文章摘要', '/essays/如何阅读？', { article: true, date: '2026-11-20' });
  assert.equal(metadata.alternates.canonical, 'https://www.yuwenpingye.com/essays/%E5%A6%82%E4%BD%95%E9%98%85%E8%AF%BB%EF%BC%9F');
  assert.equal(metadata.openGraph.type, 'article');
  assert.match(metadata.openGraph.images[0].url, /\/share\/essays\//);
  assert.ok(!metadata.openGraph.images[0].url.includes('%25'));
});

test('sitemap lists public pages and works, without redirected categories or APIs', () => {
  const xml = readFileSync(new URL('../.next/server/app/sitemap.xml.body', import.meta.url), 'utf8');
  const $ = load(xml, { xmlMode: true });
  const urls = $('loc').map((_, element) => $(element).text()).get();
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(urls.includes('https://www.yuwenpingye.com/projects/mindlab'));
  assert.ok(urls.every(url => url.startsWith('https://www.yuwenpingye.com/')));
  assert.ok(urls.every(url => !/\/(society|science|health)$|\/api\//.test(url)));
  assert.match(readFileSync(new URL('../.next/server/app/robots.txt.body', import.meta.url), 'utf8'), /Sitemap: https:\/\/www.yuwenpingye.com\/sitemap.xml/);
});

test('Chinese sharing cover is generated as a real PNG', () => {
  const png = readFileSync(new URL('../.next/server/app/share/home.body', import.meta.url));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
