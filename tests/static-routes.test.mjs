import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { CATEGORIES } from '../types/article.ts';

// Verify the actual production output, not just generateStaticParams in isolation.
test('production build contains every published Markdown article', () => {
  const manifest = JSON.parse(readFileSync(new URL('../.next/prerender-manifest.json', import.meta.url), 'utf8'));
  const routes = new Set(Object.keys(manifest.routes).map(route => decodeURIComponent(route)));
  let articles = 0;
  for (const category of CATEGORIES) {
    assert.ok(routes.has(`/${category}`), `Missing category: ${category}`);
    const directory = new URL(`../articles/${category}/`, import.meta.url);
    for (const filename of readdirSync(directory).filter(name => name.endsWith('.md'))) {
      const slug = filename.slice(0, -3);
      assert.ok(routes.has(`/${category}/${slug}`), `Missing static article: ${category}/${slug}`);
      articles++;
    }
  }
  assert.ok(articles > 0, 'No published Markdown articles were found');
  assert.ok(routes.has('/'), 'Missing static home page');
});
