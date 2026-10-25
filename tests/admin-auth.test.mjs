import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { readFileSync } from 'node:fs';
import { requireAdmin } from '../lib/admin-auth.server.ts';

const originalToken = process.env.ADMIN_API_TOKEN;
after(() => {
  if (originalToken === undefined) delete process.env.ADMIN_API_TOKEN;
  else process.env.ADMIN_API_TOKEN = originalToken;
});

const request = (authorization) => new Request('http://localhost/api/admin/comments', {
  headers: authorization === undefined ? {} : { authorization },
});

test('admin API fails closed when a secret is missing or blank', () => {
  delete process.env.ADMIN_API_TOKEN;
  assert.equal(requireAdmin(request('Bearer example'))?.status, 503);
  process.env.ADMIN_API_TOKEN = '   ';
  assert.equal(requireAdmin(request('Bearer example'))?.status, 503);
});

test('admin API rejects absent, malformed and incorrect credentials', () => {
  process.env.ADMIN_API_TOKEN = 'a-private-test-token';
  for (const authorization of [undefined, 'Basic a-private-test-token', 'Bearer wrong', 'Bearer a-private-test-token extra', 'Bearer a']) {
    const response = requireAdmin(request(authorization));
    assert.equal(response?.status, 401);
    assert.equal(response?.headers.get('Cache-Control'), 'no-store');
  }
});

test('admin API accepts only the configured token and follows token rotation', () => {
  process.env.ADMIN_API_TOKEN = 'a-private-test-token';
  assert.equal(requireAdmin(request('Bearer a-private-test-token')), null);
  assert.equal(requireAdmin(request('bearer a-private-test-token')), null);
  process.env.ADMIN_API_TOKEN = 'a-new-private-test-token';
  assert.equal(requireAdmin(request('Bearer a-private-test-token'))?.status, 401);
  assert.equal(requireAdmin(request('Bearer a-new-private-test-token')), null);
});

test('every admin handler guards before database access', () => {
  const list = readFileSync(new URL('../app/api/admin/comments/route.ts', import.meta.url), 'utf8');
  const detail = readFileSync(new URL('../app/api/admin/comments/[id]/route.ts', import.meta.url), 'utf8');
  for (const source of [list, ...detail.split(/export async function /).slice(1)]) {
    const guard = source.indexOf('const rejection = requireAdmin(request)');
    assert.ok(guard >= 0);
    assert.ok(source.indexOf('if (rejection) return rejection;', guard) > guard);
    assert.ok(source.indexOf("await import('@/db/queries')") > guard);
  }
});
