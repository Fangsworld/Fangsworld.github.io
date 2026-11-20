import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

function loadCounts({ enabled = true, query = async () => [] } = {}) {
  const source = fs.readFileSync(new URL('../lib/view-counts.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const compiled = { exports: {} };
  const dependencies = {
    'next/cache': { unstable_cache: fn => fn },
    '@/db': { isDatabaseEnabled: enabled },
    '@/db/queries': { getArticlesStats: query },
    './articles': { getAllArticles: () => [{ slug: '如何学习？' }, { slug: 'new-article' }] },
  };
  new Function('require', 'exports', code)(name => dependencies[name], compiled.exports);
  return compiled.exports.getViewCounts;
}

test('initial snapshot preserves real counts and includes zero for unread articles', async () => {
  const slug = encodeURIComponent('如何学习？');
  const counts = await loadCounts({ query: async () => [{ slug, views: 42 }] })();
  assert.equal(counts[slug], 42);
  assert.equal(counts['new-article'], 0);
});

test('offline mode skips database calls and does not invent zero counts', async () => {
  const counts = await loadCounts({ enabled: false, query: () => { throw new Error('Must not query'); } })();
  assert.deepEqual(counts, {});
});

test('database failure leaves article content available without fake counts', async () => {
  assert.deepEqual(await loadCounts({ query: async () => { throw new Error('Unavailable'); } })(), {});
});
